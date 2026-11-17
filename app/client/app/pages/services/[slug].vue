<script setup lang="ts">
import type { ServiceCategory } from '~/types/api'
import { groupBy } from '~/utils/group-by'

const route = useRoute()
const slug = computed(() => String(route.params.slug))
const { data: category } = await useAsyncData(`service-category-${slug.value}`, () => useApi().get<ServiceCategory>(`/service-categories/${slug.value}`))

const groups = computed(() => groupBy(category.value?.items ?? [], (item) => item.groupTitle))

const openGroups = ref<Record<string, boolean>>({})
watch(groups, (list) => { for (const [title] of list) if (!(title in openGroups.value)) openGroups.value[title] = true }, { immediate: true })

const openFaq = ref<number | null>(null)

const legend = [
  { color: 'blue', text: 'В стоимость включены все лекарства' },
  { color: 'yellow', text: 'Финансовая ответственность клиники (100 000 ₽)' },
  { color: 'pink', text: 'Гарантия бесплатного лечения осложнений' },
]
</script>

<template>
  <div v-if="category" class="prices-page">
    <NuxtLink to="/services" class="back-btn">Назад</NuxtLink>
    <h1 class="page-title">{{ category.title }}</h1>

    <div v-for="[groupTitle, items] in groups" :key="groupTitle" class="accordion">
      <button class="accordion-header" @click="openGroups[groupTitle] = !openGroups[groupTitle]">
        <span>{{ groupTitle }}</span>
        <span class="arrow" :class="{ open: openGroups[groupTitle] }">⌃</span>
      </button>

      <div v-if="openGroups[groupTitle]" class="accordion-body">
        <ul class="legend">
          <li v-for="l in legend" :key="l.color"><span class="dot" :class="l.color" />{{ l.text }}</li>
        </ul>

        <div class="services">
          <div v-for="item in items" :key="item.id" class="service-row">
            <span class="service-name">{{ item.title }}</span>
            <div class="service-right">
              <div class="tags">
                <span v-if="item.includesMedicines" class="dot blue" />
                <span v-if="item.hasLiability" class="dot yellow" />
                <span v-if="item.hasComplicationsGuarantee" class="dot pink" />
              </div>
              <span class="price">{{ item.price }}₽</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="category.faq.length" class="faq">
      <div v-for="(f, i) in category.faq" :key="i" class="faq-card">
        <button class="faq-btn" :class="{ active: openFaq === i }" @click="openFaq = openFaq === i ? null : i">
          {{ f.q }} <span>{{ openFaq === i ? '−' : '+' }}</span>
        </button>
        <p v-if="openFaq === i">{{ f.a }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prices-page {
  padding: 16px 0 80px;
  color: #1f1f1f;
}
.back-btn {
  background: #fff3d6;
  border: none;
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 14px;
  text-decoration: none;
  color: inherit;
  display: inline-block;
}
.page-title {
  font-size: 36px;
  margin: 20px 0;
  font-weight: 900;
  text-transform: uppercase;
}
.accordion {
  background: #fdecc8;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 16px;
}
.accordion-header {
  width: 100%;
  background: transparent;
  border: none;
  padding: 16px;
  font-size: 18px;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
.arrow {
  transition: 0.3s;
}
.arrow.open {
  transform: rotate(180deg);
}
.accordion-body {
  padding: 12px 16px 16px;
}
.legend {
  list-style: none;
  padding: 0;
  margin: 0 0 16px;
}
.legend li {
  display: flex;
  align-items: center;
  font-size: 13px;
  margin-bottom: 8px;
}
.services {
  background: #f6e0b7;
  border-radius: 16px;
}
.service-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 12px;
  border-bottom: 1px solid #edd3a0;
}
.service-row:last-child {
  border-bottom: none;
}
.service-name {
  font-size: 14px;
  max-width: 60%;
}
.service-right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.price {
  font-weight: 600;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 8px;
}
.dot.blue {
  background: #3bb4ff;
}
.dot.yellow {
  background: #f4c04e;
}
.dot.pink {
  background: #ff3d7f;
}
.tags .dot {
  margin-right: 4px;
}
.faq {
  margin-top: 24px;
  display: grid;
  gap: 12px;
}
.faq-card {
  background: #fff3d6;
  border-radius: 14px;
  padding: 14px;
}
.faq-btn {
  background: transparent;
  border: none;
  border-radius: 14px;
  padding: 0;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  width: 100%;
  cursor: pointer;
}
.faq-card p {
  font-size: 13px;
  margin-top: 8px;
}
@media (max-width: 360px) {
  .page-title {
    font-size: 24px;
  }
  .service-name {
    max-width: 55%;
    font-size: 13px;
  }
  .price {
    font-size: 14px;
  }
}
</style>
