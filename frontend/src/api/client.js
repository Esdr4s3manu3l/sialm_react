import axios from 'axios';

export const api = axios.create({
  baseURL: '/api', // Crucial para produção via Nginx (sem porta :8001 explícita)
});