import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken') || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
};

export const questionsAPI = {
  getAll: () => API.get('/questions'),
  getOne: (id) => API.get(`/questions/${id}`),
  create: (data) => API.post('/questions', data),
  update: (id, data) => API.put(`/questions/${id}`, data),
  delete: (id) => API.delete(`/questions/${id}`),
  reorder: (id, direction) => API.patch(`/questions/reorder/${id}`, { direction }),
};

export const answersAPI = {
  submit: (data) => API.post('/answers', data),
  getMyAnswers: () => API.get('/answers/user/my-answers'),
  getAnswer: (questionId) => API.get(`/answers/question/${questionId}`),
};

export const newsAPI = {
  getAll: () => API.get('/news'),
  getOne: (id) => API.get(`/news/${id}`),
  create: (data) => API.post('/news', data),
  update: (id, data) => API.patch(`/news/${id}`, data),
  delete: (id) => API.delete(`/news/${id}`),
};

export default API;
