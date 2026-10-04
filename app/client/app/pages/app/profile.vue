<script setup lang="ts">
import { ApiError } from '~/composables/useApi'

definePageMeta({ layout: 'cabinet', middleware: 'auth' })

const auth = useAuthStore()
const form = reactive({ fullName: auth.user?.fullName ?? '', phone: auth.user?.phone ?? '' })
const saved = ref(false)
const error = ref('')
const saving = ref(false)

const submit = async () => {
  error.value = ''
  saved.value = false
  saving.value = true
  try {
    await useApi().patch('/users/me', { fullName: form.fullName.trim(), phone: form.phone.trim() || undefined })
    await auth.refreshProfile()
    saved.value = true
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : 'Не удалось сохранить профиль'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="page">
    <h1 class="page-title">Профиль</h1>

    <form class="card" @submit.prevent="submit">
      <label class="field"><span>Email</span><input :value="auth.user?.email" disabled /></label>
      <label class="field"><span>Имя</span><input v-model="form.fullName" required minlength="2" /></label>
      <label class="field"><span>Телефон</span><input v-model="form.phone" type="tel" /></label>

      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="saved" class="success">Профиль обновлен</p>

      <button class="btn-dark" type="submit" :disabled="saving">{{ saving ? 'Сохраняем…' : 'Сохранить' }}</button>
    </form>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.page-title {
  font-size: 28px;
  font-weight: 900;
}
.card {
  background: var(--bg-card);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 420px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
}
.field input {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  font-size: 14px;
  font-weight: 400;
  background: var(--white);
}
.field input:disabled {
  opacity: 0.6;
}
.btn-dark {
  align-self: flex-start;
  background: var(--text-black);
  color: var(--white);
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
}
.btn-dark:disabled {
  opacity: 0.6;
}
.error {
  color: #c0392b;
  font-size: 13px;
}
.success {
  color: #2c7a4b;
  font-size: 13px;
}
</style>
