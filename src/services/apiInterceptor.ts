import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';

// Types
interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  payload: T;
  timestamp?: string;
}

interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
  timestamp: string;
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get token from sessionStorage
    const token = sessionStorage.getItem('token');
    
    // If token exists, add it to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add timestamp to request
    config.headers['X-Request-Time'] = new Date().toISOString();

    // Log request in development
    if (import.meta.env.DEV) {
      console.log('📤 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        params: config.params,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log('📥 API Response:', {
        status: response.status,
        statusCode: response.data?.statusCode,
        url: response.config.url,
        data: response.data,
      });
    }

    // Check if response has expected structure
    if (response.data && typeof response.data.statusCode !== 'undefined') {
      // Handle application-level errors (statusCode !== 0)
      if (response.data.statusCode !== 0) {
        console.warn('⚠️ Application Error:', response.data);
        
        // You can handle specific error codes here
        if (response.data.statusCode === 401) {
          handleUnauthorized();
        }
      }
    }

    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Log error in development
    if (import.meta.env.DEV) {
      console.error('❌ API Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data,
      });
    }

    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const errorData = error.response.data;

      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          handleUnauthorized();
          break;
        
        case 403:
          // Forbidden - show error message
          showNotification('You do not have permission to perform this action', 'error');
          break;
        
        case 404:
          // Not found
          showNotification('The requested resource was not found', 'error');
          break;
        
        case 500:
          // Server error
          showNotification('Server error. Please try again later', 'error');
          break;
        
        case 503:
          // Service unavailable
          showNotification('Service temporarily unavailable. Please try again later', 'error');
          break;
        
        default:
          // Other errors
          showNotification(
            errorData?.message || 'An unexpected error occurred',
            'error'
          );
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('No response received:', error.request);
      showNotification('Network error. Please check your connection', 'error');
    } else {
      // Error in request setup
      console.error('Request setup error:', error.message);
      showNotification('Failed to make request', 'error');
    }

    return Promise.reject(error);
  }
);

// Helper function to handle unauthorized access
function handleUnauthorized() {
  // Clear stored data
  sessionStorage.clear();
  localStorage.clear();
  
  // Show notification
  showNotification('Session expired. Please login again', 'warning');
  
  // Redirect to login page after a short delay
  setTimeout(() => {
    window.location.href = '/login';
  }, 1500);
}

// Helper function to show notifications
// This will be replaced with your actual notification system (e.g., MUI Snackbar)
function showNotification(message: string, type: 'success' | 'error' | 'warning' | 'info') {
  // Dispatch custom event that can be caught by a notification component
  window.dispatchEvent(new CustomEvent('showNotification', {
    detail: { message, type }
  }));
  
  // Fallback to console in development
  if (import.meta.env.DEV) {
    console.log(`[${type.toUpperCase()}]:`, message);
  }
}

// Export configured axios instance
export default apiClient;

// Export types
export type { ApiResponse, ApiError };