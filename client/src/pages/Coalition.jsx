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
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await questionsAPI.getAll();
      setQuestions(response.data);

      // Load user's existing answers
      response.data.forEach(async (q) => {
        try {
          const answer = await answersAPI.getAnswer(q._id);
          if (answer.data) {
            setSubmitted(prev => ({ ...prev, [q._id]: true }));
            setAnswers(prev => ({ ...prev, [q._id]: answer.data.answer }));
          }
        } catch (err) {
          // No answer yet
        }
      });
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setLoading(false);
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
      alert('✅ Ответ отправлен!');
    } catch (error) {
      alert(error.response?.data?.message || 'Ошибка при отправке');
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

  const allAnswered = questions.every(q => submitted[q._id]);

  return (
    <div className="coalition-page">
      <div className="coalition-container">
        <h1 className="page-title neon-glow">
          🤝 Как попасть в коалицию
        </h1>

        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${(Object.keys(submitted).length / questions.length) * 100}%` }}
          ></div>
        </div>
        <p className="progress-text">
          Вы ответили на {Object.keys(submitted).length} из {questions.length} вопросов
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
          <div className="success-banner">
            <h3>✨ Спасибо! ✨</h3>
            <p>Вы ответили на все вопросы. Администраторы рассмотрят вашу кандидатуру.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Coalition;
