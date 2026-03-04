import axios from "axios";

/**
 * Axios instance for Boarding Buddy API
 * - Configured with base URL from environment
 * - Credentials enabled for HTTP-only cookies
 * - Request interceptor for token attachment
 * - Response interceptor for global error handling
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

/**
 * Request Interceptor
 * Attaches JWT token from localStorage to Authorization header
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Response Interceptor
 * Handles global error responses
 */
api.interceptors.response.use(
  (response) => {
    // Return successful response data
    return response;
  },
  (error) => {
    const { response } = error;

    // Handle specific error status codes
    if (response) {
      switch (response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          // Only redirect if not already on auth pages
          if (
            !window.location.pathname.includes("/login") &&
            !window.location.pathname.includes("/register")
          ) {
            window.location.href = "/login";
          }
          break;

        case 403:
          // Forbidden - user doesn't have permission
          console.error("Access forbidden:", response.data?.message);
          break;

        case 404:
          // Not found
          console.error("Resource not found:", response.data?.message);
          break;

        case 500:
          // Server error
          console.error("Server error:", response.data?.message);
          break;

        default:
          console.error("API Error:", response.data?.message);
      }
    } else if (error.request) {
      // Network error - no response received
      console.error("Network error - no response received");
    } else {
      // Request setup error
      console.error("Request error:", error.message);
    }

    return Promise.reject(error);
  },
);

export default api;
