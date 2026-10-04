<script setup lang="ts">
import logo from '~/assets/icons/logo.svg'
import { useClinicStore } from '~/stores/clinic'

const clinic = useClinicStore()
onMounted(() => clinic.ensureLoaded())
</script>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <div class="footer__brand">
        <NuxtLink to="/" class="logo">
          <div class="logo__icon"><img :src="logo" alt="" /></div>
          <div class="logo__text">
            <span class="logo__title">VetSoft</span>
            <span class="logo__subtitle">С заботой о жизни</span>
          </div>
        </NuxtLink>
        <p class="footer__address">{{ clinic.info?.address ?? 'г. Великий Новгород, ул. Кочетова, дом 16/46' }}</p>
        <div class="footer__socials-bottom">
          <a href="#" aria-label="Telegram"><UiSocialIcon name="telegram" :size="18" /></a>
          <a href="#" aria-label="WhatsApp"><UiSocialIcon name="whatsapp" :size="18" /></a>
        </div>
      </div>

      <nav class="footer__menu">
        <ul class="footer__col">
          <li><NuxtLink to="/services">Прием и консультация</NuxtLink></li>
          <li><NuxtLink to="/services">Вакцинация</NuxtLink></li>
          <li><NuxtLink to="/services">Хирургия</NuxtLink></li>
          <li><NuxtLink to="/services">Кастрация и стерилизация</NuxtLink></li>
          <li><NuxtLink to="/services">Стационар</NuxtLink></li>
        </ul>
        <ul class="footer__col">
          <li><NuxtLink to="/">Главная</NuxtLink></li>
          <li><NuxtLink to="/center">Клиника</NuxtLink></li>
          <li><NuxtLink to="/services">Услуги и цены</NuxtLink></li>
          <li><NuxtLink to="/articles">Статьи</NuxtLink></li>
          <li><NuxtLink to="/check-up">Чек-ап</NuxtLink></li>
        </ul>
      </nav>

      <div class="footer__contacts">
        <p>Остались вопросы? Звоните!</p>
        <a :href="`tel:${(clinic.info?.phone ?? '+7 999 999 99 99').replace(/\s/g, '')}`" class="footer__phone-link">{{ clinic.info?.phone ?? '+7 999 999 99 99' }}</a>
        <a :href="`mailto:${clinic.info?.email ?? 'mail@vetsoft.local'}`" class="footer__email-link">{{ clinic.info?.email ?? 'mail@vetsoft.local' }}</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding: 60px 0;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  margin-top: 100px;
}

.footer__inner {
  display: flex;
  justify-content: space-between;
  gap: 40px;
}

.footer__brand {
  flex: 1;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
}

.logo__icon {
  width: 36px;
  height: 36px;
}
.logo__icon img {
  width: 100%;
  height: 100%;
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

.footer__address {
  margin: 20px 0;
  font-size: 14px;
}

.footer__socials-bottom {
  display: flex;
  gap: 10px;
}

.footer__socials-bottom a {
  text-decoration: none;
  color: inherit;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  transition: var(--transition);
}

.footer__socials-bottom a:hover {
  background: var(--white);
}

.footer__menu {
  display: flex;
  gap: 60px;
  flex: 2;
}

.footer__col {
  list-style: none;
}

.footer__col li {
  margin-bottom: 12px;
}

.footer__col a {
  text-decoration: none;
  color: var(--text-gray);
  font-size: 14px;
  transition: var(--transition);
}

.footer__col a:hover {
  color: var(--text-black);
}

.footer__contacts p {
  font-size: 14px;
  margin-bottom: 15px;
}

.footer__phone-link,
.footer__email-link {
  display: block;
  text-decoration: none;
  color: var(--text-black);
  padding: 10px 20px;
  border: 1px solid var(--text-black);
  border-radius: 8px;
  margin-bottom: 10px;
  text-align: center;
  font-weight: 500;
}

@media (max-width: 768px) {
  .footer__inner {
    flex-direction: column;
    text-align: center;
  }
  .footer__menu {
    flex-direction: column;
    gap: 30px;
  }
  .logo {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .footer {
    padding: 40px 0;
  }
  .footer__inner {
    gap: 30px;
  }
  .footer__menu {
    gap: 20px;
    text-align: center;
  }
  .footer__col {
    padding: 0;
  }
  .footer__col li {
    margin-bottom: 10px;
  }
  .footer__phone-link,
  .footer__email-link {
    width: 100%;
    padding: 15px;
    font-size: 16px;
  }
  .footer__brand .logo {
    justify-content: center;
  }
}
</style>
