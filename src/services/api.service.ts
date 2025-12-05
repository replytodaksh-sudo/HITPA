// import apiClient from './apiInterceptor';
// import type { ApiResponse } from './apiInterceptor';
// import type { AxiosRequestConfig } from 'axios';

// /**
//  * Generic API Service
//  * All API calls should go through this service
//  */
// class apiService {
//   /**
//    * GET request
//    */
//   async get<T = any>(
//     endpoint: string,
//     params?: Record<string, any>,
//     config?: AxiosRequestConfig
//   ): Promise<ApiResponse<T>> {
//     const response = await apiClient.get<ApiResponse<T>>(endpoint, {
//       params,
//       ...config,
//     });
//     return response.data;
//   }

//   /**
//    * POST request
//    */
//   async post<T = any>(
//     endpoint: string,
//     data?: any,
//     config?: AxiosRequestConfig
//   ): Promise<ApiResponse<T>> {
//     const response = await apiClient.post<ApiResponse<T>>(endpoint, data, config);
//     return response.data;
//   }

//   /**
//    * PUT request
//    */
//   async put<T = any>(
//     endpoint: string,
//     data?: any,
//     config?: AxiosRequestConfig
//   ): Promise<ApiResponse<T>> {
//     const response = await apiClient.put<ApiResponse<T>>(endpoint, data, config);
//     return response.data;
//   }

//   /**
//    * PATCH request
//    */
//   async patch<T = any>(
//     endpoint: string,
//     data?: any,
//     config?: AxiosRequestConfig
//   ): Promise<ApiResponse<T>> {
//     const response = await apiClient.patch<ApiResponse<T>>(endpoint, data, config);
//     return response.data;
//   }

//   /**
//    * DELETE request
//    */
//   async delete<T = any>(
//     endpoint: string,
//     config?: AxiosRequestConfig
//   ): Promise<ApiResponse<T>> {
//     const response = await apiClient.delete<ApiResponse<T>>(endpoint, config);
//     return response.data;
//   }

//   /**
//    * Upload file (multipart/form-data)
//    */
//   async uploadFile<T = any>(
//     endpoint: string,
//     file: File,
//     additionalData?: Record<string, any>,
//     onUploadProgress?: (progressEvent: any) => void
//   ): Promise<ApiResponse<T>> {
//     const formData = new FormData();
//     formData.append('file', file);

//     // Append additional data if provided
//     if (additionalData) {
//       Object.keys(additionalData).forEach((key) => {
//         formData.append(key, additionalData[key]);
//       });
//     }

//     const response = await apiClient.post<ApiResponse<T>>(endpoint, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//       onUploadProgress,
//     });

//     return response.data;
//   }

//   /**
//    * Download file
//    */
//   async downloadFile(
//     endpoint: string,
//     filename: string,
//     params?: Record<string, any>
//   ): Promise<void> {
//     const response = await apiClient.get(endpoint, {
//       params,
//       responseType: 'blob',
//     });

//     // Create blob link to download
//     const url = window.URL.createObjectURL(new Blob([response.data]));
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', filename);
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//     window.URL.revokeObjectURL(url);
//   }

//   /**
//    * Batch requests (execute multiple requests in parallel)
//    */
//   async batch<T = any>(
//     requests: Array<() => Promise<ApiResponse<any>>>
//   ): Promise<ApiResponse<T>[]> {
//     return Promise.all(requests.map((request) => request()));
//   }
// }

// // Export singleton instance
// export const apiService = new apiService();

// // Export class for testing or custom instances
// export default apiService;



import keycloak from '../keycloak.config';

const API_BASE_URL = import.meta.env.REACT_APP_API_BASE_URL;

/**
 * Standard API Response Interface
 */
export interface ApiResponse<T = any> {
  statusCode: number;
  payload: T;
  message?: string;
  error?: string;
}

/**
 * Generic API Service
 * All API calls should go through this service
 * Automatically handles Keycloak token management
 */
