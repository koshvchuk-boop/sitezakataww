import React from 'react';
import './News.css';

const News = () => {
  const newsItems = [
    {
      id: 1,
      title: 'Добро пожаловать в коалицию!',
      date: '12 февраля 2026',
      content: 'Мы рады объявить о запуске нашего нового сайта для вступления в коалицию. Теперь вы можете подать заявку прямо здесь!',
      category: 'Обновление',
    },
    {
      id: 2,
      title: 'Новый эвент на сервере',
      date: '10 февраля 2026',
      content: 'Готовьтесь к грандиозному эвенту! Победители получат эксклюзивные награды.',
      category: 'Эвент',
    },
    {
      id: 3,
      title: 'Обновление сервера Minecraft',
      date: '8 февраля 2026',
      content: 'Установлена новая версия сервера с улучшенной производительностью и новыми плагинами.',
      category: 'Техническое',
    },
  ];

  return (
    <div className="news-page">
      <div className="news-container">
        <h1 className="page-title neon-glow">📰 Новости</h1>

        <div className="news-grid">
          {newsItems.map((news) => (
            <div key={news.id} className="news-card">
              <div className="news-header">
                <span className="news-category">{news.category}</span>
                <span className="news-date">{news.date}</span>
              </div>
              <h2 className="news-title">{news.title}</h2>
              <p className="news-content">{news.content}</p>
              <a href="#" className="read-more">Подробнее →</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;
