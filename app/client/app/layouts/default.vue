<script setup lang="ts">
// публичный layout повторяет структуру исходного App.js: шапка и hero-баннер показываются на каждой странице сайта
</script>

<template>
  <LayoutHeader />
  <LayoutHero />
  <div class="app-wrapper">
    <main class="main-content">
      <slot />
    </main>
    <LayoutFooter />
  </div>
</template>
