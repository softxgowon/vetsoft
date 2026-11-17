<script setup lang="ts">
import type { Doctor } from '~/types/api'

defineProps<{ doctor: Doctor }>()
</script>

<template>
  <div class="spec-card">
    <div class="spec-avatar"><UiDoctorAvatar :name="doctor.fullName" :size="150" /></div>
    <div class="spec-info">
      <h3 class="spec-name">{{ doctor.fullName }}</h3>
      <p class="spec-role">{{ doctor.position }}</p>
      <NuxtLink :to="`/app/appointments/new?doctorId=${doctor.id}`" class="btn-spec-more">Записаться</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.spec-card {
  background: #fff9eb;
  border-radius: 35px;
  padding: 30px;
  display: flex;
  align-items: center;
  gap: 30px;
  transition: transform 0.3s ease;
}
.spec-card:hover {
  transform: translateY(-5px);
}
.spec-name {
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 10px;
  line-height: 1.2;
}
.spec-role {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 20px;
}
.btn-spec-more {
  background: transparent;
  border: 1px solid #1a1513;
  padding: 8px 20px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  display: inline-block;
}
@media (max-width: 480px) {
  .spec-card {
    flex-direction: column;
    text-align: center;
    padding: 25px;
    border-radius: 24px;
  }
  .spec-avatar img {
    width: 120px;
    height: 120px;
  }
  .spec-name {
    font-size: 18px;
  }
  .btn-spec-more {
    width: 100%;
    text-align: center;
  }
}
</style>
