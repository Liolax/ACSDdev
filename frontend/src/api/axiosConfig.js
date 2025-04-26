import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL,
  timeout: 5000,
  // Default header for JSON requests.
  headers: {
    'Content-Type': 'application/json'
  },
});

console.log(`Using API base URL: ${baseURL}`);

// Request Interceptor: Attach token if available
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
    return config;
  },
  (error) => {
    console.error('Error in Axios request interceptor:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor: Improved error handling
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
