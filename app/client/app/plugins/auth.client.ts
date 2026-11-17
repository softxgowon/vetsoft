// восстанавливаем сессию и подписываемся на уведомления при загрузке приложения в браузере
export default defineNuxtPlugin(() => {
  const auth = useAuthStore()
  auth.init()
  if (auth.isAuthenticated) {
    useNotificationsStore().subscribeSocket()
    useNotificationsStore().fetch().catch(() => {})
  }
})
