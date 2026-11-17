<script setup lang="ts">
import { useClinicStore } from '~/stores/clinic'
const clinic = useClinicStore()
onMounted(() => clinic.ensureLoaded())
</script>

<template>
  <section class="departments section-padding">
    <div class="container">
      <h2 class="section-title">Наши отделения</h2>
      <div class="departments__wrapper">
        <div class="departments__card">
          <div class="departments__card-header">
            <span class="badge">Zoo Land</span>
            <h3 class="departments__name">Центральное отделение</h3>
          </div>
          <div class="departments__info">
            <div class="info-item">
              <span class="info-item__label">Адрес:</span>
              <p class="info-item__value">{{ clinic.info?.address ?? 'г. Великий Новгород, ул. Кочетова, дом 16/46' }}</p>
            </div>
            <div class="info-item">
              <span class="info-item__label">Режим работы:</span>
              <p class="info-item__value">{{ clinic.info?.hours ?? 'Круглосуточно 24/7' }}</p>
            </div>
            <div class="info-item">
              <span class="info-item__label">Телефон:</span>
              <a :href="`tel:${(clinic.info?.phone ?? '+79999999999').replace(/\s/g, '')}`" class="info-item__value link">{{ clinic.info?.phone ?? '+7 999 999 99 99' }}</a>
            </div>
          </div>
          <div class="departments__actions">
            <NuxtLink to="/app/appointments/new" class="btn-dark">Записаться на прием</NuxtLink>
            <NuxtLink to="/center/history" class="btn-outline-small">О клинике</NuxtLink>
          </div>
        </div>

        <div class="departments__map">
          <UiClinicMap :lat="clinic.info?.lat" :lon="clinic.info?.lon" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.departments__wrapper {
  display: flex;
  border-radius: 40px;
  overflow: hidden;
  min-height: 500px;
}
.departments__card {
  flex: 1;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: var(--bg-card);
}
.badge {
  display: inline-block;
  background: #e5d1a5;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 15px;
}
.departments__name {
  font-size: 32px;
  font-weight: 900;
  margin-bottom: 40px;
  text-transform: uppercase;
}
.departments__info {
  margin-bottom: 40px;
}
.info-item {
  margin-bottom: 20px;
}
.info-item__label {
  display: block;
  font-size: 12px;
  color: var(--text-gray);
  text-transform: uppercase;
  margin-bottom: 4px;
}
.info-item__value {
  font-size: 18px;
  font-weight: 600;
  text-decoration: none;
  color: inherit;
}
.info-item__value.link:hover {
  text-decoration: underline;
}
.departments__actions {
  display: flex;
  gap: 15px;
}
.btn-dark {
  background: var(--text-black);
  color: var(--white);
  border: none;
  padding: 15px 30px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
}
.btn-outline-small {
  background: transparent;
  border: 1px solid var(--text-black);
  padding: 15px 25px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  display: inline-block;
}
.departments__map {
  flex: 1.5;
  position: relative;
  min-height: 400px;
}
.departments__map iframe {
  width: 100%;
  height: 100%;
  min-height: 400px;
  border: 0;
  filter: grayscale(0.5);
}
@media (max-width: 992px) {
  .departments__map iframe {
    border-radius: 0 0 40px 40px !important;
    min-height: 300px;
  }
  .departments__wrapper {
    flex-direction: column;
  }
  .departments__card {
    padding: 40px 20px;
  }
}
@media (max-width: 480px) {
  .departments__name {
    font-size: 24px;
  }
  .departments__actions {
    flex-direction: column;
  }
  .btn-dark,
  .btn-outline-small {
    width: 100%;
    text-align: center;
  }
  .departments__map {
    height: 300px;
    order: 2;
  }
}
@media (max-width: 360px) {
  .info-item__value {
    font-size: 16px;
  }
  .departments__wrapper {
    border-radius: 20px;
  }
}
</style>
