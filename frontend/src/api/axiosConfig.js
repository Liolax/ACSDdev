import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL, // <-- Note the /api here!
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

console.log(`API Base URL: ${API_BASE_URL}`);

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
