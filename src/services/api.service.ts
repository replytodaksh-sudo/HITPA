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

export interface ApiResponse<T = any> {
  statusCode: number;
  payload: T;
  message?: string;
}

export class apiService {
  /**
   * Get Authorization header with Keycloak token
   */
  private static getAuthHeaders(): HeadersInit {
    const token = keycloak.token;
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  /**
   * Handle token refresh if needed
   */
  private static async ensureValidToken(): Promise<void> {
    try {
      // Refresh token if it expires in less than 30 seconds
      await keycloak.updateToken(30);
      
      // Update token in sessionStorage
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
   * Generic GET request
   */
  static async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    await this.ensureValidToken();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (response.status === 401) {
      // Unauthorized - token might be invalid
      keycloak.login();
      throw new Error('Unauthorized');
    }

    return response.json();
  }

  /**
   * Generic POST request
   */
  static async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    await this.ensureValidToken();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (response.status === 401) {
      keycloak.login();
      throw new Error('Unauthorized');
    }

    return response.json();
  }

  /**
   * Generic PUT request
   */
  static async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    await this.ensureValidToken();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (response.status === 401) {
      keycloak.login();
      throw new Error('Unauthorized');
    }

    return response.json();
  }

  /**
   * Generic DELETE request
   */
  static async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    await this.ensureValidToken();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (response.status === 401) {
      keycloak.login();
      throw new Error('Unauthorized');
    }

    return response.json();
  }

  /**
   * File upload with multipart/form-data
   */
  static async uploadFile<T = any>(
    endpoint: string,
    formData: FormData
  ): Promise<ApiResponse<T>> {
    await this.ensureValidToken();
    
    const token = keycloak.token;
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (response.status === 401) {
      keycloak.login();
      throw new Error('Unauthorized');
    }

    return response.json();
  }
}

export default apiService;