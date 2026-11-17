<script setup lang="ts">
import { ApiError } from '~/composables/useApi'

definePageMeta({ layout: 'auth', middleware: 'guest' })

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const submit = async () => {
  error.value = ''
  loading.value = true
  try {
    await auth.login(email.value.trim(), password.value)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/app'
    await router.push(redirect)
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : 'Не удалось войти'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-card">
    <h1 class="auth-title">Вход в личный кабинет</h1>
    <p class="auth-hint">Демо-доступ: demo@vetsoft.local / ChangeMe123!</p>

    <form class="auth-form" @submit.prevent="submit">
      <label class="field">
        <span>Email</span>
        <input v-model="email" type="email" required autocomplete="email" />
      </label>
      <label class="field">
        <span>Пароль</span>
        <input v-model="password" type="password" required autocomplete="current-password" />
      </label>

      <p v-if="error" class="auth-error">{{ error }}</p>

      <button class="btn-dark" type="submit" :disabled="loading">{{ loading ? 'Входим…' : 'Войти' }}</button>
    </form>

    <p class="auth-switch">Еще нет аккаунта? <NuxtLink to="/auth/register">Зарегистрироваться</NuxtLink></p>
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
