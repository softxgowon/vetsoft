<script setup lang="ts">
import type { CheckupPackage } from '~/types/api'
const route = useRoute()
const slug = computed(() => String(route.params.slug))
const { data: pack } = await useAsyncData(`checkup-${slug.value}`, () => useApi().get<CheckupPackage>(`/checkups/${slug.value}`))
</script>

<template>
  <div v-if="pack" class="checkup-detail section-padding">
    <div class="container">
      <div class="detail-header">
        <h1 class="title-h2">{{ pack.title }}</h1>
        <p class="subtitle">{{ pack.description }}</p>
      </div>

      <div class="inclusion-block">
        <h3>Что входит в стоимость:</h3>
        <ul class="inclusion-list">
          <li v-for="(item, i) in pack.inclusions" :key="i"><span class="check-icon">✓</span> {{ item }}</li>
        </ul>
        <div class="total-price">Итоговая стоимость: <strong>{{ pack.price }} ₽</strong></div>
        <NuxtLink :to="`/app/appointments/new?checkup=${pack.slug}`" class="btn-beige">Записаться на обследование</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.checkup-detail {
  padding: 60px 0;
}
.detail-header {
  margin-bottom: 30px;
}
.subtitle {
  font-size: 16px;
  color: var(--text-gray);
  margin-top: 10px;
  max-width: 600px;
}
.inclusion-block {
  background: #fff9eb;
  padding: 40px;
  border-radius: 40px;
  max-width: 700px;
}
.inclusion-list {
  list-style: none;
  padding: 0;
  margin: 25px 0;
}
.inclusion-list li {
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 10px;
}
.check-icon {
  color: #82a67d;
  font-weight: bold;
}
.total-price {
  font-size: 18px;
  margin: 20px 0;
  font-weight: 700;
}
@media (max-width: 768px) {
  .inclusion-block {
    padding: 25px;
    border-radius: 24px;
  }
}
</style>
