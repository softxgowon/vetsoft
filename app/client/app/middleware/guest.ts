// страницы входа/регистрации не нужны уже авторизованному пользователю
export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()
  auth.init()
  if (auth.isAuthenticated) return navigateTo('/app')
})
