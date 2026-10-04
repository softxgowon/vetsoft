import { defineStore } from 'pinia'
import type { AppNotification, NotificationsResponse } from '~/types/api'

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    items: [] as AppNotification[],
    unread: 0,
    subscribed: false,
  }),

  actions: {
    async fetch() {
      const data = await useApi().get<NotificationsResponse>('/notifications')
      this.items = data.items
      this.unread = data.unread
    },

    async markRead(id: string) {
      await useApi().post(`/notifications/${id}/read`)
      const item = this.items.find((n) => n.id === id)
      if (item && !item.readAt) {
        item.readAt = new Date().toISOString()
        this.unread = Math.max(0, this.unread - 1)
      }
    },

    async markAllRead() {
      await useApi().post('/notifications/read-all')
      this.items.forEach((n) => { n.readAt = n.readAt ?? new Date().toISOString() })
      this.unread = 0
    },

    // подписка на socket.io: новые уведомления прилетают мгновенно, без опроса сервера
    subscribeSocket() {
      if (this.subscribed) return
      const socket = useSocket().get()
      if (!socket) return
      this.subscribed = true
      socket.on('notification', (notification: AppNotification) => {
        this.items.unshift(notification)
        this.unread += 1
      })
    },

    reset() {
      this.items = []
      this.unread = 0
      this.subscribed = false
    },
  },
})
