<script setup lang="ts">
// шапка сайта: логотип, контакты и навигация, включая выпадающее меню "центр" и мобильный бургер
import logo from '~/assets/icons/logo.svg'

const isDropdownOpen = ref(false)
const isMobileOpen = ref(false)
const auth = useAuthStore()

const centerLinks = [
  { title: 'Отделения', path: '/center' },
  { title: 'История', path: '/center/history' },
  { title: 'Статьи', path: '/articles' },
]

const closeMobile = () => { isMobileOpen.value = false }
</script>

<template>
  <header class="header container">
    <div class="header__top">
      <NuxtLink to="/" class="logo" @click="closeMobile">
        <div class="logo__icon"><img :src="logo" alt="VetSoft" /></div>
        <div class="logo__text">
          <span class="logo__title">VetSoft</span>
          <span class="logo__subtitle">С заботой о жизни</span>
        </div>
      </NuxtLink>

      <div class="header__info">
        <div class="socials">
          <a href="#" class="social-icon" aria-label="Telegram"><UiSocialIcon name="telegram" :size="16" /></a>
          <a href="#" class="social-icon" aria-label="WhatsApp"><UiSocialIcon name="whatsapp" :size="16" /></a>
          <a href="#" class="social-icon" aria-label="VK"><UiSocialIcon name="vk" :size="16" /></a>
          <a href="mailto:mail@vetsoft.local" class="social-icon" aria-label="Email"><UiSocialIcon name="email" :size="16" /></a>
        </div>
        <a href="tel:+79999999999" class="phone-btn">+7 999 999 99 99</a>
        <NuxtLink v-if="auth.isAuthenticated" to="/app" class="phone-btn cabinet-btn">Кабинет</NuxtLink>
        <NuxtLink v-else to="/auth/login" class="phone-btn cabinet-btn">Войти</NuxtLink>
      </div>

      <button class="burger" :class="{ open: isMobileOpen }" aria-label="Меню" @click="isMobileOpen = !isMobileOpen">☰</button>
    </div>

    <nav class="nav" :class="{ open: isMobileOpen }">
      <ul class="nav__list">
        <li><NuxtLink to="/" @click="closeMobile">Главная</NuxtLink></li>

        <li
          class="nav__item-dropdown"
          :class="{ open: isDropdownOpen }"
          @mouseenter="isDropdownOpen = true"
          @mouseleave="isDropdownOpen = false"
        >
          <span class="nav__link active">Центр <span class="arrow">▾</span></span>
          <ul v-if="isDropdownOpen" class="dropdown-menu">
            <li v-for="link in centerLinks" :key="link.path">
              <NuxtLink :to="link.path" @click="closeMobile">{{ link.title }}</NuxtLink>
            </li>
          </ul>
          <ul class="dropdown-menu dropdown-menu--mobile">
            <li v-for="link in centerLinks" :key="link.path">
              <NuxtLink :to="link.path" @click="closeMobile">{{ link.title }}</NuxtLink>
            </li>
          </ul>
        </li>

        <li><NuxtLink to="/services" @click="closeMobile">Услуги и цены</NuxtLink></li>
        <li><NuxtLink to="/check-up" @click="closeMobile">Чек-ап</NuxtLink></li>
        <li><NuxtLink to="/doctors" @click="closeMobile">Врачи</NuxtLink></li>
        <li><NuxtLink to="/contacts" @click="closeMobile">Контакты</NuxtLink></li>
        <li class="nav__mobile-only">
          <NuxtLink v-if="auth.isAuthenticated" to="/app" @click="closeMobile">Личный кабинет</NuxtLink>
          <NuxtLink v-else to="/auth/login" @click="closeMobile">Войти</NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.header {
  padding-top: 20px;
  padding-bottom: 20px;
  position: relative;
}

.header__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
}

.logo__icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}
.logo__icon img {
  width: 100%;
  height: 100%;
  display: block;
}

.logo__text {
  display: flex;
  flex-direction: column;
}

.logo__title {
  font-weight: 900;
  text-transform: uppercase;
  font-size: 20px;
  line-height: 1;
}

.logo__subtitle {
  font-size: 12px;
  opacity: 0.7;
}

.header__info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.socials {
  display: flex;
  gap: 8px;
}

.social-icon {
  width: 36px;
  height: 36px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-size: 10px;
  color: inherit;
  transition: var(--transition);
}

.social-icon:hover {
  background: var(--white);
}

.phone-btn {
  text-decoration: none;
  color: inherit;
  font-weight: 600;
  padding: 8px 20px;
  border: 1px solid var(--text-black);
  border-radius: 20px;
  white-space: nowrap;
}

.cabinet-btn {
  background: var(--text-black);
  color: var(--white);
}

.burger {
  display: none;
  background: #fdf5e6;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
}

.nav__list {
  display: flex;
  list-style: none;
  gap: 25px;
  padding: 0;
  position: relative;
}

.nav__link,
.nav__list a {
  text-decoration: none;
  color: var(--text-black);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
}

.nav__link.active {
  font-weight: 700;
}

.nav__item-dropdown {
  position: relative;
  padding-bottom: 10px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: var(--bg-card);
  min-width: 180px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  list-style: none;
  padding: 15px 0;
  z-index: 100;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.dropdown-menu--mobile {
  display: none;
}

.dropdown-menu li a {
  display: block;
  padding: 10px 20px;
  font-size: 14px;
  transition: background 0.2s;
}

.dropdown-menu li a:hover {
  background: rgba(0, 0, 0, 0.03);
  font-weight: 600;
}

.arrow {
  display: inline-block;
  transition: transform 0.3s;
  font-size: 10px;
  margin-left: 4px;
}

.nav__item-dropdown.open .arrow {
  transform: rotate(180deg);
}

.nav__mobile-only {
  display: none;
}

@media (max-width: 768px) {
  .header__info {
    display: none;
  }

  .burger {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav {
    display: none;
  }

  .nav.open {
    display: block;
    margin-top: 10px;
  }

  .nav.open .nav__list {
    flex-direction: column;
    gap: 4px;
  }

  .nav.open .nav__list a,
  .nav.open .nav__link {
    display: block;
    padding: 10px 0;
  }

  .nav__item-dropdown .dropdown-menu {
    display: none;
  }

  .nav__item-dropdown .dropdown-menu--mobile {
    display: block;
    position: static;
    box-shadow: none;
    border: none;
    padding: 0 0 0 15px;
  }

  .nav__mobile-only {
    display: block;
    border-top: 1px solid rgba(0, 0, 0, 0.08);
    margin-top: 8px;
    padding-top: 8px;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 15px 0;
  }

  .header__top {
    margin-bottom: 0;
  }

  .logo__icon {
    width: 32px;
    height: 32px;
  }

  .logo__title {
    font-size: 16px;
  }
}
</style>
