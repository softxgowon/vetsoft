<script setup lang="ts">
import type { Article } from '~/types/api'
const route = useRoute()
const slug = computed(() => String(route.params.slug))
const { data: article } = await useAsyncData(`article-${slug.value}`, () => useApi().get<Article>(`/articles/${slug.value}`))
const formatDate = (iso: string) => new Date(iso).toLocaleDateString('ru-RU')
</script>

<template>
  <main class="article-page">
    <div class="container section-padding">
      <NuxtLink to="/articles" class="back-link">← Все статьи</NuxtLink>
      <template v-if="article">
        <span class="article-date">{{ formatDate(article.publishedAt) }}</span>
        <h1 class="article-title">{{ article.title }}</h1>
        <p class="article-content">{{ article.content }}</p>
      </template>
    </div>
  </main>
</template>

<style scoped>
.article-page {
  background-color: #f5ecd6;
  min-height: 100vh;
}
.back-link {
  text-decoration: none;
  color: var(--text-gray);
  font-weight: 600;
  display: inline-block;
  margin-bottom: 30px;
}
.article-date {
  background: #fff9eb;
  padding: 6px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 16px;
}
.article-title {
  font-size: 40px;
  font-weight: 900;
  margin-bottom: 30px;
  max-width: 800px;
}
.article-content {
  font-size: 16px;
  line-height: 1.7;
  max-width: 700px;
  white-space: pre-line;
  color: var(--text-black);
}
@media (max-width: 768px) {
  .article-title {
    font-size: 26px;
  }
}
</style>
