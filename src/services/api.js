import axios from 'axios';
import { TMDB_BASE_URL } from '../utils/constants';

export const STORAGE_API_KEY = 'cinevault_tmdb_api_key';

export const getApiKey = () => {
  const localKey = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_API_KEY) : null;
  if (localKey && localKey.trim() && localKey.trim() !== 'your_tmdb_api_key_here') {
    return localKey.trim();
  }

  const envKey = import.meta.env.VITE_TMDB_API_KEY;
  if (envKey && envKey.trim() && envKey.trim() !== 'your_tmdb_api_key_here') {
    return envKey.trim();
  }

  return '';
};

export const isApiKeyConfigured = () => {
  return Boolean(getApiKey());
};

export const setCustomApiKey = (key) => {
  if (!key || !key.trim()) {
    localStorage.removeItem(STORAGE_API_KEY);
  } else {
    localStorage.setItem(STORAGE_API_KEY, key.trim());
  }
};

const apiClient = axios.create({
  baseURL: TMDB_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const key = getApiKey();
    if (!key) {
      return Promise.reject(new Error('MISSING_API_KEY'));
    }

    if (key.startsWith('eyJ')) {
      config.headers.Authorization = `Bearer ${key}`;
    } else {
      config.params = {
        api_key: key,
        ...config.params,
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.message === 'MISSING_API_KEY') {
      return Promise.reject(new Error('TMDB API key is not configured.'));
    }

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (status === 401) {
        return Promise.reject(
          new Error('Invalid TMDB API key (401 Unauthorized).')
        );
      }
      return Promise.reject(
        new Error(data?.status_message || `TMDB API error ${status}`)
      );
    }

    return Promise.reject(
      new Error(error.message || 'Network error: Unable to reach TMDB API.')
    );
  }
);

export default apiClient;
