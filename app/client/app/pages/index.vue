<script setup lang="ts">
import zooLand from '~/assets/images/ZooLand.png'
import { imageByKey } from '~/utils/images'
import { useClinicStore } from '~/stores/clinic'
import type { Department, Doctor } from '~/types/api'

const { data: departments } = await useAsyncData('home-departments', () => useApi().get<Department[]>('/departments'))
const { data: doctors } = await useAsyncData('home-doctors', () => useApi().get<Doctor[]>('/doctors'))
const featuredDoctors = computed(() => (doctors.value ?? []).slice(0, 2))

const clinic = useClinicStore()
onMounted(() => clinic.ensureLoaded())
</script>

<template>
  <div class="home-content">
    <section class="section-center section-padding">
      <div class="container">
        <div class="center-grid">
          <div class="center-visual">
            <img :src="zooLand" alt="Ресепшн Zoo Land" class="rounded-img" />
            <div class="slider-dots">
              <span class="dot active"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
          </div>
          <div class="center-info">
            <h2 class="title-h2">ЦЕНТР</h2>
            <p>На сайте для вас представлена актуальная информация о ветеринарном центре, о его филиалах и различных полезных возможностях пространства Zoo Land.</p>
            <p>Мы стараемся объединить опыт лучших специалистов с современными технологиями и уютом. Мы постарались сделать всё, чтобы животным и их владельцам было комфортно у нас.</p>
            <NuxtLink to="/center" class="btn-beige">Центр</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="section-map section-padding">
      <div class="container">
        <h2 class="title-h2">ОТДЕЛЕНИЯ</h2>
        <div class="map-wrapper">
          <div class="departments__map">
            <UiClinicMap :lat="clinic.info?.lat" :lon="clinic.info?.lon" />
          </div>
          <div class="map-card">
            <h3>Основная клиника</h3>
            <p class="address">📍 {{ clinic.info?.address ?? 'г. Великий Новгород, ул. Кочетова, дом 16/46' }}</p>
            <p class="phone">📞 {{ clinic.info?.phone ?? '+7 999 999 99 99' }}</p>
            <p class="hours">🕒 {{ clinic.info?.hours ?? 'Круглосуточно 24/7' }}</p>
            <div class="map-links">
              <button class="btn-sm">Яндекс Карты</button>
              <button class="btn-sm">2ГИС</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section-services section-padding">
      <div class="container">
        <h2 class="title-h2">ОТДЕЛЕНИЯ КЛИНИКИ</h2>
        <div class="services-grid">
          <div v-for="dep in departments" :key="dep.id" class="service-card">
            <h3 class="service-card__title">{{ dep.title }}</h3>
            <div class="service-card__visual">
              <div class="service-circle"></div>
              <img :src="imageByKey(dep.imageKey)" :alt="dep.title" class="service-img" />
            </div>
            <NuxtLink to="/center" class="arrow-btn">→</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="section-specialists section-padding">
      <div class="container">
        <h2 class="title-h2">НАШИ СПЕЦИАЛИСТЫ</h2>
        <NuxtLink to="/doctors" class="btn-link">Все наши специалисты</NuxtLink>

        <div class="specialists-grid-wrapper">
          <div v-for="doc in featuredDoctors" :key="doc.id" class="spec-card">
            <div class="spec-avatar"><UiDoctorAvatar :name="doc.fullName" :size="120" /></div>
            <div class="spec-info">
              <h3>{{ doc.fullName }}</h3>
              <p>{{ doc.position }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-content {
  background-color: #f5ecd6;
  color: #1a1513;
}

.center-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 50px;
  align-items: center;
}

.center-visual {
  position: relative;
}

.rounded-img {
  width: 100%;
  border-radius: 40px;
  display: block;
}

.slider-dots {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
}

.dot.active {
  background: #fff;
  width: 24px;
  border-radius: 4px;
}

.center-info p {
  font-size: 18px;
  line-height: 1.5;
  margin-bottom: 25px;
  color: #333;
}

.map-wrapper {
  position: relative;
  height: 500px;
  border-radius: 40px;
  overflow: hidden;
}

.departments__map {
  position: absolute;
  inset: 0;
}
.departments__map iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.map-card {
  position: absolute;
  top: 30px;
  right: 30px;
  background: #fff;
  padding: 35px;
  border-radius: 30px;
  width: 360px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
}

.map-card h3 {
  font-size: 24px;
  margin-bottom: 20px;
  text-transform: uppercase;
}

.address,
.phone,
.hours {
  margin-bottom: 12px;
  font-size: 15px;
  display: flex;
  align-items: center;
}

.map-links {
  display: flex;
  gap: 10px;
  margin-top: 25px;
}

.btn-sm {
  background: #f5ecd6;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

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
  text-decoration: none;
  color: inherit;
}

.specialists-grid-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 30px;
}

.spec-card {
  background: #fff9eb;
  border-radius: 35px;
  padding: 30px;
  display: flex;
  gap: 25px;
  align-items: center;
}


.spec-info h3 {
  font-size: 20px;
  margin-bottom: 10px;
}

.spec-info p {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.btn-link {
  background: transparent;
  border: none;
  text-decoration: underline;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 20px;
  display: inline-block;
  color: inherit;
}

@media (max-width: 768px) {
  .center-grid {
    grid-template-columns: 1fr;
  }
  .map-wrapper {
    height: auto;
    display: flex;
    flex-direction: column;
  }
  .departments__map {
    position: static;
    height: 300px;
  }
  .map-card {
    position: static;
    width: 100%;
    margin-top: 20px;
    padding: 25px;
  }
  .services-grid {
    grid-template-columns: 1fr;
  }
  .service-card {
    height: 250px;
  }
  .specialists-grid-wrapper {
    grid-template-columns: 1fr;
  }
  .spec-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>
