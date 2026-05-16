import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request Interceptor: Automatically inject JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('erp_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle errors globally (e.g., token expiry)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.error("Authentication Error - Logging out.");
            // Clear local storage and redirect to login
            localStorage.removeItem('erp_token');
            localStorage.removeItem('erp_role');
            localStorage.removeItem('erp_email');
            localStorage.removeItem('erp_name');
            window.location.href = "/"; // Redirect to root/login
        }
        return Promise.reject(error);
    }
);

export default api;
