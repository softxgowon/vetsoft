<script setup lang="ts">
import { useClinicStore } from '~/stores/clinic'
const clinic = useClinicStore()
onMounted(() => clinic.ensureLoaded())

const contacts: { id: number; icon: 'vk' | 'whatsapp' | 'youtube' | 'email'; label: string; link: string }[] = [
  { id: 1, icon: 'vk', label: 'VK', link: '#' },
  { id: 2, icon: 'whatsapp', label: "What's App", link: '#' },
  { id: 3, icon: 'youtube', label: 'YouTube', link: '#' },
  { id: 4, icon: 'email', label: 'E-mail', link: 'mailto:mail@vetsoft.local' },
]
</script>

<template>
  <section class="contacts-container">
    <h2 class="contacts-title">Контакты</h2>
    <div class="contacts-grid">
      <div v-for="item in contacts" :key="item.id" class="contact-item">
        <a :href="item.link" class="icon-card"><UiSocialIcon :name="item.icon" :size="36" /></a>
        <div class="label-badge">{{ item.label }}</div>
      </div>
    </div>
    <p v-if="clinic.info" class="contacts-note">{{ clinic.info.address }} · {{ clinic.info.phone }}</p>
  </section>
</template>

<style scoped>
.contacts-container {
  background-color: #f2e0a1;
  padding: 60px 20px;
  text-align: center;
}
.contacts-title {
  font-size: 64px;
  font-weight: 900;
  color: #1a1a1a;
  margin-bottom: 50px;
}
.contacts-grid {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}
.contact-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}
.icon-card {
  width: 140px;
  height: 140px;
  background-color: #f9ecc1;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44px;
  color: #7d6b41;
  text-decoration: none;
  transition: transform 0.2s ease;
}
.icon-card:hover {
  transform: translateY(-5px);
  background-color: #ffffff;
}
.label-badge {
  background-color: #f9ecc1;
  padding: 8px 30px;
  border-radius: 12px;
  font-size: 14px;
  color: #7d6b41;
  min-width: 100px;
}
.contacts-note {
  margin-top: 40px;
  font-size: 15px;
  color: #7d6b41;
}
@media (max-width: 600px) {
  .contacts-title {
    font-size: 40px;
  }
  .icon-card {
    width: 100px;
    height: 100px;
    font-size: 32px;
  }
}
</style>
