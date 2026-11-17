<script setup lang="ts">
import { ApiError } from '~/composables/useApi'
import type { Doctor, SlotsResponse } from '~/types/api'

definePageMeta({ layout: 'cabinet', middleware: 'auth' })

const api = useApi()
const route = useRoute()
const router = useRouter()
const pets = usePetsStore()
await pets.fetch()

const { data: doctors } = await useAsyncData('booking-doctors', () => api.get<Doctor[]>('/doctors'))

const petId = ref(pets.items[0]?.id ?? '')
const doctorId = ref(typeof route.query.doctorId === 'string' ? route.query.doctorId : doctors.value?.[0]?.id ?? '')
const date = ref(new Date().toISOString().slice(0, 10))
const reason = ref('')
const error = ref('')
const submitting = ref(false)

const minDate = new Date().toISOString().slice(0, 10)
const slots = ref<SlotsResponse | null>(null)
const selectedSlot = ref<string | null>(null)
const loadingSlots = ref(false)

const loadSlots = async () => {
  if (!doctorId.value || !date.value) return
  loadingSlots.value = true
  selectedSlot.value = null
  try {
    slots.value = await api.get<SlotsResponse>(`/doctors/${doctorId.value}/slots`, { date: date.value })
  } finally {
    loadingSlots.value = false
  }
}

watch([doctorId, date], loadSlots, { immediate: true })

onMounted(() => {
  const socket = useSocket().get()
  socket?.on('slots:changed', (payload: { doctorId: string; date: string }) => {
    if (payload.doctorId === doctorId.value && payload.date === date.value) loadSlots()
  })
})

const formatSlotTime = (iso: string) => new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })

const submit = async () => {
  if (!petId.value || !doctorId.value || !selectedSlot.value) return
  error.value = ''
  submitting.value = true
  try {
    await api.post('/appointments', { petId: petId.value, doctorId: doctorId.value, startsAt: selectedSlot.value, reason: reason.value.trim() || undefined })
    await router.push('/app/appointments')
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : 'Не удалось создать запись'
    await loadSlots()
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="booking-page">
    <h1 class="page-title">Запись на прием</h1>

    <p v-if="!pets.items.length" class="empty">Сначала <NuxtLink to="/app/pets">добавьте питомца</NuxtLink>, чтобы записаться к врачу.</p>

    <div v-else class="booking">
      <div class="card">
        <label class="field">
          <span>Питомец</span>
          <select v-model="petId">
            <option v-for="p in pets.items" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
        </label>

        <label class="field">
          <span>Врач</span>
          <select v-model="doctorId">
            <option v-for="d in doctors" :key="d.id" :value="d.id">{{ d.fullName }} — {{ d.position }}</option>
          </select>
        </label>

        <label class="field">
          <span>Дата</span>
          <input v-model="date" type="date" :min="minDate" />
        </label>

        <label class="field">
          <span>Причина визита (необязательно)</span>
          <textarea v-model="reason" rows="2" />
        </label>
      </div>

      <div class="card doctor-card" v-if="doctors?.find((d) => d.id === doctorId)">
        <UiDoctorAvatar class="doctor-photo" :name="doctors?.find((d) => d.id === doctorId)?.fullName ?? ''" :size="64" />
        <div>
          <h3>{{ doctors?.find((d) => d.id === doctorId)?.fullName }}</h3>
          <p class="muted">{{ doctors?.find((d) => d.id === doctorId)?.position }}</p>
        </div>
      </div>

      <div class="card">
        <h3 class="slots-title">Свободное время</h3>
        <p v-if="loadingSlots" class="empty">Загружаем расписание…</p>
        <p v-else-if="!slots?.slots.length" class="empty">На эту дату нет доступных слотов.</p>
        <div v-else class="slots-grid">
          <button
            v-for="s in slots.slots"
            :key="s.startsAt"
            class="slot"
            :class="{ selected: selectedSlot === s.startsAt, disabled: !s.available }"
            :disabled="!s.available"
            @click="selectedSlot = s.startsAt"
          >
            {{ formatSlotTime(s.startsAt) }}
          </button>
        </div>
      </div>

      <p v-if="error" class="error">{{ error }}</p>
      <button class="btn-dark" :disabled="!selectedSlot || submitting" @click="submit">{{ submitting ? 'Записываем…' : 'Подтвердить запись' }}</button>
    </div>
  </div>
</template>

<style scoped>
.booking-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.page-title {
  font-size: 28px;
  font-weight: 900;
}
.booking {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.card {
  background: var(--bg-card);
  border-radius: 20px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
}
.field select,
.field input,
.field textarea {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  font-size: 14px;
  font-weight: 400;
  font-family: inherit;
  background: var(--white);
}
.doctor-card {
  flex-direction: row;
  align-items: center;
  gap: 16px;
}
.doctor-card h3 {
  font-size: 15px;
  font-weight: 800;
}
.muted {
  font-size: 12px;
  color: var(--text-gray);
}
.slots-title {
  font-size: 14px;
  font-weight: 800;
}
.slots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 8px;
}
.slot {
  background: var(--white);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 10px 0;
  font-weight: 600;
  cursor: pointer;
  font-size: 13px;
}
.slot.selected {
  background: var(--text-black);
  color: var(--white);
  border-color: var(--text-black);
}
.slot.disabled {
  opacity: 0.35;
  cursor: not-allowed;
  text-decoration: line-through;
}
.btn-dark {
  align-self: flex-start;
  background: var(--text-black);
  color: var(--white);
  border: none;
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
}
.btn-dark:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.error {
  color: #c0392b;
  font-size: 13px;
}
.empty {
  color: var(--text-gray);
  font-size: 14px;
}
</style>
