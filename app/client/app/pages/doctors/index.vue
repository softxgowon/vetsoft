<script setup lang="ts">
import type { Doctor } from '~/types/api'
const { data: doctors } = await useAsyncData('doctors-page', () => useApi().get<Doctor[]>('/doctors'))
</script>

<template>
  <section class="doctors-page">
    <div class="container section-padding">
      <h2 class="title-h2">ВРАЧИ И СПЕЦИАЛИСТЫ <br /> ВЕТЕРИНАРНОЙ КЛИНИКИ</h2>
      <div class="doctors-grid">
        <DoctorsDoctorCard v-for="doc in doctors" :key="doc.id" :doctor="doc" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.doctors-page {
  background-color: #f5ecd6;
}
.doctors-page .title-h2 {
  font-size: 48px;
  line-height: 1.1;
  margin-bottom: 50px;
  text-align: left;
}
.doctors-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25px;
}
@media (max-width: 992px) {
  .doctors-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 480px) {
  .doctors-page .title-h2 {
    font-size: 28px;
    text-align: center;
  }
}
</style>
