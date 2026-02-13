import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Coalition from './pages/Coalition';
import News from './pages/News';
import AdminPanel from './pages/AdminPanel';
import './styles/globals.css';

function AppContent() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #0a0e27 100%)',
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid rgba(192, 132, 252, 0.2)',
          borderTop: '4px solid #c084fc',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}></div>
      </div>
    );
  }

  return (
    <>
      {user && <Navigation />}
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />

        {/* Protected Routes */}
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/coalition" element={user ? <Coalition /> : <Navigate to="/login" />} />
        <Route path="/news" element={user ? <News /> : <Navigate to="/login" />} />
        <Route path="/admin" element={user ? <AdminPanel /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
