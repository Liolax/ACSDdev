import axios from 'axios';

// Create an Axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api', // Allows dynamic API URL via environment variable
  timeout: 5000, // Set a timeout for requests
  headers: { 
    'Content-Type': 'application/json',
  },
});

// Interceptor to include the JWT token dynamically if available
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token'); // Retrieve token from storage or state
      if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Attach Authorization header
      }
      return config;
    } catch (error) {
      console.error('Error retrieving token:', error);
      return config; // Continue without token in case of an error
    }
  },
  (error) => {
    console.error('Error in Axios request interceptor:', error);
    return Promise.reject(error); // Reject request with error
  }
);

axiosInstance.interceptors.response.use(
  (response) => response, // Return response data if successful
  (error) => {
    // Handle specific errors (e.g., 401 Unauthorized)
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized access - consider redirecting to login page');
      // Example: window.location.href = '/login';
    }
    return Promise.reject(error); // Pass error to calling function for handling
  }
);

export default axiosInstance;
