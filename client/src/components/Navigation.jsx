import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Menu, X, LogOut } from 'lucide-react';
import './Navigation.css';

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavClick = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo" onClick={() => handleNavClick('/')}>
          <span className="neon-glow">⚡ COALITION</span>
        </div>

        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`nav-links ${mobileOpen ? 'active' : ''}`}>
          {user && (
            <>
              <button 
                className="nav-link"
                onClick={() => handleNavClick('/coalition')}
              >
                🤝 Как попасть в коалицию
              </button>
              <button 
                className="nav-link"
                onClick={() => handleNavClick('/news')}
              >
                📰 Новости
              </button>
              <button 
                className="nav-link"
                onClick={() => window.open('https://youtube.com', '_blank')}
              >
                🎥 YouTube
              </button>
              <button 
                className="nav-link"
                onClick={() => window.open('https://t.me', '_blank')}
              >
                💬 Telegram
              </button>

              {user.role === 'admin' && (
                <button 
                  className="nav-link admin-btn"
                  onClick={() => handleNavClick('/admin')}
                >
                  ⚙️ Панель админа
                </button>
              )}

              <div className="user-info">
                <span className="username">{user.username}</span>
                <button 
                  className="logout-btn"
                  onClick={handleLogout}
                  title="Выход"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
