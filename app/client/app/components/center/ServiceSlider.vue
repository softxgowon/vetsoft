<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { imageByKey } from '~/utils/images'
import type { Department } from '~/types/api'

const { data: departments } = await useAsyncData('service-slider-departments', () => useApi().get<Department[]>('/departments'))
const modules = [Navigation]
</script>

<template>
  <section v-if="departments?.length" class="service-slider">
    <Swiper :modules="modules" :space-between="0" :slides-per-view="1" :navigation="{ nextEl: '.srv-next', prevEl: '.srv-prev' }" loop class="service-swiper">
      <SwiperSlide v-for="dep in departments" :key="dep.id">
        <div class="service-slide__content">
          <div class="container service-slide__inner">
            <div class="service-slide__info">
              <span class="service-slide__tag">Отделения</span>
              <h2 class="service-slide__title">{{ dep.title }}</h2>
              <ul class="service-slide__list">
                <li v-for="(point, idx) in dep.points" :key="idx">{{ point }}</li>
              </ul>
              <div class="service-slide__actions">
                <NuxtLink to="/services" class="btn-dark-service">Услуги и цены</NuxtLink>
                <div class="service-slide__video">
                  <div class="play-icon-small">▶</div>
                  <div class="video-info">
                    <span>Видео об этом отделении</span>
                    <small>2:32</small>
                  </div>
                </div>
              </div>
              <div class="service-slide__nav">
                <button class="srv-prev nav-arrow">←</button>
                <button class="srv-next nav-arrow">→</button>
              </div>
            </div>
            <div class="service-slide__visual">
              <div class="service-slide__circle" :style="{ backgroundColor: dep.color }"></div>
              <img :src="imageByKey(dep.imageKey)" :alt="dep.title" class="service-slide__img" />
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  </section>
</template>

<style scoped>
.service-slider {
  background: #fdf5e6;
  overflow: hidden;
  padding: 60px 0;
}
.service-slide__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 500px;
}
.service-slide__info {
  flex: 1;
  padding-right: 50px;
  z-index: 2;
}
.service-slide__tag {
  display: inline-block;
  padding: 6px 16px;
  border: 1px solid var(--text-black);
  border-radius: 12px;
  font-size: 13px;
  margin-bottom: 20px;
}
.service-slide__title {
  font-size: 72px;
  font-weight: 900;
  text-transform: uppercase;
  margin-bottom: 30px;
  letter-spacing: -2px;
}
.service-slide__list {
  list-style: none;
  margin-bottom: 40px;
}
.service-slide__list li {
  font-size: 15px;
  color: var(--text-gray);
  margin-bottom: 10px;
  max-width: 450px;
}
.service-slide__actions {
  display: flex;
  align-items: center;
  gap: 25px;
  margin-bottom: 60px;
}
.btn-dark-service {
  background: #1a1513;
  color: white;
  border: none;
  padding: 18px 40px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
}
.play-icon-small {
  width: 44px;
  height: 44px;
  background: #e9e0cf;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}
.service-slide__video {
  display: flex;
  align-items: center;
  gap: 12px;
}
.video-info {
  display: flex;
  flex-direction: column;
}
.video-info span {
  font-size: 14px;
  font-weight: 500;
}
.video-info small {
  opacity: 0.5;
  font-size: 12px;
}
.service-slide__nav {
  display: flex;
  gap: 10px;
}
.nav-arrow {
  width: 50px;
  height: 50px;
  background: #e9e0cf;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
}
.service-slide__visual {
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.service-slide__circle {
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  bottom: -50px;
  right: -50px;
  z-index: 1;
}
.service-slide__img {
  position: relative;
  z-index: 2;
  max-width: 100%;
  height: auto;
}
@media (max-width: 1024px) {
  .service-slide__title {
    font-size: 48px;
  }
  .service-slide__circle {
    width: 400px;
    height: 400px;
  }
}
@media (max-width: 768px) {
  .service-slide__inner {
    flex-direction: column;
    text-align: center;
  }
  .service-slide__info {
    padding-right: 0;
    order: 2;
  }
  .service-slide__visual {
    order: 1;
    margin-bottom: 40px;
    width: 100%;
  }
  .service-slide__circle {
    width: 300px;
    height: 300px;
    right: 50%;
    transform: translateX(50%);
    bottom: 0;
  }
  .service-slide__actions {
    flex-direction: column;
    gap: 20px;
  }
  .service-slide__nav {
    justify-content: center;
  }
}
@media (max-width: 360px) {
  .service-slide__title {
    font-size: 32px;
  }
  .btn-dark-service {
    width: 100%;
  }
  .service-slide__list li {
    font-size: 14px;
  }
}
</style>
