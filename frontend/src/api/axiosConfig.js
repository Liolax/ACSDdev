import axios from 'axios';

// Determine base URL based on environment
const baseURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000/api'
    : '/api';

console.log(`API Base URL: ${baseURL}`);

const apiClient = axios.create({
  baseURL: baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach token if available and log the request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(
      `➡️ ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
      config.data || ''
    );
    return config;
  },
  (error) => {
    console.error('❌ Axios request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor: log errors, handle 401 by logging out
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(
        `❌ [${error.response.status}] ${error.config.method.toUpperCase()} ${error.config.url}`,
        error.response.data
      );
      if (error.response.status === 401) {
        console.warn('Unauthorized request - logging out...');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        window.location.href = '/login';
      }
    } else if (error.request) {
      console.error('❌ Network error:', error.request);
    } else {
      console.error('❌ Axios error:', error.message);
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default apiClient;
