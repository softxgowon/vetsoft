<script setup lang="ts">
import banner from '~/assets/images/HeroBanner.png'
</script>

<template>
  <section class="hero">
    <div class="container hero__inner">
      <div class="hero__content">
        <h1 class="hero__title">ВЕТЕРИНАРНЫЙ<br />ЦЕНТР</h1>

        <div class="hero__actions">
          <NuxtLink to="/app/appointments/new" class="btn-white">Записаться</NuxtLink>
          <div class="hero__video">
            <div class="play-icon">▶</div>
            <div class="video-text">
              <span>О нас за пару минут</span>
              <small>2:32</small>
            </div>
          </div>
        </div>

        <div class="hero__stats">
          <div class="stat-card">
            <span class="stat-card__val">7 лет</span>
            <p class="stat-card__txt">Заботимся о здоровье животных</p>
          </div>
          <div class="stat-card">
            <span class="stat-card__val">&gt;500</span>
            <p class="stat-card__txt">Успешно вылеченных питомцев</p>
          </div>
          <div class="stat-card">
            <span class="stat-card__val">90%</span>
            <p class="stat-card__txt">Клиентов рекомендуют нас</p>
          </div>
        </div>
      </div>

      <div class="hero__image">
        <img :src="banner" alt="Собака и кошка" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding: 40px 0 0 0;
  overflow: hidden;
}

.hero__inner {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
}

.hero__content {
  flex: 1;
  z-index: 2;
}

.hero__title {
  font-size: 80px;
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -3px;
  margin-bottom: 40px;
  text-transform: uppercase;
}

.hero__actions {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 80px;
}

.btn-white {
  background: var(--bg-card);
  border: none;
  padding: 18px 45px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
  text-decoration: none;
  color: inherit;
  display: inline-block;
}

.btn-white:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.hero__video {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.play-icon {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.video-text {
  display: flex;
  flex-direction: column;
}

.video-text span {
  font-size: 14px;
  font-weight: 500;
}

.video-text small {
  opacity: 0.5;
  font-size: 12px;
}

.hero__stats {
  display: flex;
  gap: 50px;
}

.stat-card__val {
  display: block;
  font-size: 32px;
  font-weight: 900;
  margin-bottom: 8px;
}

.stat-card__txt {
  font-size: 13px;
  line-height: 1.3;
  max-width: 130px;
  color: var(--text-gray);
}

.hero__image {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.hero__image img {
  max-width: 110%;
  height: auto;
  object-fit: contain;
}

@media (max-width: 768px) {
  .hero {
    padding-top: 20px;
  }
  .hero__inner {
    flex-direction: column;
    text-align: center;
  }
  .hero__title {
    font-size: 42px;
    letter-spacing: -1px;
    margin-bottom: 25px;
  }
  .hero__actions {
    flex-direction: column;
    gap: 20px;
    margin-bottom: 40px;
  }
  .btn-white {
    width: 100%;
  }
  .hero__stats {
    justify-content: center;
    gap: 20px;
    margin-bottom: 40px;
  }
  .stat-card__txt {
    margin: 0 auto;
  }
  .hero__image {
    width: 100%;
    justify-content: center;
  }
  .hero__image img {
    max-width: 100%;
  }
}

@media (max-width: 360px) {
  .hero__title {
    font-size: 36px;
  }
  .hero__stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    text-align: left;
  }
}
</style>
