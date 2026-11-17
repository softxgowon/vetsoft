<script setup lang="ts">
const toast = useToastStore()
</script>

<template>
  <Teleport to="body">
    <div v-if="toast.items.length" class="toast-stack">
      <div v-for="t in toast.items" :key="t.id" class="toast" @click="toast.remove(t.id)">
        <div class="toast__title">{{ t.title }}</div>
        <div v-if="t.body" class="toast__body">{{ t.body }}</div>
      </div>
    </div>
  </Teleport>
</template>
