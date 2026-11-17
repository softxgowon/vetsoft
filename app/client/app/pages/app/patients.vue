<script setup lang="ts">
import { SPECIES_LABELS } from '~/utils/format'
import type { Pet } from '~/types/api'

definePageMeta({ layout: 'cabinet', middleware: 'staff' })

const api = useApi()
const search = ref('')
const { data: pets, refresh } = await useAsyncData('staff-patients', () => api.get<Pet[]>('/pets', { search: search.value || undefined }))

let timer: ReturnType<typeof setTimeout> | null = null
watch(search, () => {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => refresh(), 300)
})
</script>

<template>
  <div class="page">
    <h1 class="page-title">Пациенты</h1>
    <input v-model="search" class="search" type="text" placeholder="Поиск по имени питомца, владельцу или чипу" />

    <p v-if="!pets?.length" class="empty">Ничего не найдено.</p>
    <div v-else class="grid">
      <NuxtLink v-for="pet in pets" :key="pet.id" :to="`/app/pets/${pet.id}`" class="pet-card">
        <h3>{{ pet.name }}</h3>
        <p class="muted">{{ SPECIES_LABELS[pet.species] }}<template v-if="pet.breed"> · {{ pet.breed }}</template></p>
        <p class="muted" v-if="pet.owner">{{ pet.owner.fullName }} · {{ pet.owner.phone ?? pet.owner.email }}</p>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.page-title {
  font-size: 28px;
  font-weight: 900;
}
.search {
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  background: var(--bg-card);
  font-size: 14px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
}
.pet-card {
  background: var(--bg-card);
  border-radius: 18px;
  padding: 20px;
  text-decoration: none;
  color: inherit;
}
.pet-card h3 {
  font-weight: 800;
  margin-bottom: 6px;
}
.muted {
  font-size: 12px;
  color: var(--text-gray);
  margin-top: 2px;
}
.empty {
  color: var(--text-gray);
}
</style>
