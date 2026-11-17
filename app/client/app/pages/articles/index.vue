<script setup lang="ts">
import type { Page, ArticleSummary } from '~/types/api'

const route = useRoute()
const router = useRouter()
const page = computed(() => Number(route.query.page ?? 1))

const { data } = await useAsyncData(
  () => `articles-${page.value}`,
  () => useApi().get<Page<ArticleSummary>>('/articles', { page: page.value, limit: 4 }),
  { watch: [page] },
)

const goTo = (p: number) => router.push({ query: { page: p } })
const formatDate = (iso: string) => new Date(iso).toLocaleDateString('ru-RU')
</script>

<template>
  <main class="articles-page">
    <section class="articles section-padding">
      <div class="container">
        <h1 class="section-title center-text">СТАТЬИ</h1>

        <div class="articles__grid">
          <div v-for="article in data?.items" :key="article.id" class="article-card">
            <div class="article-card__image-placeholder"></div>
            <div class="article-card__content">
              <h3 class="article-card__title">{{ article.title }}</h3>
              <div class="article-card__footer">
                <span class="article-card__date">{{ formatDate(article.publishedAt) }}</span>
                <NuxtLink :to="`/articles/${article.slug}`" class="btn-open">Открыть</NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <div v-if="data && data.pages > 1" class="pagination">
          <button class="pagination__arrow prev" :disabled="page <= 1" @click="goTo(page - 1)">‹</button>
          <span class="pagination__current">{{ page }}</span>
          <button class="pagination__arrow next" :disabled="page >= data.pages" @click="goTo(page + 1)">›</button>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.articles-page {
  background-color: #f5ecd6;
  min-height: 100vh;
}
.center-text {
  text-align: center;
  margin-bottom: 50px;
  font-size: 42px;
  font-weight: 900;
}
.articles__grid {
  display: flex;
  flex-direction: column;
  gap: 40px;
  max-width: 1000px;
  margin: 0 auto;
}
.article-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.article-card__image-placeholder {
  width: 100%;
  aspect-ratio: 16 / 6;
  background-color: #fff9eb;
  border-radius: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
}
.article-card__title {
  font-size: 20px;
  font-weight: 700;
  margin: 10px 0;
  color: #1a1513;
}
.article-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.article-card__date {
  background: #fff9eb;
  padding: 8px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
}
.btn-open {
  background: #fff9eb;
  border: none;
  padding: 8px 30px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  text-decoration: none;
  color: inherit;
}
.btn-open:hover {
  opacity: 0.8;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 60px;
}
.pagination__arrow,
.pagination__current {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff9eb;
  border-radius: 12px;
  font-weight: 700;
  border: none;
  cursor: pointer;
}
.pagination__arrow:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.pagination__current {
  background: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}
@media (max-width: 768px) {
  .center-text {
    font-size: 28px;
    margin-bottom: 30px;
  }
  .article-card__image-placeholder {
    aspect-ratio: 1 / 0.6;
    border-radius: 20px;
  }
  .article-card__title {
    font-size: 16px;
    line-height: 1.4;
  }
  .article-card__date,
  .btn-open {
    flex: 1;
    text-align: center;
    padding: 10px 5px;
    font-size: 12px;
  }
}
</style>
