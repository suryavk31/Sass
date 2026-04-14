/**
 * src/utils/axiosInstance.js
 *
 * A pre-configured axios instance that:
 *   1. Automatically attaches the Bearer token from localStorage.
 *   2. On a 401 response, attempts a silent token refresh via /api/auth/refresh.
 *   3. Retries the original request once after a successful refresh.
 *   4. On a failed refresh, clears auth state and redirects to /log-in.
 */
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/',
  withCredentials: true, // Send cookies (refreshToken httpOnly cookie)
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Attach the access token from localStorage before every request
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      
      // 1. Attach Bearer Token
      if (userInfo?.token) {
        config.headers.Authorization = `Bearer ${userInfo.token}`;
      }

      // 2. Attach Workspace Context (Standardizes RBAC across all modules)
      if (userInfo?.workspaceId) {
        config.headers['x-workspace-id'] = userInfo.workspaceId;
      }

      // 3. Global Request Sanitization
      // Detect and strip literal "undefined" or "null" strings from the URL 
      // often caused by malformed frontend state construction.
      if (config.url && (config.url.includes('workspaceId=undefined') || config.url.includes('workspaceId=null'))) {
        config.url = config.url
          .replace(/workspaceId=undefined&?/g, '')
          .replace(/&workspaceId=undefined/g, '')
          .replace(/workspaceId=null&?/g, '')
          .replace(/&workspaceId=null/g, '')
          .replace(/\?$/, ''); // Clean up trailing question marks
      }

    } catch (_) {
      // Ignore parse errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    const originalRequest = error.config;

    // If we get a 401 and haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue requests while a refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the access token using the httpOnly refreshToken cookie
        const { data } = await axios.post('/api/auth/refresh', {}, { withCredentials: true });

        // The server issues a new accessToken cookie & returns a token in the body if configured
        // Also update localStorage if the server returns a new token object
        if (data.token) {
          const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
          userInfo.token = data.token;
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          processQueue(null, data.token);
          originalRequest.headers.Authorization = `Bearer ${data.token}`;
        } else {
          // Cookie-only refresh — clear the queue and retry using cookie
          processQueue(null, null);
        }

        isRefreshing = false;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);

        // Refresh failed — clear stored auth and redirect to login
        localStorage.removeItem('userInfo');
        localStorage.removeItem('userId');
        window.location.href = '/log-in';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
