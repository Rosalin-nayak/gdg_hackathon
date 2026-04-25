// Stub for Axios Client
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
