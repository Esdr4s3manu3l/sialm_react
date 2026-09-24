import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8001/api', // No servidor altere para http://201.71.217.142:8001/api ou /api
});