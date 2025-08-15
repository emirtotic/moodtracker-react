// src/lib/api.ts
import axios from 'axios';

const RAW = import.meta.env.VITE_API_BASE || '';
const BASE = RAW.endsWith('/') ? RAW.slice(0, -1) : RAW;

console.log('API BASE =', BASE);

const api = axios.create({
  baseURL: "https://moodtracker-app-production.up.railway.app",
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('jwt');
      if (!location.pathname.startsWith('/login')) location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
