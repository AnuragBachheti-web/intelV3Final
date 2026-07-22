import axios from 'axios';

/**
 *  API Client
 * Centralized configuration for all network requests.
 */

const backendUrl = (import.meta.env.VITE_BACKEND_URL || "http://localhost:8000").replace(/\/+$/, "");

const apiClient = axios.create({
  baseURL: `${backendUrl}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
    'Bypass-Tunnel-Reminder': 'true'
  },
});

// Request interceptor (e.g., for adding Auth tokens)
apiClient.interceptors.request.use(
  (config) => {
    const shop = localStorage.getItem('active_shop');
    const platform = localStorage.getItem('active_platform') || 'shopify';

    // Auto-append shop and platform to params if not present
    if (shop) {
      config.params = {
        shop,
        platform,
        ...config.params,
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (e.g., for global error handling)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error logging
    console.error(`[API Error] ${error.response?.status}: ${error.message}`);

    if (error.response?.status === 401) {
      // Handle unauthorized (e.g., redirect to login)
    }

    return Promise.reject(error);
  }
);

export default apiClient;
