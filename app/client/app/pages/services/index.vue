<script setup lang="ts">
import { imageByKey } from '~/utils/images'
import type { ServiceCategory } from '~/types/api'

const { data: categories } = await useAsyncData('service-categories', () => useApi().get<ServiceCategory[]>('/service-categories'))
</script>

<template>
  <section class="section-services section-padding">
    <div class="container">
      <h2 class="title-h2">УСЛУГИ</h2>
      <div class="services-grid">
        <NuxtLink v-for="cat in categories" :key="cat.id" :to="`/services/${cat.slug}`" class="service-card">
          <h3 class="service-card__title">{{ cat.title }}</h3>
          <div class="service-card__visual">
            <div class="service-circle"></div>
            <img :src="imageByKey(cat.imageKey)" :alt="cat.title" class="service-img" />
          </div>
          <span class="arrow-btn">→</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.service-card {
  background: #fff9eb;
  border-radius: 35px;
  padding: 35px;
  height: 300px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
}
.service-card__title {
  font-size: 22px;
  font-weight: 800;
  max-width: 180px;
  z-index: 2;
}
.service-card__visual {
  position: absolute;
  bottom: -10px;
  right: -10px;
  width: 200px;
  height: 200px;
}
.service-circle {
  position: absolute;
  width: 160px;
  height: 160px;
  background: #f5ecd6;
  border-radius: 50%;
  bottom: 20px;
  right: 20px;
  z-index: 1;
}
.service-img {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 110%;
  z-index: 2;
  object-fit: contain;
}
.arrow-btn {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 1px solid #1a1513;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
}
@media (max-width: 768px) {
  .services-grid {
    grid-template-columns: 1fr;
  }
  .service-card {
    height: 250px;
  }
}
</style>
