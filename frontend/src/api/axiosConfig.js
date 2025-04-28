import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api', // This forwards to our backend.
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Request interceptor: attach a token (or a dummy token) to every request.
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      // Pull token from localStorage.
      const token = localStorage.getItem('token') || 'dummy_token';
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
    return config;
  },
  (error) => {
    console.error('Axios request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor: handle errors globally.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('Response error:', error.response.data);
      if (error.response.status === 401) {
        console.warn('Unauthorized access - consider redirecting to login page.');
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Axios error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
