import axios from 'axios';

// Determine base URL based on environment
const baseURL =
    process.env.NODE_ENV === 'development'
        ? 'http://localhost:5000/api'
        : '/api'; // Assuming '/api' is proxied to your backend in production

console.log(`API Base URL: ${baseURL}`);

const apiClient = axios.create({
    baseURL: baseURL,
    headers: { 'Content-Type': 'application/json' },
    // Uncomment withCredentials if needed:
    // withCredentials: true, // Needed if sending cookies/auth headers cross-origin
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // Log outgoing request details
        console.log(`➡️ ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.data || '');
        return config;
    },
    (error) => {
        console.error("❌ Axios request error:", error);
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Log response error details
            console.error(`❌ [${error.response.status}] ${error.config.method.toUpperCase()} ${error.config.url}`, error.response.data);
            if (error.response.status === 401) {
                console.warn("Unauthorized request - logging out...");
                // Handle unauthorized access, e.g., clear auth tokens and redirect
                localStorage.removeItem('authToken');
                localStorage.removeItem('userRole');
                // Redirect to login page (adjust path as needed for your routing)
                window.location.href = '/login';
            }
        } else if (error.request) {
            // Log network errors (request was made but no response received)
            console.error('❌ Network error:', error.request);
        } else {
            // Log other Axios errors
            console.error('❌ Axios error:', error.message);
        }
        // Reject the promise with the error response data or the error object
        return Promise.reject(error.response?.data || error);
    }
);

export default apiClient;
