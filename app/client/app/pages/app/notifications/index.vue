<script setup lang="ts">
import { formatDateTime } from '~/utils/format'

definePageMeta({ layout: 'cabinet', middleware: 'auth' })

const notifications = useNotificationsStore()
await notifications.fetch()
notifications.subscribeSocket()

const markRead = (id: string) => notifications.markRead(id)
</script>

<template>
  <div class="page">
    <div class="page-head">
      <h1 class="page-title">Уведомления</h1>
      <button v-if="notifications.unread" class="btn-outline" @click="notifications.markAllRead()">Прочитать все</button>
    </div>

    <p v-if="!notifications.items.length" class="empty">Уведомлений пока нет.</p>
    <ul v-else class="entries">
      <li v-for="n in notifications.items" :key="n.id" class="entry" :class="{ unread: !n.readAt }" @click="!n.readAt && markRead(n.id)">
        <div class="entry__title">{{ n.title }}</div>
        <div class="entry__body">{{ n.body }}</div>
        <div class="entry__date">{{ formatDateTime(n.createdAt) }}</div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.page-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.page-title {
  font-size: 28px;
  font-weight: 900;
}
.btn-outline {
  background: transparent;
  border: 1px solid var(--text-black);
  border-radius: 10px;
  padding: 8px 16px;
  font-weight: 600;
  cursor: pointer;
  font-size: 13px;
}
.entries {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.entry {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 16px 20px;
  cursor: pointer;
}
.entry.unread {
  box-shadow: inset 3px 0 0 var(--text-black);
  font-weight: 600;
}
.entry__title {
  font-weight: 800;
  margin-bottom: 4px;
}
.entry__body {
  font-size: 13px;
  color: var(--text-black);
}
.entry__date {
  font-size: 12px;
  color: var(--text-gray);
  margin-top: 6px;
}
.empty {
  color: var(--text-gray);
}
</style>
