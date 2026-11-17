// доступ только персоналу клиники (врач или администратор)
export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()
  auth.init()
  if (!auth.isAuthenticated) return navigateTo(`/auth/login?redirect=${encodeURIComponent(useRoute().fullPath)}`)
  if (!auth.isStaff) return navigateTo('/app')
})
