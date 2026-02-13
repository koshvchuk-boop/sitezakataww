import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken') || localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for OAuth token in URL
    const urlParams = new URLSearchParams(window.location.search);
    const oauthToken = urlParams.get('oauth_token');
    
    if (oauthToken) {
      console.log('🔐 OAuth token found in URL:', oauthToken.substring(0, 20) + '...');
      localStorage.setItem('authToken', oauthToken);
      setToken(oauthToken);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (token) {
      console.log('👤 Token found, fetching user...');
      fetchUser();
    } else {
      console.log('❌ No token, skipping user fetch');
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await authAPI.getMe();
      console.log('✅ User fetched:', response.data.username);
      setUser(response.data);
    } catch (error) {
      console.error('❌ Failed to fetch user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    const { token, user } = response.data;
    localStorage.setItem('authToken', token);
    setToken(token);
    setUser(user);
    return user;
  };

  const register = async (username, email, password) => {
    const response = await authAPI.register({ username, email, password });
    const { token, user } = response.data;
    localStorage.setItem('authToken', token);
    setToken(token);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
