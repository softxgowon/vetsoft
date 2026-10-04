<script setup lang="ts">
import { imageByKey } from '~/utils/images'
import type { CheckupPackage } from '~/types/api'
const { data: packs } = await useAsyncData('checkup-packages', () => useApi().get<CheckupPackage[]>('/checkups'))
</script>

<template>
  <div class="checkup-page section-padding">
    <div class="container">
      <h1 class="title-h2">Чек-ап программы</h1>
      <div class="checkup-grid">
        <NuxtLink v-for="pack in packs" :key="pack.id" :to="`/check-up/${pack.slug}`" class="checkup-card">
          <div class="checkup-card__info">
            <h3>{{ pack.title }}</h3>
            <span class="checkup-price">{{ pack.price }} ₽</span>
          </div>
          <div class="checkup-visual">
            <div class="circle-bg"></div>
            <img :src="imageByKey(pack.imageKey)" :alt="pack.title" />
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.checkup-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
.checkup-card {
  background: #fff9eb;
  border-radius: 35px;
  padding: 30px;
  display: flex;
  justify-content: space-between;
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  height: 220px;
}
.checkup-card__info h3 {
  font-size: 20px;
  margin-bottom: 10px;
  max-width: 150px;
}
.checkup-price {
  font-weight: 800;
  font-size: 22px;
  color: #1a1513;
}
.checkup-visual {
  position: relative;
  width: 140px;
}
.checkup-visual img {
  width: 100%;
  position: relative;
  z-index: 2;
}
.circle-bg {
  position: absolute;
  width: 120px;
  height: 120px;
  background: #f5ecd6;
  border-radius: 50%;
  bottom: 0;
  right: 0;
}
@media (max-width: 768px) {
  .checkup-grid {
    grid-template-columns: 1fr;
  }
}
</style>
