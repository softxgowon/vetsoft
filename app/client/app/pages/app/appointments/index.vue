<script setup lang="ts">
import { formatDateTime, STATUS_LABELS } from '~/utils/format'
import type { Appointment } from '~/types/api'

definePageMeta({ layout: 'cabinet', middleware: 'auth' })

const api = useApi()
const { data: appointments, refresh } = await useAsyncData('my-appointments', () => api.get<Appointment[]>('/appointments'))

const cancelling = ref<string | null>(null)
const cancel = async (id: string) => {
  cancelling.value = id
  try {
    await api.post(`/appointments/${id}/cancel`)
    await refresh()
  } finally {
    cancelling.value = null
  }
}

onMounted(() => {
  const socket = useSocket().get()
  socket?.on('appointment:changed', () => refresh())
})

const sorted = computed(() => [...(appointments.value ?? [])].sort((a, b) => +new Date(b.startsAt) - +new Date(a.startsAt)))
</script>

<template>
  <div class="page">
    <div class="page-head">
      <h1 class="page-title">Мои записи</h1>
      <NuxtLink to="/app/appointments/new" class="btn-dark">+ Новая запись</NuxtLink>
    </div>

    <p v-if="!sorted.length" class="empty">Записей пока нет.</p>
    <ul v-else class="entries">
      <li v-for="a in sorted" :key="a.id" class="entry">
        <div>
          <div class="entry__title">{{ a.pet?.name }} · {{ a.doctor?.fullName }}</div>
          <div class="entry__meta">{{ formatDateTime(a.startsAt) }}<template v-if="a.reason"> · {{ a.reason }}</template></div>
        </div>
        <div class="entry__right">
          <span class="badge" :class="a.status">{{ STATUS_LABELS[a.status] }}</span>
          <button v-if="a.status === 'scheduled'" class="btn-outline" :disabled="cancelling === a.id" @click="cancel(a.id)">Отменить</button>
        </div>
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
.btn-dark {
  background: var(--text-black);
  color: var(--white);
  border: none;
  padding: 12px 22px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
}
.entries {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.entry {
  background: var(--bg-card);
  border-radius: 18px;
  padding: 18px 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.entry__title {
  font-weight: 800;
}
.entry__meta {
  font-size: 13px;
  color: var(--text-gray);
  margin-top: 4px;
}
.entry__right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.badge {
  background: var(--white);
  padding: 6px 14px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
}
.badge.cancelled,
.badge.no_show {
  color: #c0392b;
}
.badge.completed {
  color: #2c7a4b;
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
.empty {
  color: var(--text-gray);
}
</style>
