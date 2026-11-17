import { defineStore } from 'pinia'
import type { Pet } from '~/types/api'

// питомцы текущего владельца, используются в личном кабинете и при записи на прием
export const usePetsStore = defineStore('pets', {
  state: () => ({ items: [] as Pet[], loaded: false, loading: false }),
  actions: {
    async fetch(force = false) {
      if (this.loaded && !force) return
      this.loading = true
      try {
        this.items = await useApi().get<Pet[]>('/pets')
        this.loaded = true
      } finally {
        this.loading = false
      }
    },
    async create(payload: Partial<Pet>) {
      const pet = await useApi().post<Pet>('/pets', payload)
      this.items.push(pet)
      return pet
    },
    async update(id: string, payload: Partial<Pet>) {
      const pet = await useApi().patch<Pet>(`/pets/${id}`, payload)
      const idx = this.items.findIndex((p) => p.id === id)
      if (idx !== -1) this.items[idx] = pet
      return pet
    },
    async remove(id: string) {
      await useApi().delete(`/pets/${id}`)
      this.items = this.items.filter((p) => p.id !== id)
    },
    reset() {
      this.items = []
      this.loaded = false
    },
  },
})
