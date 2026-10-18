import axios from 'axios';

const OPEN_LIBRARY_BASE = import.meta.env.VITE_OPEN_LIBRARY_API_BASE || 'https://openlibrary.org';

export const apiClient = axios.create({
  baseURL: OPEN_LIBRARY_BASE,
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API request error:', error?.message || error);
    return Promise.reject(error);
  }
);
