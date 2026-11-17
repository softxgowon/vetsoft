<script setup lang="ts">
import { ApiError } from '~/composables/useApi'
import { formatDate, SPECIES_LABELS } from '~/utils/format'
import type { LabResult, MedicalRecord, Pet, Prescription, Vaccination } from '~/types/api'

definePageMeta({ layout: 'cabinet', middleware: 'auth' })

const route = useRoute()
const petId = computed(() => String(route.params.id))
const auth = useAuthStore()
const api = useApi()

const { data: pet } = await useAsyncData(`pet-${petId.value}`, () => api.get<Pet>(`/pets/${petId.value}`))
const { data: records, refresh: refreshRecords } = await useAsyncData(`pet-records-${petId.value}`, () => api.get<MedicalRecord[]>(`/pets/${petId.value}/records`))
const { data: labs, refresh: refreshLabs } = await useAsyncData(`pet-labs-${petId.value}`, () => api.get<LabResult[]>(`/pets/${petId.value}/lab-results`))
const { data: prescriptions, refresh: refreshPrescriptions } = await useAsyncData(`pet-rx-${petId.value}`, () => api.get<Prescription[]>(`/pets/${petId.value}/prescriptions`))
const { data: vaccinations, refresh: refreshVaccinations } = await useAsyncData(`pet-vacc-${petId.value}`, () => api.get<Vaccination[]>(`/pets/${petId.value}/vaccinations`))

type Tab = 'records' | 'labs' | 'rx' | 'vacc'
const tab = ref<Tab>('records')
const tabs: { key: Tab; label: string }[] = [
  { key: 'records', label: 'История болезни' },
  { key: 'labs', label: 'Анализы' },
  { key: 'rx', label: 'Рецепты' },
  { key: 'vacc', label: 'Вакцинация' },
]

const error = ref('')
const saving = ref(false)

// -- новая запись в истории болезни
const recordForm = reactive({ diagnosis: '', complaint: '', treatment: '', recommendations: '' })
const submitRecord = async () => {
  error.value = ''
  saving.value = true
  try {
    await api.post(`/pets/${petId.value}/records`, { ...recordForm })
    Object.assign(recordForm, { diagnosis: '', complaint: '', treatment: '', recommendations: '' })
    await refreshRecords()
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : 'Не удалось сохранить запись'
  } finally {
    saving.value = false
  }
}

// -- новый рецепт
const rxForm = reactive({ medication: '', dosage: '', duration: '', instructions: '' })
const submitRx = async () => {
  error.value = ''
  saving.value = true
  try {
    await api.post(`/pets/${petId.value}/prescriptions`, { ...rxForm })
    Object.assign(rxForm, { medication: '', dosage: '', duration: '', instructions: '' })
    await refreshPrescriptions()
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : 'Не удалось сохранить рецепт'
  } finally {
    saving.value = false
  }
}

// -- новая вакцинация
const vaccForm = reactive({ vaccine: '', vaccinatedAt: '', nextDueAt: '', batchNumber: '' })
const submitVacc = async () => {
  error.value = ''
  saving.value = true
  try {
    await api.post(`/pets/${petId.value}/vaccinations`, { ...vaccForm })
    Object.assign(vaccForm, { vaccine: '', vaccinatedAt: '', nextDueAt: '', batchNumber: '' })
    await refreshVaccinations()
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : 'Не удалось сохранить вакцинацию'
  } finally {
    saving.value = false
  }
}

