import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { questionsAPI, answersAPI } from '../api';
import { Plus, Edit2, Trash2, Eye, EyeOff, ChevronUp, ChevronDown } from 'lucide-react';
import './AdminPanel.css';

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ title: '', description: '' });
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchQuestions();
    }
  }, [user]);

  const fetchQuestions = async () => {
    try {
      const response = await questionsAPI.getAll();
      setQuestions(response.data);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    }
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.title || !newQuestion.description) {
      alert('Заполните все поля');
      return;
    }

    try {
      setLoading(true);
      await questionsAPI.create(newQuestion);
      setNewQuestion({ title: '', description: '' });
      fetchQuestions();
      alert('✅ Вопрос создан!');
    } catch (error) {
      alert('Ошибка при создании вопроса');
    } finally {
      setLoading(false);
    }
  };

  const viewAnswers = async (questionId) => {
    try {
      setLoading(true);
      const response = await questionsAPI.getOne(questionId);
      setSelectedQuestion(response.data.question);
      setAnswers(response.data.answers);
    } catch (error) {
      alert('Ошибка при загрузке ответов');
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async (questionId) => {
    if (!window.confirm('Вы уверены?')) return;

    try {
      await questionsAPI.delete(questionId);
      fetchQuestions();
      alert('✅ Вопрос удален!');
    } catch (error) {
      alert('Ошибка при удалении');
    }
  };

  const handleReorder = async (questionId, direction) => {
    try {
      await questionsAPI.reorder(questionId, direction);
      fetchQuestions();
      if (selectedQuestion?._id === questionId) {
        viewAnswers(questionId);
      }
    } catch (error) {
      alert('Ошибка при переупорядочивании вопроса');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="admin-panel-page">
        <div className="error-container">
          <h2>❌ Доступ запрещен</h2>
          <p>Только администраторы могут посещать эту страницу</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel-page">
      <div className="admin-container">
        <h1 className="page-title neon-glow">⚙️ Панель администратора</h1>

        <div className="admin-content">
          {/* Create Question Form */}
          <div className="admin-section">
            <h2 className="section-title">➕ Создать новый вопрос</h2>
            <form onSubmit={handleCreateQuestion} className="question-form">
              <input
                type="text"
                placeholder="Заголовок вопроса"
                value={newQuestion.title}
                onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Описание вопроса"
                value={newQuestion.description}
                onChange={(e) => setNewQuestion({ ...newQuestion, description: e.target.value })}
                required
                rows="4"
              />
              <button type="submit" disabled={loading} className="create-btn">
                <Plus size={18} /> {loading ? 'Создание...' : 'Создать вопрос'}
              </button>
            </form>
          </div>

          <div className="admin-row">
            {/* Questions List */}
            <div className="admin-section">
              <h2 className="section-title">📋 Список вопросов</h2>
              <div className="questions-list">
                {questions.map((q) => (
                  <div key={q._id} className="question-item">
                    <div className="question-info">
                      <h3>{q.title}</h3>
                      <p>{q.description}</p>
                    </div>
                    <div className="question-actions">
                      <button
                        className="action-btn reorder-btn"
                        onClick={() => handleReorder(q._id, 'up')}
                        title="Переместить вверх"
                      >
                        <ChevronUp size={18} />
                      </button>
                      <button
                        className="action-btn reorder-btn"
                        onClick={() => handleReorder(q._id, 'down')}
                        title="Переместить вниз"
                      >
                        <ChevronDown size={18} />
                      </button>
                      <button
                        className="action-btn view-btn"
                        onClick={() => viewAnswers(q._id)}
                        title="Посмотреть ответы"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => deleteQuestion(q._id)}
                        title="Удалить"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Answers Display */}
            <div className="admin-section">
              <h2 className="section-title">💬 Ответы пользователей</h2>
              {selectedQuestion ? (
                <div className="answers-container">
                  <h3 className="selected-question">{selectedQuestion.title}</h3>
                  <div className="answers-list">
                    {answers.map((answer) => (
                      <div key={answer._id} className="answer-item">
                        <div className="answer-user">
                          <strong>{answer.userId.username}</strong>
                          <span>{answer.userId.email}</span>
                        </div>
                        <div className="answer-text">
                          {answer.answer}
                        </div>
                        <div className="answer-date">
                          {new Date(answer.createdAt).toLocaleDateString('ru-RU')}
                        </div>
                      </div>
                    ))}
                  </div>
                  {answers.length === 0 && (
                    <p className="no-answers">Нет ответов на этот вопрос</p>
                  )}
                </div>
              ) : (
                <div className="empty-select">
                  <Eye size={48} />
                  <p>Выберите вопрос, чтобы посмотреть ответы</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
