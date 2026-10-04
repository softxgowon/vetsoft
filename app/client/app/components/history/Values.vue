<template>
  <section class="history-values section-padding">
    <div class="container">
      <div class="values__content">
        <div class="values__block">
          <span class="values__badge">Наша миссия</span>
          <p class="values__description">
            Обеспечить квалифицированную медицинскую помощь и ее доступность домашним животным через непрерывный обмен знаниями с ведущими ветеринарными клиниками России и Европы, через постоянное расширение своих клинических компетенций.
          </p>
        </div>

        <div class="values__block">
          <span class="values__badge">Наша цель</span>
          <p class="values__description">Дарить счастье и удовольствие от общения и настоящей дружбы человеку и питомцу.</p>
        </div>

        <div class="values__block">
          <span class="values__badge">Почему мы?</span>
          <ul class="values__list">
            <li>• Современные методы обследования.</li>
            <li>• Высокая степень ответственности за проведенную диагностику, профилактику и оказанное лечение каждого пациента.</li>
            <li>• Гарантия обоснованного назначения процедур, препаратов и методов лечения.</li>
            <li>• Менеджмент качества оказания услуг.</li>
            <li>• Постоянное развитие знаний, навыков и практического опыта персонала.</li>
            <li>• Безупречная вежливость и внимательность персонала.</li>
          </ul>
          <p class="values__trust-note">Доверяя нам здоровье ваших питомцев, вы выбираете ответственных профессионалов и качество ветеринарного центра.</p>
        </div>

        <div class="values__footer">
          <p class="values__final-quote">С любовью и заботой о здоровье и красоте питомцев, предлагаем свою дружбу, а дружба — понятие круглосуточное! Мы всегда рады вашему визиту!</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.history-values {
  text-align: center;
  padding-bottom: 100px;
}
.values__content {
  max-width: 900px;
  margin: 0 auto;
}
.values__block {
  margin-bottom: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.values__badge {
  background-color: #fff9eb;
  padding: 12px 35px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
  color: #1a1513;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 25px;
  display: inline-block;
}
.values__description {
  font-size: 18px;
  line-height: 1.6;
  color: #1a1513;
  font-weight: 500;
}
.values__list {
  list-style: none;
  padding: 0;
  margin: 0 auto 30px;
  text-align: center;
}
.values__list li {
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 12px;
  color: #1a1513;
  font-weight: 500;
}
.values__trust-note {
  font-size: 16px;
  font-weight: 600;
  margin-top: 20px;
  color: #1a1513;
}
.values__footer {
  margin-top: 80px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding-top: 40px;
}
.values__final-quote {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.4;
  color: #1a1513;
}
@media (max-width: 768px) {
  .values__description,
  .values__final-quote {
    font-size: 16px;
  }
  .values__list li {
    font-size: 14px;
  }
  .values__badge {
    padding: 10px 25px;
    font-size: 13px;
  }
}
</style>
