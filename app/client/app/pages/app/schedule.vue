<script setup lang="ts">
import { formatDateTime, STATUS_LABELS } from '~/utils/format'
import type { Appointment } from '~/types/api'

definePageMeta({ layout: 'cabinet', middleware: 'staff' })

const api = useApi()
const date = ref(new Date().toISOString().slice(0, 10))
const { data: appointments, refresh } = await useAsyncData('staff-schedule', () => api.get<Appointment[]>('/appointments', { date: date.value }), { watch: [date] })

const sorted = computed(() => [...(appointments.value ?? [])].sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt)))

const updating = ref<string | null>(null)
const setStatus = async (id: string, status: string) => {
  updating.value = id
  try {
    await api.patch(`/appointments/${id}/status`, { status })
    await refresh()
  } finally {
    updating.value = null
  }
}

onMounted(() => {
  const socket = useSocket().get()
  socket?.on('appointment:changed', () => refresh())
})
</script>

<template>
  <div class="page">
    <div class="page-head">
      <h1 class="page-title">Расписание приемов</h1>
      <input v-model="date" type="date" class="date-input" />
    </div>

    <p v-if="!sorted.length" class="empty">На эту дату записей нет.</p>
    <ul v-else class="entries">
      <li v-for="a in sorted" :key="a.id" class="entry">
        <div>
          <div class="entry__title">{{ a.pet?.name }} ({{ a.pet?.owner?.fullName }})</div>
          <div class="entry__meta">{{ a.doctor?.fullName }} · {{ formatDateTime(a.startsAt) }}<template v-if="a.reason"> · {{ a.reason }}</template></div>
        </div>
        <div class="entry__right">
          <span class="badge" :class="a.status">{{ STATUS_LABELS[a.status] }}</span>
          <template v-if="a.status === 'scheduled'">
            <NuxtLink :to="`/app/pets/${a.petId}`" class="btn-outline">Медкарта</NuxtLink>
            <button class="btn-outline" :disabled="updating === a.id" @click="setStatus(a.id, 'completed')">Завершен</button>
            <button class="btn-outline" :disabled="updating === a.id" @click="setStatus(a.id, 'no_show')">Неявка</button>
          </template>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.page-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.page-title {
  font-size: 28px;
  font-weight: 900;
}
.date-input {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  background: var(--bg-card);
  font-weight: 600;
}
.entries {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.entry {
  background: var(--bg-card);
  border-radius: 18px;
  padding: 18px 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.entry__title {
  font-weight: 800;
}
.entry__meta {
  font-size: 13px;
  color: var(--text-gray);
  margin-top: 4px;
}
.entry__right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.badge {
  background: var(--white);
  padding: 6px 14px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
}
.badge.cancelled,
.badge.no_show {
  color: #c0392b;
}
.badge.completed {
  color: #2c7a4b;
}
.btn-outline {
  background: transparent;
  border: 1px solid var(--text-black);
  border-radius: 10px;
  padding: 8px 14px;
  font-weight: 600;
  cursor: pointer;
  font-size: 12px;
  text-decoration: none;
  color: inherit;
}
.empty {
  color: var(--text-gray);
}
</style>
