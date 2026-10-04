<script setup lang="ts">
import { ApiError } from '~/composables/useApi'
import { SPECIES_LABELS } from '~/utils/format'
import type { Species } from '~/types/api'

definePageMeta({ layout: 'cabinet', middleware: 'auth' })

const pets = usePetsStore()
await pets.fetch()

const showForm = ref(false)
const form = reactive({ name: '', species: 'dog' as Species, breed: '', birthDate: '', weightKg: '' })
const error = ref('')
const saving = ref(false)

const submit = async () => {
  error.value = ''
  saving.value = true
  try {
    await pets.create({
      name: form.name.trim(),
      species: form.species,
      breed: form.breed.trim() || undefined,
      birthDate: form.birthDate || undefined,
      weightKg: form.weightKg ? Number(form.weightKg) : undefined,
    })
    form.name = ''
    form.breed = ''
    form.birthDate = ''
    form.weightKg = ''
    showForm.value = false
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : 'Не удалось добавить питомца'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="pets-page">
    <div class="page-head">
      <h1 class="page-title">Мои питомцы</h1>
      <button class="btn-dark" @click="showForm = !showForm">{{ showForm ? 'Отмена' : '+ Добавить питомца' }}</button>
    </div>

    <form v-if="showForm" class="card add-form" @submit.prevent="submit">
      <div class="grid">
        <label class="field"><span>Кличка</span><input v-model="form.name" required minlength="1" /></label>
        <label class="field">
          <span>Вид</span>
          <select v-model="form.species">
            <option v-for="(label, key) in SPECIES_LABELS" :key="key" :value="key">{{ label }}</option>
          </select>
        </label>
        <label class="field"><span>Порода</span><input v-model="form.breed" /></label>
        <label class="field"><span>Дата рождения</span><input v-model="form.birthDate" type="date" /></label>
        <label class="field"><span>Вес, кг</span><input v-model="form.weightKg" type="number" step="0.1" min="0.1" /></label>
      </div>
      <p v-if="error" class="error">{{ error }}</p>
      <button class="btn-dark" type="submit" :disabled="saving">{{ saving ? 'Сохраняем…' : 'Сохранить' }}</button>
    </form>

    <p v-if="!pets.items.length" class="empty">Питомцев пока нет — добавьте первого, чтобы вести его медкарту онлайн.</p>
    <div v-else class="pets-grid">
      <NuxtLink v-for="pet in pets.items" :key="pet.id" :to="`/app/pets/${pet.id}`" class="pet-card">
        <h3>{{ pet.name }}</h3>
        <p class="muted">{{ SPECIES_LABELS[pet.species] }}<template v-if="pet.breed"> · {{ pet.breed }}</template></p>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.pets-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
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
.btn-dark {
  background: var(--text-black);
  color: var(--white);
  border: none;
  padding: 12px 22px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
}
.btn-dark:disabled {
  opacity: 0.6;
}
.card {
  background: var(--bg-card);
  border-radius: 24px;
  padding: 24px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-bottom: 16px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
}
.field input,
.field select {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  font-size: 14px;
  font-weight: 400;
  background: var(--white);
}
.error {
  color: #c0392b;
  font-size: 13px;
  margin-bottom: 10px;
}
.pets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}
.pet-card {
  background: var(--bg-card);
  border-radius: 20px;
  padding: 22px;
  text-decoration: none;
  color: inherit;
  transition: var(--transition);
}
.pet-card:hover {
  transform: translateY(-3px);
}
.pet-card h3 {
  font-size: 18px;
  font-weight: 800;
  margin-bottom: 6px;
}
.muted {
  color: var(--text-gray);
  font-size: 13px;
}
.empty {
  color: var(--text-gray);
}
@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