class ApiServiceClass {
  /**
   * Get Authorization header with Keycloak token
   */
  private getAuthHeaders(): HeadersInit {
    const token = keycloak.token;
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  /**
   * Handle token refresh if needed
   */
  private async ensureValidToken(): Promise<void> {
    try {
      // Refresh token if it expires in less than 30 seconds
      await keycloak.updateToken(30);

      // Update token in sessionStorage for backward compatibility
      if (keycloak.token) {
        sessionStorage.setItem('token', keycloak.token);
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
      // Redirect to login if refresh fails
      keycloak.login();
    }
  }

  /**
   * Build full URL with query parameters
   */
  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(`${API_BASE_URL}${endpoint}`);

    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, params[key]);
        }
      });
    }

    return url.toString();
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): never {
    if (error.status === 401) {
      // Unauthorized - redirect to login
      keycloak.login();
    }
    throw error;
  }

  /**
   * GET request
   */
  async get<T = any>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    await this.ensureValidToken();

    try {
      const url = this.buildUrl(endpoint, params);
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        this.handleError({ status: response.status, message: response.statusText });
      }

      return response.json();
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * POST request
   */
  async post<T = any>(
    endpoint: string,
    data?: any,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    await this.ensureValidToken();

    try {
      const url = this.buildUrl(endpoint, params);
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        this.handleError({ status: response.status, message: response.statusText });
      }

      return response.json();
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * PUT request
   */
  async put<T = any>(
    endpoint: string,
    data?: any,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    await this.ensureValidToken();

    try {
      const url = this.buildUrl(endpoint, params);
      const response = await fetch(url, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        this.handleError({ status: response.status, message: response.statusText });
      }

      return response.json();
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * PATCH request
   */
  async patch<T = any>(
    endpoint: string,
    data?: any,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    await this.ensureValidToken();

    try {
      const url = this.buildUrl(endpoint, params);
      const response = await fetch(url, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        this.handleError({ status: response.status, message: response.statusText });
      }

      return response.json();
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * DELETE request
   */
  async delete<T = any>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    await this.ensureValidToken();

    try {
      const url = this.buildUrl(endpoint, params);
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        this.handleError({ status: response.status, message: response.statusText });
      }

      return response.json();
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Upload file (multipart/form-data)
   */
  async uploadFile<T = any>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>,
    onUploadProgress?: (progressEvent: ProgressEvent) => void
  ): Promise<ApiResponse<T>> {
    await this.ensureValidToken();

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Append additional data if provided
      if (additionalData) {
        Object.keys(additionalData).forEach((key) => {
          formData.append(key, additionalData[key]);
        });
      }

      const token = keycloak.token;
      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      // Don't set Content-Type for FormData - browser will set it with boundary

      const xhr = new XMLHttpRequest();

      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (onUploadProgress) {
            onUploadProgress(e);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject({ status: xhr.status, message: xhr.statusText });
          }
        });

        xhr.addEventListener('error', () => {
          reject({ status: xhr.status, message: 'Upload failed' });
        });

        xhr.open('POST', `${API_BASE_URL}${endpoint}`);

        // Set headers
        Object.keys(headers).forEach(key => {
          xhr.setRequestHeader(key, headers[key] as string);
        });

        xhr.send(formData);
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Upload multiple files
   */
  async uploadFiles<T = any>(
    endpoint: string,
    files: File[],
    additionalData?: Record<string, any>,
    onUploadProgress?: (progressEvent: ProgressEvent) => void
  ): Promise<ApiResponse<T>> {
    await this.ensureValidToken();

    try {
      const formData = new FormData();

      // Append all files
      files.forEach((file, index) => {
        formData.append(`file${index}`, file);
      });

      // Append additional data if provided
      if (additionalData) {
        Object.keys(additionalData).forEach((key) => {
          formData.append(key, additionalData[key]);
        });
      }

      const token = keycloak.token;
      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const xhr = new XMLHttpRequest();

      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (onUploadProgress) {
            onUploadProgress(e);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject({ status: xhr.status, message: xhr.statusText });
          }
        });

        xhr.addEventListener('error', () => {
          reject({ status: xhr.status, message: 'Upload failed' });
        });

        xhr.open('POST', `${API_BASE_URL}${endpoint}`);

        // Set headers
        Object.keys(headers).forEach(key => {
          xhr.setRequestHeader(key, headers[key] as string);
        });

        xhr.send(formData);
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Download file
   */
  async downloadFile(
    endpoint: string,
    filename: string,
    params?: Record<string, any>
  ): Promise<void> {
    await this.ensureValidToken();

    try {
      const url = this.buildUrl(endpoint, params);
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        this.handleError({ status: response.status, message: response.statusText });
      }

      const blob = await response.blob();

      // Create blob link to download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Batch requests (execute multiple requests in parallel)
   */
  async batch<T = any>(
    requests: Array<() => Promise<ApiResponse<any>>>
  ): Promise<ApiResponse<T>[]> {
    return Promise.all(requests.map((request) => request()));
  }

  /**
   * GET request with raw response (useful for non-JSON responses)
   */
  async getRaw(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<Response> {
    await this.ensureValidToken();

    const url = this.buildUrl(endpoint, params);
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      this.handleError({ status: response.status, message: response.statusText });
    }

    return response;
  }

  /**
   * POST request with raw response
   */
  async postRaw(
    endpoint: string,
    data?: any,
    params?: Record<string, any>
  ): Promise<Response> {
    await this.ensureValidToken();

    const url = this.buildUrl(endpoint, params);
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      this.handleError({ status: response.status, message: response.statusText });
    }

    return response;
  }
}

// Export singleton instance (lowercase for backward compatibility)
export const apiService = new ApiServiceClass();

// Export class (uppercase for new code)
export const ApiService = new ApiServiceClass();

// Default export
export default apiService;