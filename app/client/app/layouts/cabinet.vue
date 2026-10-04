<script setup lang="ts">
// layout личного кабинета: та же шапка, но без большого hero-баннера и с боковой навигацией
const auth = useAuthStore()

const ownerLinks = [
  { to: '/app', label: 'Обзор', exact: true },
  { to: '/app/pets', label: 'Мои питомцы' },
  { to: '/app/appointments', label: 'Записи на прием' },
  { to: '/app/notifications', label: 'Уведомления' },
  { to: '/app/profile', label: 'Профиль' },
]

const staffLinks = [
  { to: '/app', label: 'Обзор', exact: true },
  { to: '/app/schedule', label: 'Расписание приемов' },
  { to: '/app/patients', label: 'Пациенты' },
  { to: '/app/notifications', label: 'Уведомления' },
  { to: '/app/profile', label: 'Профиль' },
]

const links = computed(() => (auth.isStaff ? staffLinks : ownerLinks))
</script>

<template>
  <LayoutHeader />
  <div class="app-wrapper">
    <main class="main-content cabinet">
      <div class="container cabinet__inner">
        <aside class="cabinet__sidebar">
          <nav class="cabinet__nav">
            <NuxtLink
              v-for="link in links"
              :key="link.to"
              :to="link.to"
              class="cabinet__nav-link"
              :exact-active-class="'active'"
              :active-class="link.exact ? '' : 'active'"
            >
              {{ link.label }}
            </NuxtLink>
          </nav>
          <button class="cabinet__logout" @click="auth.logout">Выйти</button>
        </aside>
        <div class="cabinet__content">
          <slot />
        </div>
      </div>
    </main>
    <LayoutFooter />
  </div>
</template>

<style scoped>
.cabinet {
  padding: 40px 0 80px;
}

.cabinet__inner {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 30px;
  align-items: start;
}

.cabinet__sidebar {
  background: var(--bg-card);
  border-radius: 24px;
  padding: 20px;
  position: sticky;
  top: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cabinet__nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cabinet__nav-link {
  text-decoration: none;
  color: var(--text-black);
  padding: 12px 16px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  transition: var(--transition);
}

.cabinet__nav-link:hover {
  background: rgba(0, 0, 0, 0.04);
}

.cabinet__nav-link.active {
  background: var(--text-black);
  color: var(--white);
}

.cabinet__logout {
  background: transparent;
  border: 1px solid var(--text-black);
  border-radius: 12px;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
}

.cabinet__content {
  min-width: 0;
}

@media (max-width: 900px) {
  .cabinet__inner {
    grid-template-columns: 1fr;
  }
  .cabinet__sidebar {
    position: static;
  }
  .cabinet__nav {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
