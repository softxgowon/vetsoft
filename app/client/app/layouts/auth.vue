<script setup lang="ts"></script>

<template>
  <LayoutHeader />
  <div class="app-wrapper">
    <main class="main-content">
      <section class="auth-shell section-padding">
        <div class="container auth-shell__inner">
          <slot />
        </div>
      </section>
    </main>
    <LayoutFooter />
  </div>
</template>

<style scoped>
.auth-shell {
  display: flex;
  justify-content: center;
}
.auth-shell__inner {
  max-width: 440px;
}
</style>
