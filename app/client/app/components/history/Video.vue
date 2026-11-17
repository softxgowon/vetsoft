<template>
  <section class="history-video">
    <div class="container">
      <h2 class="video__title">ДЛЯ ЗНАКОМСТВА С НАМИ ПРЕДЛАГАЮ ПОСМОТРЕТЬ ВИДЕО О НАШЕЙ КЛИНИКЕ</h2>
      <div class="video__container">
        <div class="video__player">
          <iframe width="100%" height="100%" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Видео о клинике" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.history-video {
  padding: 60px 0;
  text-align: center;
}
.video__title {
  font-size: 28px;
  font-weight: 900;
  max-width: 800px;
  margin: 0 auto 40px;
  text-transform: uppercase;
}
.video__container {
  max-width: 1000px;
  margin: 0 auto;
  aspect-ratio: 16 / 9;
  border-radius: 40px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}
@media (max-width: 480px) {
  .video__title {
    font-size: 18px;
  }
}
</style>
