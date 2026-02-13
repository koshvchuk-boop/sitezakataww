import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { questionsAPI, answersAPI } from '../api';
import { Send, CheckCircle } from 'lucide-react';
import './Coalition.css';

const Coalition = () => {
  const { user } = useContext(AuthContext);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [allAnswered, setAllAnswered] = useState(false);
  const [canSubmitTicket, setCanSubmitTicket] = useState(false);
  const [ticketStatus, setTicketStatus] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submittingTicket, setSubmittingTicket] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('Coalition page loaded, user:', user);
    if (!user) {
      setError('Вы должны быть авторизованы');
      setLoading(false);
      return;
    }
    fetchQuestions();
    checkCompletion();
  }, [user]);

  useEffect(() => {
    checkCompletion();
  }, [submitted]);

  const fetchQuestions = async () => {
    try {
      console.log('Fetching questions...');
      const response = await questionsAPI.getAll();
      console.log('Questions loaded:', response.data.length, 'questions');
      setQuestions(response.data);

      let loadedAnswers = 0;
      response.data.forEach(async (q) => {
        try {
          const answer = await answersAPI.getAnswer(q._id);
          if (answer.data) {
            console.log('✅ Loaded answer for question:', q.title);
            setSubmitted(prev => ({ ...prev, [q._id]: true }));
            setAnswers(prev => ({ ...prev, [q._id]: answer.data.answer }));
            loadedAnswers++;
          }
        } catch (err) {
          console.log('ℹ️ No answer yet for:', q.title);
        }
      });
      
      console.log('Total answers to load:', loadedAnswers);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      setError('Ошибка при загрузке вопросов');
    } finally {
      setLoading(false);
    }
  };

  const checkCompletion = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      console.log('Checking completion with token:', token?.substring(0, 20) + '...');
      const response = await fetch('http://localhost:5000/api/answers/check-completion', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      console.log('Completion check result:', data);
      setAllAnswered(data.allAnswered);
      setCanSubmitTicket(data.canSubmit);
      setTicketStatus(data.ticketStatus);
    } catch (error) {
      console.error('Failed to check completion:', error);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmitAnswer = async (questionId) => {
    if (!answers[questionId] || !answers[questionId].trim()) {
      alert('Пожалуйста, введите ответ');
      return;
    }

    try {
      await answersAPI.submit({
        questionId,
        answer: answers[questionId],
      });
      setSubmitted(prev => ({ ...prev, [questionId]: true }));
    } catch (error) {
      alert(error.response?.data?.message || 'Ошибка при отправке');
    }
  };

  const handleSubmitTicket = async () => {
    setSubmittingTicket(true);
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/answers/submit-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      const data = await response.json();
      
      if (!response.ok) {
        alert(data.message || 'Ошибка при отправке тикета');
        return;
      }

      setTicketStatus('pending');
      alert('✅ Ваша заявка отправлена на проверку администраторам!');
    } catch (error) {
      console.error('Failed to submit ticket:', error);
      alert('Ошибка при отправке тикета');
    } finally {
      setSubmittingTicket(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Загрузка вопросов...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="coalition-page">
        <div className="empty-state">
          <h2>❌ Ошибка</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="coalition-page">
        <div className="empty-state">
          <h2>❌ Требуется авторизация</h2>
          <p>Пожалуйста, авторизуйтесь для участия в коалиции</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="coalition-page">
        <div className="empty-state">
          <h2>Нет вопросов</h2>
          <p>Администраторы еще не создали вопросы для коалиции</p>
        </div>
      </div>
    );
  }

  const questionsAnswered = Object.keys(submitted).length;

  console.log('Coalition render state:');
  console.log('- Questions total:', questions.length);
  console.log('- Answers submitted:', questionsAnswered);
  console.log('- All answered:', allAnswered);
  console.log('- Can submit ticket:', canSubmitTicket);
  console.log('- Ticket status:', ticketStatus);

  return (
    <div className="coalition-page">
      <div className="coalition-container">
        <h1 className="page-title neon-glow">
          🤝 Как попасть в коалицию
        </h1>

        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${(questionsAnswered / questions.length) * 100}%` }}
          ></div>
        </div>
        <p className="progress-text">
          Вы ответили на {questionsAnswered} из {questions.length} вопросов
        </p>

        <div className="questions-carousel">
          {questions.map((question, index) => (
            <div 
              key={question._id}
              className={`question-card ${index === currentQuestion ? 'active' : ''} ${submitted[question._id] ? 'answered' : ''}`}
            >
              <div className="question-header">
                <span className="question-number">Вопрос {index + 1}/{questions.length}</span>
                {submitted[question._id] && (
                  <span className="answered-badge">
                    <CheckCircle size={16} /> Ответлено
                  </span>
                )}
              </div>

              <h2 className="question-title">{question.title}</h2>
              <p className="question-description">{question.description}</p>

              <div className="answer-form">
                <textarea
                  placeholder="Введите ваш ответ здесь..."
                  value={answers[question._id] || ''}
                  onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                  disabled={submitted[question._id]}
                  rows="6"
                />
                
                {!submitted[question._id] && (
                  <button
                    onClick={() => handleSubmitAnswer(question._id)}
                    className="submit-answer-btn"
                  >
                    <Send size={18} /> Отправить ответ
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="carousel-controls">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="nav-btn"
          >
            ← Предыдущий
          </button>

          <div className="dots">
            {questions.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentQuestion ? 'active' : ''} ${submitted[questions[index]._id] ? 'answered' : ''}`}
                onClick={() => setCurrentQuestion(index)}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
            disabled={currentQuestion === questions.length - 1}
            className="nav-btn"
          >
            Следующий →
          </button>
        </div>

        {allAnswered && (
          <div style={{ marginTop: '20px' }}>
            <p style={{ textAlign: 'center', fontSize: '14px', color: '#aaa' }}>
              ✅ Вы ответили на все вопросы!
            </p>
            {ticketStatus === 'pending' ? (
              <div className="status-banner status-pending">
                <AlertCircle size={24} />
                <div>
                  <strong>⏳ Ваша заявка уже отправлена</strong>
                  <p>Идет рассмотрение вашей заявки</p>
                </div>
              </div>
            ) : ticketStatus === 'rejected' ? (
              <button
                onClick={handleSubmitTicket}
                disabled={submittingTicket}
                className="submit-ticket-btn"
              >
                {submittingTicket ? 'Повторная отправка...' : '🎫 Переотправить заявку'}
              </button>
            ) : (
              <button
                onClick={handleSubmitTicket}
                disabled={submittingTicket}
                className="submit-ticket-btn"
              >
                {submittingTicket ? 'Отправка...' : '🎫 Отправить на проверку'}
              </button>
            )}
          </div>
        )}

        {ticketStatus === 'approved' && (
          <div className="success-banner">
            <h3>✨ Добро пожаловать! ✨</h3>
            <p>Присоединяйтесь к нашему серверу Discord и начните приключение!</p>
            <a href={import.meta.env.VITE_DISCORD_INVITE || 'https://discord.gg/PBWchXqEP5'} className="discord-link" target="_blank" rel="noopener noreferrer">
              Перейти на Discord Сервер
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Coalition;
