import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api', // With "proxy": "http://localhost:5000" in package.json, this routes API calls to backend.
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // Ensure credentials (cookies, etc.) are sent along with requests.
});

// Request interceptor to attach token (if any)
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      // Retrieve the token from localStorage; if not available, use a dummy token.
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

// Response interceptor to handle errors globally.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('Response error:', error.response.data);
      if (error.response.status === 401) {
        console.warn('Unauthorized access - consider redirecting to login.');
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
