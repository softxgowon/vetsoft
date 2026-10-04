import { defineStore } from 'pinia'
import type { ClinicInfo } from '~/types/api'

// статичная информация о клинике (телефон, адрес), запрашивается один раз и кэшируется
export const useClinicStore = defineStore('clinic', {
  state: () => ({ info: null as ClinicInfo | null, loading: false }),
  actions: {
    async ensureLoaded() {
      if (this.info || this.loading) return
      this.loading = true
      try {
        this.info = await useApi().get<ClinicInfo>('/clinic')
      } catch {
        // публичная страница не должна падать, если бэкенд временно недоступен
      } finally {
        this.loading = false
      }
    },
  },
})
