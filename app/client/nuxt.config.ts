// конфигурация nuxt: ssr отключен, потому что приложение работает как личный кабинет за авторизацией
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  ssr: false,
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001/api',
      wsBase: process.env.NUXT_PUBLIC_WS_BASE || 'http://localhost:3001',
    },
  },
  app: {
    head: {
      title: 'VetSoft — ветеринарная клиника',
      meta: [
        { name: 'description', content: 'Электронная медкарта питомца, онлайн-запись к ветеринару и напоминания о визитах и прививках' },
      ],
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    },
  },
  typescript: { strict: true },
})
