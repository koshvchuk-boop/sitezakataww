import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { questionsAPI } from '../api';
import { Plus, ChevronUp, ChevronDown, Trash2, Check, X, Eye } from 'lucide-react';
import './AdminPanel.css';

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const [tab, setTab] = useState('questions');
  
  // Questions state
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);

  // Tickets state
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketDetails, setShowTicketDetails] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') {
      if (tab === 'questions') {
        fetchQuestions();
      } else {
        fetchTickets();
      }
    }
  }, [user, tab]);

  // ========== QUESTIONS ==========
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
    } catch (error) {
      alert('Ошибка при переупорядочивании вопроса');
    }
  };

  // ========== TICKETS ==========
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/answers/admin/tickets', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setTickets(data);
      console.log('✅ Loaded', data.length, 'tickets');
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewTicketDetails = (ticket) => {
    setSelectedTicket(ticket);
    setShowTicketDetails(true);
  };

  const closeTicketDetails = () => {
    setShowTicketDetails(false);
    setTimeout(() => setSelectedTicket(null), 300);
  };

  const reviewTicket = async (ticketId, status) => {
    if (!window.confirm(`Вы уверены что хотите ${status === 'approved' ? 'одобрить' : 'отклонить'} этот тикет?`)) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/answers/admin/ticket/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        alert('Ошибка при обновлении тикета');
        return;
      }

      alert(`✅ Тикет ${status === 'approved' ? 'одобрен' : 'отклонен'}!`);
      fetchTickets();
      closeTicketDetails();
    } catch (error) {
      console.error('Failed to review ticket:', error);
      alert('Ошибка при обновлении тикета');
    } finally {
      setLoading(false);
    }
  };

  const deleteTicket = async (ticketId) => {
    if (!window.confirm('Вы уверены что хотите удалить этот тикет?')) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/answers/admin/ticket/${ticketId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        alert('Ошибка при удалении тикета');
        return;
      }

      alert('✅ Тикет удален!');
      fetchTickets();
      closeTicketDetails();
    } catch (error) {
      console.error('Failed to delete ticket:', error);
      alert('Ошибка при удалении тикета');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: '⏳ Ожидание', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
      approved: { text: '✅ Одобрено', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
      rejected: { text: '❌ Отклонено', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' }
    };
    return statusConfig[status] || statusConfig.pending;
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

        {/* Tabs */}
        <div className="admin-tabs">
          <button 
            className={`admin-tab ${tab === 'questions' ? 'active' : ''}`}
            onClick={() => setTab('questions')}
          >
            ❓ Вопросы ({questions.length})
          </button>
          <button 
            className={`admin-tab ${tab === 'tickets' ? 'active' : ''}`}
            onClick={() => setTab('tickets')}
          >
            🎫 Тикеты ({tickets.filter(t => t.status === 'pending').length})
          </button>
        </div>

        {/* Questions Tab */}
        {tab === 'questions' && (
          <div className="admin-content">
            <div className="admin-row">
              <div className="admin-left">
                <h2>➕ Создать вопрос</h2>
                <form className="question-form" onSubmit={handleCreateQuestion}>
                  <input
                    type="text"
                    placeholder="Название вопроса"
                    value={newQuestion.title}
                    onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                  />
                  <textarea
                    placeholder="Описание вопроса"
                    value={newQuestion.description}
                    onChange={(e) => setNewQuestion({ ...newQuestion, description: e.target.value })}
                    rows="4"
                  />
                  <button className="create-btn" type="submit" disabled={loading}>
                    <Plus size={18} /> Добавить вопрос
                  </button>
                </form>
              </div>

              <div className="admin-right">
                <h2>📋 Все вопросы</h2>
                <div className="questions-list">
                  {questions.map((q) => (
                    <div key={q._id} className="question-item">
                      <div className="question-content">
                        <h3>{q.title}</h3>
                        <p>{q.description}</p>
                      </div>
                      <div className="question-actions">
                        <button 
                          onClick={() => handleReorder(q._id, 'up')} 
                          title="Вверх"
                          className="action-btn"
                        >
                          <ChevronUp size={18} />
                        </button>
                        <button 
                          onClick={() => handleReorder(q._id, 'down')} 
                          title="Вниз"
                          className="action-btn"
                        >
                          <ChevronDown size={18} />
                        </button>
                        <button 
                          onClick={() => deleteQuestion(q._id)} 
                          title="Удалить"
                          className="action-btn delete-btn"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tickets Tab */}
        {tab === 'tickets' && (
          <div className="admin-content">
            <div className="tickets-container">
              <h2>🎫 Заявки на вступление</h2>
              
              {loading && <div className="loading-text">Загрузка...</div>}

              {!loading && tickets.length === 0 && (
                <div className="empty-state">Нет тикетов</div>
              )}

              {!loading && tickets.length > 0 && (
                <div className="tickets-list">
                  {tickets.map((ticket) => {
                    const status = getStatusBadge(ticket.status);
                    return (
                      <div key={ticket._id} className={`ticket-card status-${ticket.status}`}>
                        <div className="ticket-header">
                          <div className="ticket-user">
                            <h3>{ticket.userId?.username}</h3>
                            <p>{ticket.userId?.email}</p>
                            {ticket.userId?.discordUsername && (
                              <p className="discord-name">Discord: {ticket.userId.discordUsername}</p>
                            )}
                          </div>
                          <div className="ticket-meta">
                            <div 
                              className="status-badge"
                              style={{ backgroundColor: status.bg, color: status.color }}
                            >
                              {status.text}
                            </div>
                            <small className="submit-date">
                              {new Date(ticket.submittedAt).toLocaleDateString('ru-RU')}
                            </small>
                          </div>
                        </div>

                        {ticket.status === 'pending' && (
                          <div className="ticket-actions">
                            <button
                              className="btn-view"
                              onClick={() => viewTicketDetails(ticket)}
                            >
                              <Eye size={16} /> Просмотр ответов
                            </button>
                            <button
                              className="btn-approve"
                              onClick={() => reviewTicket(ticket._id, 'approved')}
                              disabled={loading}
                            >
                              <Check size={16} /> Одобрить
                            </button>
                            <button
                              className="btn-reject"
                              onClick={() => reviewTicket(ticket._id, 'rejected')}
                              disabled={loading}
                            >
                              <X size={16} /> Отклонить
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Ticket Details Modal */}
      {showTicketDetails && selectedTicket && (
        <div className={`modal-overlay ${showTicketDetails ? 'active' : ''}`} onClick={closeTicketDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📝 Ответы {selectedTicket.userId?.username}</h2>
              <button className="modal-close" onClick={closeTicketDetails}>×</button>
            </div>

            <div className="modal-body">
              <div className="answers-list">
                {selectedTicket.answers.map((answer, index) => (
                  <div key={index} className="answer-item">
                    <div className="answer-header">
                      <strong className="question-title">
                        {index + 1}. {answer.questionId?.title}
                      </strong>
                    </div>
                    <div className="answer-text">
                      {answer.answer}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedTicket.status === 'pending' && (
              <div className="modal-footer">
                <button
                  className="btn-approve"
                  onClick={() => reviewTicket(selectedTicket._id, 'approved')}
                  disabled={loading}
                >
                  <Check size={16} /> Одобрить
                </button>
                <button
                  className="btn-reject"
                  onClick={() => reviewTicket(selectedTicket._id, 'rejected')}
                  disabled={loading}
                >
                  <X size={16} /> Отклонить
                </button>
                <button
                  className="btn-cancel"
                  onClick={closeTicketDetails}
                >
                  Закрыть
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
