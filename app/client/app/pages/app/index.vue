<script setup lang="ts">
import type { Appointment, Vaccination } from '~/types/api'
import { formatDateTime, formatDate, STATUS_LABELS } from '~/utils/format'

definePageMeta({ layout: 'cabinet', middleware: 'auth' })

const auth = useAuthStore()
const today = new Date().toISOString().slice(0, 10)

const { data: appointments, refresh: refreshAppointments } = await useAsyncData('dashboard-appointments', () =>
  useApi().get<Appointment[]>('/appointments', auth.isStaff ? { date: today } : undefined),
)
const { data: vaccinations } = await useAsyncData('dashboard-vaccinations', () =>
  auth.isStaff ? Promise.resolve([] as Vaccination[]) : useApi().get<Vaccination[]>('/vaccinations/upcoming'),
)

const upcomingOwn = computed(() => (appointments.value ?? []).filter((a) => a.status === 'scheduled').slice(0, 5))

onMounted(() => {
  const socket = useSocket().get()
  socket?.on('appointment:changed', () => refreshAppointments())
})
</script>

<template>
  <div class="dashboard">
    <h1 class="page-title">Здравствуйте, {{ auth.user?.fullName }}!</h1>

    <section v-if="!auth.isStaff" class="card">
      <div class="card__head">
        <h2>Ближайшие визиты</h2>
        <NuxtLink to="/app/appointments/new" class="link">Записаться →</NuxtLink>
      </div>
      <p v-if="!upcomingOwn.length" class="empty">Запланированных визитов пока нет.</p>
      <ul v-else class="list">
        <li v-for="a in upcomingOwn" :key="a.id" class="list-row">
          <div>
            <strong>{{ a.pet?.name }}</strong> · {{ a.doctor?.fullName }}
            <div class="muted">{{ formatDateTime(a.startsAt) }}</div>
          </div>
          <span class="badge">{{ STATUS_LABELS[a.status] }}</span>
        </li>
      </ul>
    </section>

    <section v-if="!auth.isStaff" class="card">
      <div class="card__head"><h2>Скоро вакцинация</h2></div>
      <p v-if="!vaccinations?.length" class="empty">В ближайшие 60 дней ревакцинаций не запланировано.</p>
      <ul v-else class="list">
        <li v-for="v in vaccinations" :key="v.id" class="list-row">
          <div>
            <strong>{{ v.pet?.name }}</strong> · {{ v.vaccine }}
          </div>
          <span class="muted">до {{ formatDate(v.nextDueAt!) }}</span>
        </li>
      </ul>
    </section>

    <section v-if="auth.isStaff" class="card">
      <div class="card__head">
        <h2>Записи на сегодня</h2>
        <NuxtLink to="/app/schedule" class="link">Все расписание →</NuxtLink>
      </div>
      <p v-if="!appointments?.length" class="empty">На сегодня записей нет.</p>
      <ul v-else class="list">
        <li v-for="a in appointments" :key="a.id" class="list-row">
          <div>
            <strong>{{ a.pet?.name }}</strong> ({{ a.pet?.owner?.fullName }}) · {{ a.doctor?.fullName }}
            <div class="muted">{{ formatDateTime(a.startsAt) }}</div>
          </div>
          <span class="badge">{{ STATUS_LABELS[a.status] }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.page-title {
  font-size: 28px;
  font-weight: 900;
}
.card {
  background: var(--bg-card);
  border-radius: 24px;
  padding: 28px;
}
.card__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.card__head h2 {
  font-size: 18px;
  font-weight: 800;
}
.link {
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  color: var(--text-black);
}
.list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.list-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--white);
  padding: 14px 18px;
  border-radius: 14px;
  font-size: 14px;
}
.muted {
  color: var(--text-gray);
  font-size: 12px;
  margin-top: 4px;
}
.badge {
  background: var(--bg-main);
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}
.empty {
  color: var(--text-gray);
  font-size: 14px;
}
</style>
