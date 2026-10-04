<script setup lang="ts">
import { ApiError } from '~/composables/useApi'

definePageMeta({ layout: 'auth', middleware: 'guest' })

const auth = useAuthStore()
const router = useRouter()

const form = reactive({ fullName: '', email: '', phone: '', password: '' })
const error = ref('')
const loading = ref(false)

const submit = async () => {
  error.value = ''
  loading.value = true
  try {
    await auth.register({ fullName: form.fullName.trim(), email: form.email.trim(), phone: form.phone.trim() || undefined, password: form.password })
    await router.push('/app')
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : 'Не удалось зарегистрироваться'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-card">
    <h1 class="auth-title">Регистрация</h1>
    <p class="auth-hint">Создайте аккаунт, чтобы записываться к врачу и хранить медкарту питомцев онлайн.</p>

    <form class="auth-form" @submit.prevent="submit">
      <label class="field">
        <span>Имя</span>
        <input v-model="form.fullName" type="text" required minlength="2" />
      </label>
      <label class="field">
        <span>Email</span>
        <input v-model="form.email" type="email" required />
      </label>
      <label class="field">
        <span>Телефон (необязательно)</span>
        <input v-model="form.phone" type="tel" placeholder="+7 900 000 00 00" />
      </label>
      <label class="field">
        <span>Пароль</span>
        <input v-model="form.password" type="password" required minlength="8" />
      </label>

      <p v-if="error" class="auth-error">{{ error }}</p>

      <button class="btn-dark" type="submit" :disabled="loading">{{ loading ? 'Создаем аккаунт…' : 'Зарегистрироваться' }}</button>
    </form>

    <p class="auth-switch">Уже есть аккаунт? <NuxtLink to="/auth/login">Войти</NuxtLink></p>
  </div>
</template>

<style scoped>
.auth-card {
  background: var(--bg-card);
  border-radius: 30px;
  padding: 40px;
  width: 100%;
}
.auth-title {
  font-size: 28px;
  font-weight: 900;
  margin-bottom: 8px;
}
.auth-hint {
  font-size: 13px;
  color: var(--text-gray);
  margin-bottom: 25px;
}
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
}
.field input {
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  font-size: 15px;
  font-weight: 400;
  background: var(--white);
}
.auth-error {
  color: #c0392b;
  font-size: 13px;
  font-weight: 600;
}
.btn-dark {
  background: var(--text-black);
  color: var(--white);
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 8px;
}
.btn-dark:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.auth-switch {
  margin-top: 20px;
  font-size: 14px;
  text-align: center;
}
</style>
