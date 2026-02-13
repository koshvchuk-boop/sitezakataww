import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title neon-glow">
            ⚡ ДОБРО ПОЖАЛОВАТЬ В КОАЛИЦИЮ ⚡
          </h1>
          <p className="hero-subtitle">
            Сервер Discord и Minecraft для всех любителей приключений
          </p>
          <p className="hero-description">
            Присоединяйтесь к нашей растущей коммьюте. Ответьте на несколько вопросов и станьте частью нашей семьи!
          </p>
          <div className="hero-buttons">
            <a href="/coalition" className="hero-btn primary-btn">
              🤝 Вступить в коалицию
            </a>
            <a href="/news" className="hero-btn secondary-btn">
              📰 Читать новости
            </a>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2 className="section-title">✨ Что ты получишь?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎮</div>
            <h3>Minecraft Сервер</h3>
            <p>Захватывающее выживание с друзьями на 24/7 сервере</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎤</div>
            <h3>Discord Сообщество</h3>
            <p>Активное сообщество с голосовыми каналами и эвентами</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>Награды</h3>
            <p>Участвуй в конкурсах и получай эксклюзивные награды</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Коммьюте</h3>
            <p>Найди новых друзей и союзников для совместных приключений</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Рейтинговая система</h3>
            <p>Поднимайся в рангах и получай специальные привилегии</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎉</div>
            <h3>Частые эвенты</h3>
            <p>Турниры, квесты, строительные конкурсы и много большего</p>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h2 className="neon-glow">Готов присоединиться?</h2>
        <p>Начни прямо сейчас и стань частью легенды!</p>
        <a href="/coalition" className="cta-button">
          Начать → 
        </a>
      </div>

      <div className="social-section">
        <h2 className="social-title">Следи за нами в соцсетях</h2>
        <div className="social-links">
          <a href="https://discord.gg/PBWchXqEP5" target="_blank" rel="noopener noreferrer" className="social-link discord">
            <span className="social-icon">💜</span>
            <span>Discord</span>
          </a>
          <a href="https://www.youtube.com/@CoolsM47/shorts" target="_blank" rel="noopener noreferrer" className="social-link youtube">
            <span className="social-icon">📺</span>
            <span>YouTube</span>
          </a>
          <a href="https://t.me/Workshop47MC" target="_blank" rel="noopener noreferrer" className="social-link telegram">
            <span className="social-icon">📱</span>
            <span>Telegram</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
