import { defineStore } from 'pinia'

export interface ToastItem {
  id: number
  title: string
  body?: string
}

let counter = 0

// короткие всплывающие уведомления в правом верхнем углу (используются вместе с websocket-событиями)
export const useToastStore = defineStore('toast', {
  state: () => ({ items: [] as ToastItem[] }),
  actions: {
    push(title: string, body?: string) {
      const id = ++counter
      this.items.push({ id, title, body })
      setTimeout(() => this.remove(id), 5000)
    },
    remove(id: number) {
      this.items = this.items.filter((t) => t.id !== id)
    },
  },
})
