import { defineStore } from 'pinia'
import type { AuthSession, PublicUser } from '~/types/api'

const STORAGE_KEY = 'vetsoft.auth'

interface StoredAuth {
  token: string
  user: PublicUser
}

const readStorage = (): StoredAuth | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as StoredAuth) : null
  } catch {
    return null
  }
}

const writeStorage = (data: StoredAuth | null) => {
  try {
    if (data) localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    // приватный режим браузера может запрещать localStorage, тогда просто не сохраняем сессию
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as PublicUser | null,
    token: null as string | null,
    initialized: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    isStaff: (state) => state.user?.role === 'doctor' || state.user?.role === 'admin',
    isAdmin: (state) => state.user?.role === 'admin',
  },

  actions: {
    // восстанавливает сессию из localStorage при старте приложения
    init() {
      if (this.initialized) return
      this.initialized = true
      const stored = readStorage()
      if (stored) {
        this.token = stored.token
        this.user = stored.user
        useSocket().connect()
      }
    },

    applySession(session: AuthSession) {
      this.token = session.accessToken
      this.user = session.user
      writeStorage({ token: session.accessToken, user: session.user })
      useSocket().connect()
    },

    async login(email: string, password: string) {
      const session = await useApi().post<AuthSession>('/auth/login', { email, password })
      this.applySession(session)
    },

    async register(payload: { email: string; password: string; fullName: string; phone?: string }) {
      const session = await useApi().post<AuthSession>('/auth/register', payload)
      this.applySession(session)
    },

    async refreshProfile() {
      if (!this.token) return
      this.user = await useApi().get<PublicUser>('/auth/me')
      writeStorage({ token: this.token, user: this.user })
    },

    logout() {
      this.token = null
      this.user = null
      writeStorage(null)
      useSocket().disconnect()
      navigateTo('/')
    },

    // вызывается при получении 401 от api, без редиректа (чтобы не мешать во время обычного логина)
    forceLogout() {
      this.token = null
      this.user = null
      writeStorage(null)
      useSocket().disconnect()
    },
  },
})
