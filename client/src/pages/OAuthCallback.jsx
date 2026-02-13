import React, { useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Home from './Home';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);

  useEffect(() => {
    const token = searchParams.get('oauth_token');
    
    if (token) {
      // Save token to localStorage
      localStorage.setItem('authToken', token);
      console.log('✅ OAuth token received:', token.substring(0, 20) + '...');
      
      // Redirect to home after a short delay to ensure token is saved and auth context updates
      setTimeout(() => {
        window.location.href = '/home';
      }, 500);
    }
  }, [searchParams, navigate]);

  // If we have OAuth token in URL, show loading
  if (searchParams.get('oauth_token')) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #0a0e27 100%)',
        color: '#c084fc',
        fontSize: '1.2rem',
      }}>
        <div>🔄 Обработка входа через Discord...</div>
      </div>
    );
  }

  // Otherwise, show Home component (normal flow)
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

  // If not authenticated, redirect to login
  if (!user) {
    navigate('/login');
    return null;
  }

  // Otherwise show Home
  return <Home />;
};

export default OAuthCallback;
