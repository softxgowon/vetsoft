<script setup lang="ts">
import zooLand from '~/assets/images/ZooLand.png'
</script>

<template>
  <section class="gallery section-padding">
    <div class="container">
      <h2 class="section-title">Наша галерея</h2>
      <div class="gallery__card">
        <div class="gallery__info">
          <p class="gallery__description">Моменты, связанные с нашим ветеринарным центром, наши помещения и многое другое.</p>
          <NuxtLink to="/center/history" class="btn-outline">История</NuxtLink>
        </div>
        <div class="gallery__image-wrapper">
          <img :src="zooLand" alt="Ресепшен Zoo Land" class="gallery__img" />
          <div class="gallery__nav-dots">
            <span class="dot active"></span>
            <span class="dot"></span>
          </div>
          <div class="gallery__arrows">
            <button class="arrow-btn prev">←</button>
            <button class="arrow-btn next">→</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.gallery__card {
  border-radius: 30px;
  display: flex;
  align-items: center;
  padding: 40px;
  gap: 40px;
  min-height: 400px;
}
.gallery__info {
  flex: 1;
  max-width: 300px;
}
.gallery__description {
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 30px;
  color: var(--text-gray);
}
.btn-outline {
  background: transparent;
  border: 1px solid var(--text-black);
  padding: 12px 35px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  text-decoration: none;
  color: inherit;
  display: inline-block;
}
.gallery__image-wrapper {
  flex: 2;
  position: relative;
  border-radius: 20px;
  overflow: hidden;
}
.gallery__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.gallery__arrows {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
}
.arrow-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: var(--white);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.gallery__nav-dots {
  display: none;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.2);
}
.dot.active {
  background: var(--text-black);
  width: 24px;
  border-radius: 4px;
}
@media (max-width: 768px) {
  .section-padding {
    padding: 40px 0;
  }
  .gallery__card {
    flex-direction: column-reverse;
    padding: 20px;
    gap: 20px;
  }
  .gallery__info {
    max-width: 100%;
    text-align: center;
  }
  .gallery__image-wrapper {
    width: 100%;
  }
  .gallery__arrows {
    display: none;
  }
  .gallery__nav-dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 15px;
  }
}
@media (max-width: 360px) {
  .gallery__description {
    font-size: 14px;
  }
  .btn-outline {
    width: 100%;
  }
}
</style>
