import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { newsAPI } from '../api';
import { Trash2, Edit2, Plus } from 'lucide-react';
import './News.css';

const News = () => {
  const { user } = useContext(AuthContext);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newArticle, setNewArticle] = useState({
    title: '',
    description: '',
    content: '',
    imageUrl: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      console.log('📰 Fetching news...');
      const response = await newsAPI.getAll();
      setNews(response.data);
      console.log('✅ Loaded', response.data.length, 'news articles');
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewArticle(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newArticle.title || !newArticle.description || !newArticle.content) {
      alert('Заполните все поля');
      return;
    }

    try {
      if (editingId) {
        // Update news
        await newsAPI.update(editingId, newArticle);
        console.log('✏️ News updated');
        setEditingId(null);
      } else {
        // Create new news
        const response = await newsAPI.create(newArticle);
        console.log('✅ News created:', response.data._id);
      }

      setNewArticle({
        title: '',
        description: '',
        content: '',
        imageUrl: '',
      });
      setShowForm(false);
      fetchNews();
      alert('✅ Готово!');
    } catch (error) {
      console.error('Error:', error);
      alert('Ошибка при сохранении новости');
    }
  };

  const handleEdit = (article) => {
    setNewArticle({
      title: article.title,
      description: article.description,
      content: article.content,
      imageUrl: article.imageUrl || '',
    });
    setEditingId(article._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены?')) return;

    try {
      await newsAPI.delete(id);
      console.log('🗑️ News deleted');
      fetchNews();
      alert('✅ Новость удалена!');
    } catch (error) {
      console.error('Error:', error);
      alert('Ошибка при удалении');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Загрузка новостей...</p>
      </div>
    );
  }

  return (
    <div className="news-page">
      <div className="news-container">
        <h1 className="page-title neon-glow">📰 Новости</h1>

        {/* Admin Panel */}
        {user?.role === 'admin' && (
          <div className="admin-news-section">
            <button 
              onClick={() => {
                setShowForm(!showForm);
                setEditingId(null);
                setNewArticle({
                  title: '',
                  description: '',
                  content: '',
                  imageUrl: '',
                });
              }} 
              className="create-news-btn"
            >
              <Plus size={20} /> {showForm ? 'Отмена' : 'Добавить новость'}
            </button>

            {showForm && (
              <div className="news-form-container">
                <h2>{editingId ? '✏️ Редактировать новость' : '✍️ Новая новость'}</h2>
                <form onSubmit={handleSubmit} className="news-form">
                  <div className="form-group">
                    <label htmlFor="title">Заголовок*</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={newArticle.title}
                      onChange={handleInputChange}
                      placeholder="Заголовок новости"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Описание (краткое)*</label>
                    <input
                      type="text"
                      id="description"
                      name="description"
                      value={newArticle.description}
                      onChange={handleInputChange}
                      placeholder="Краткое описание для списка новостей"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="content">Содержание*</label>
                    <textarea
                      id="content"
                      name="content"
                      value={newArticle.content}
                      onChange={handleInputChange}
                      placeholder="Полное содержание новости"
                      rows="8"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="imageUrl">URL изображения</label>
                    <input
                      type="url"
                      id="imageUrl"
                      name="imageUrl"
                      value={newArticle.imageUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                    {newArticle.imageUrl && (
                      <img src={newArticle.imageUrl} alt="Preview" className="image-preview" />
                    )}
                  </div>

                  <button type="submit" className="submit-btn">
                    {editingId ? '💾 Сохранить' : '➕ Создать'}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* News Grid */}
        <div className="news-grid">
          {news.length === 0 ? (
            <div className="empty-state">
              <p>Нет новостей</p>
            </div>
          ) : (
            news.map((article) => (
              <div key={article._id} className="news-card">
                {article.imageUrl && (
                  <div className="news-image">
                    <img src={article.imageUrl} alt={article.title} />
                  </div>
                )}
                <div className="news-header">
                  <span className="news-author">от {article.author?.username}</span>
                  <span className="news-date">
                    {new Date(article.publishedAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                <h2 className="news-title">{article.title}</h2>
                <p className="news-content">{article.description}</p>
                
                <div className="news-footer">
                  <a href={`#news-${article._id}`} className="read-more">
                    Подробнее →
                  </a>
                  {user?.role === 'admin' && (
                    <div className="admin-actions">
                      <button
                        onClick={() => handleEdit(article)}
                        className="edit-btn"
                        title="Редактировать"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(article._id)}
                        className="delete-btn"
                        title="Удалить"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default News;
