// доступ только авторизованным, используется для личного кабинета
export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()
  auth.init()
  if (!auth.isAuthenticated) return navigateTo(`/auth/login?redirect=${encodeURIComponent(useRoute().fullPath)}`)
})
