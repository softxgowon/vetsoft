<script setup lang="ts">
// встраиваемая карта openstreetmap: не требует ключа/id конструктора и всегда занимает всю ширину и высоту контейнера,
// в отличие от яндекс-виджета, который без настоящего id конструктора рисует узкую заглушку с ошибкой
// координаты по умолчанию — центр Великого Новгорода (адрес клиники: ул. Кочетова, дом 16/46);
// это приблизительная точка города, а не точный дом — при необходимости уточните lat/lon у конкретного адреса
const props = withDefaults(defineProps<{ lat?: number; lon?: number; zoomSpanLon?: number; zoomSpanLat?: number }>(), {
  lat: 58.5215,
  lon: 31.2755,
  zoomSpanLon: 0.01,
  zoomSpanLat: 0.006,
})

const embedUrl = computed(() => {
  const minLon = props.lon - props.zoomSpanLon
  const maxLon = props.lon + props.zoomSpanLon
  const minLat = props.lat - props.zoomSpanLat
  const maxLat = props.lat + props.zoomSpanLat
  return `https://www.openstreetmap.org/export/embed.html?bbox=${minLon}%2C${minLat}%2C${maxLon}%2C${maxLat}&layer=mapnik&marker=${props.lat}%2C${props.lon}`
})
</script>

<template>
  <iframe class="clinic-map" :src="embedUrl" title="Карта" loading="lazy"></iframe>
</template>

<style scoped>
.clinic-map {
  width: 100%;
  height: 100%;
  min-height: 100%;
  border: 0;
  display: block;
}
</style>