// -- новый результат анализа (простая форма из одной строки показателя, при желании можно добавить еще)
const labForm = reactive({ title: '', takenAt: '', conclusion: '', itemName: '', itemValue: '', itemUnit: '' })
const submitLab = async () => {
  error.value = ''
  saving.value = true
  try {
    await api.post(`/pets/${petId.value}/lab-results`, {
      title: labForm.title,
      takenAt: labForm.takenAt,
      conclusion: labForm.conclusion || undefined,
      items: labForm.itemName ? [{ name: labForm.itemName, value: labForm.itemValue, unit: labForm.itemUnit || undefined }] : [],
    })
    Object.assign(labForm, { title: '', takenAt: '', conclusion: '', itemName: '', itemValue: '', itemUnit: '' })
    await refreshLabs()
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : 'Не удалось сохранить анализ'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div v-if="pet" class="pet-page">
    <div class="pet-head">
      <h1 class="page-title">{{ pet.name }}</h1>
      <p class="muted">{{ SPECIES_LABELS[pet.species] }}<template v-if="pet.breed"> · {{ pet.breed }}</template><template v-if="pet.birthDate"> · родился {{ formatDate(pet.birthDate) }}</template></p>
    </div>

    <div class="tabs">
      <button v-for="t in tabs" :key="t.key" class="tab" :class="{ active: tab === t.key }" @click="tab = t.key">{{ t.label }}</button>
    </div>

    <p v-if="error" class="error">{{ error }}</p>

    <section v-if="tab === 'records'" class="tab-panel">
      <form v-if="auth.isStaff" class="card" @submit.prevent="submitRecord">
        <h3>Новая запись приема</h3>
        <label class="field"><span>Жалобы</span><textarea v-model="recordForm.complaint" rows="2" /></label>
        <label class="field"><span>Диагноз</span><input v-model="recordForm.diagnosis" required /></label>
        <label class="field"><span>Лечение</span><textarea v-model="recordForm.treatment" rows="2" /></label>
        <label class="field"><span>Рекомендации</span><textarea v-model="recordForm.recommendations" rows="2" /></label>
        <button class="btn-dark" type="submit" :disabled="saving">Сохранить</button>
      </form>

      <p v-if="!records?.length" class="empty">Записей пока нет.</p>
      <ul v-else class="entries">
        <li v-for="r in records" :key="r.id" class="entry">
          <div class="entry__date">{{ formatDate(r.visitedAt) }}<template v-if="r.doctor"> · {{ r.doctor.fullName }}</template></div>
          <div class="entry__title">{{ r.diagnosis }}</div>
          <p v-if="r.complaint" class="entry__row"><b>Жалобы:</b> {{ r.complaint }}</p>
          <p v-if="r.treatment" class="entry__row"><b>Лечение:</b> {{ r.treatment }}</p>
          <p v-if="r.recommendations" class="entry__row"><b>Рекомендации:</b> {{ r.recommendations }}</p>
        </li>
      </ul>
    </section>

    <section v-if="tab === 'labs'" class="tab-panel">
      <form v-if="auth.isStaff" class="card" @submit.prevent="submitLab">
        <h3>Новый результат анализа</h3>
        <label class="field"><span>Название</span><input v-model="labForm.title" required placeholder="Общий анализ крови" /></label>
        <label class="field"><span>Дата</span><input v-model="labForm.takenAt" type="date" required /></label>
        <div class="grid3">
          <label class="field"><span>Показатель</span><input v-model="labForm.itemName" placeholder="Гемоглобин" /></label>
          <label class="field"><span>Значение</span><input v-model="labForm.itemValue" placeholder="132" /></label>
          <label class="field"><span>Ед.</span><input v-model="labForm.itemUnit" placeholder="г/л" /></label>
        </div>
        <label class="field"><span>Заключение</span><textarea v-model="labForm.conclusion" rows="2" /></label>
        <button class="btn-dark" type="submit" :disabled="saving">Сохранить</button>
      </form>

      <p v-if="!labs?.length" class="empty">Анализов пока нет.</p>
      <ul v-else class="entries">
        <li v-for="l in labs" :key="l.id" class="entry">
          <div class="entry__date">{{ formatDate(l.takenAt) }}</div>
          <div class="entry__title">{{ l.title }}</div>
          <ul v-if="l.items.length" class="lab-items">
            <li v-for="(it, idx) in l.items" :key="idx">{{ it.name }}: {{ it.value }} {{ it.unit }}<template v-if="it.reference"> (норма {{ it.reference }})</template></li>
          </ul>
          <p v-if="l.conclusion" class="entry__row"><b>Заключение:</b> {{ l.conclusion }}</p>
        </li>
      </ul>
    </section>

    <section v-if="tab === 'rx'" class="tab-panel">
      <form v-if="auth.isStaff" class="card" @submit.prevent="submitRx">
        <h3>Новый рецепт</h3>
        <label class="field"><span>Препарат</span><input v-model="rxForm.medication" required /></label>
        <label class="field"><span>Дозировка</span><input v-model="rxForm.dosage" required /></label>
        <label class="field"><span>Длительность</span><input v-model="rxForm.duration" placeholder="5 дней" /></label>
        <label class="field"><span>Инструкции</span><textarea v-model="rxForm.instructions" rows="2" /></label>
        <button class="btn-dark" type="submit" :disabled="saving">Сохранить</button>
      </form>

      <p v-if="!prescriptions?.length" class="empty">Рецептов пока нет.</p>
      <ul v-else class="entries">
        <li v-for="p in prescriptions" :key="p.id" class="entry">
          <div class="entry__date">{{ formatDate(p.prescribedAt) }}<template v-if="p.doctor"> · {{ p.doctor.fullName }}</template></div>
          <div class="entry__title">{{ p.medication }} — {{ p.dosage }}</div>
          <p v-if="p.duration" class="entry__row"><b>Длительность:</b> {{ p.duration }}</p>
          <p v-if="p.instructions" class="entry__row"><b>Инструкции:</b> {{ p.instructions }}</p>
        </li>
      </ul>
    </section>

    <section v-if="tab === 'vacc'" class="tab-panel">
      <form v-if="auth.isStaff" class="card" @submit.prevent="submitVacc">
        <h3>Отметить вакцинацию</h3>
        <label class="field"><span>Вакцина</span><input v-model="vaccForm.vaccine" required /></label>
        <div class="grid3">
          <label class="field"><span>Дата</span><input v-model="vaccForm.vaccinatedAt" type="date" required /></label>
          <label class="field"><span>Следующая</span><input v-model="vaccForm.nextDueAt" type="date" /></label>
          <label class="field"><span>Серия</span><input v-model="vaccForm.batchNumber" /></label>
        </div>
        <button class="btn-dark" type="submit" :disabled="saving">Сохранить</button>
      </form>

      <p v-if="!vaccinations?.length" class="empty">Вакцинаций пока нет.</p>
      <ul v-else class="entries">
        <li v-for="v in vaccinations" :key="v.id" class="entry">
          <div class="entry__date">{{ formatDate(v.vaccinatedAt) }}</div>
          <div class="entry__title">{{ v.vaccine }}</div>
          <p v-if="v.nextDueAt" class="entry__row"><b>Следующая ревакцинация:</b> {{ formatDate(v.nextDueAt) }}</p>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.pet-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.page-title {
  font-size: 28px;
  font-weight: 900;
}
.muted {
  color: var(--text-gray);
  font-size: 14px;
  margin-top: 4px;
}
.tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.tab {
  background: var(--bg-card);
  border: none;
  padding: 10px 18px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
}
.tab.active {
  background: var(--text-black);
  color: var(--white);
}
.tab-panel {
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
  gap: 12px;
}
.card h3 {
  font-size: 15px;
  font-weight: 800;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
}
.field input,
.field textarea {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  font-size: 14px;
  font-weight: 400;
  font-family: inherit;
  background: var(--white);
  resize: vertical;
}
.grid3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.btn-dark {
  align-self: flex-start;
  background: var(--text-black);
  color: var(--white);
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
}
.btn-dark:disabled {
  opacity: 0.6;
}
.entries {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.entry {
  background: var(--white);
  border-radius: 16px;
  padding: 18px 20px;
}
.entry__date {
  font-size: 12px;
  color: var(--text-gray);
  margin-bottom: 6px;
}
.entry__title {
  font-weight: 800;
  margin-bottom: 8px;
}
.entry__row {
  font-size: 13px;
  margin-top: 4px;
  color: var(--text-black);
}
.lab-items {
  list-style: none;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.empty {
  color: var(--text-gray);
  font-size: 14px;
}
.error {
  color: #c0392b;
  font-size: 13px;
}
@media (max-width: 600px) {
  .grid3 {
    grid-template-columns: 1fr;
  }
}
</style>
