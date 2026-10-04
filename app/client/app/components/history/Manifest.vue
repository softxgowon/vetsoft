<script setup lang="ts">
import huskyImg from '~/assets/images/history.png'
</script>

<template>
  <section class="history-manifest">
    <div class="container">
      <div class="manifest__grid">
        <div class="manifest__text left">
          <p>На сайте для вас представлена актуальная информация о ветеринарном центре, о его филиалах и различных полезных возможностях пространства Zoo Land.</p>
        </div>
        <div class="manifest__visual">
          <div class="manifest__circle">
            <img :src="huskyImg" alt="Husky" />
            <div class="badge badge-paw">🐾</div>
            <div class="badge badge-med">🏥</div>
          </div>
        </div>
        <div class="manifest__text right">
          <p>Наш ветеринарный центр был задуман как место помощи животным. Мы постарались объединить опыт лучших специалистов с современными технологиями и уютом.</p>
        </div>
      </div>
      <div class="manifest__footer-btn">
        <NuxtLink to="/center" class="btn-beige">О центре</NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.history-manifest {
  padding: 80px 0;
}
.manifest__grid {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
}
.manifest__text {
  flex: 1;
  font-size: 16px;
  line-height: 1.5;
  color: #1a1513;
}
.manifest__visual {
  flex: 1.2;
  display: flex;
  justify-content: center;
  position: relative;
}
.manifest__circle {
  width: 400px;
  height: 400px;
  background-color: #e9e0cf;
  border-radius: 50%;
  position: relative;
}
.manifest__circle img {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 110%;
}
.badge {
  position: absolute;
  background: white;
  padding: 10px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}
.badge-paw {
  top: 20%;
  left: -20px;
}
.badge-med {
  bottom: 20%;
  right: -20px;
}
.manifest__footer-btn {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}
@media (max-width: 768px) {
  .manifest__grid {
    flex-direction: column;
    text-align: center;
  }
  .manifest__circle {
    width: 280px;
    height: 280px;
  }
}
</style>
