<script setup lang="ts">
import { initialsOf, colorOf } from '~/utils/avatar'

const props = withDefaults(defineProps<{ name: string; size?: number }>(), { size: 64 })
const style = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  background: colorOf(props.name),
  fontSize: `${Math.round(props.size * 0.36)}px`,
}))
</script>

<template>
  <div class="doctor-avatar" :style="style">{{ initialsOf(name) }}</div>
</template>

<style scoped>
.doctor-avatar {
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff9eb;
  font-weight: 800;
  flex-shrink: 0;
  user-select: none;
}
</style>
