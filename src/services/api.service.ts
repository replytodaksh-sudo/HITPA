import apiClient from './apiInterceptor';
import type { ApiResponse } from './apiInterceptor';
import type { AxiosRequestConfig } from 'axios';
import keycloak from '../keycloak.config';

/**
 * Unified API Service with Non-Blocking Token Refresh
 */
class ApiServiceClass {
  /**
   * Ensure Keycloak token is valid (NON-BLOCKING)
   * If token refresh fails, request will proceed anyway
   */
  private async ensureValidToken(): Promise<void> {
    try {
      // Skip if Keycloak is not initialized or authenticated
      if (!keycloak || !keycloak.authenticated) {
        console.log('ℹ️ Keycloak not authenticated, proceeding without refresh');
        return;
      }

      // Try to refresh token if it expires in less than 30 seconds
      const refreshed = await keycloak.updateToken(30);
      
      if (refreshed) {
        console.log('✅ Keycloak token refreshed');
        
        // Update token in sessionStorage for axios interceptor
        if (keycloak.token) {
          sessionStorage.setItem('accessToken', keycloak.token);
        }
      } else {
        console.log('ℹ️ Token still valid, no refresh needed');
      }
    } catch (error) {
      // Log error but DON'T throw - let request proceed
      console.warn('⚠️ Token refresh failed, proceeding anyway:', error);
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): never {
    console.error('🔴 API Service Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    
    // Only redirect to Keycloak login if authenticated and 401
    if (error.response?.status === 401 && keycloak?.authenticated) {
      console.log('🔐 Redirecting to Keycloak login...');
      keycloak.login();
    }
    
    throw error;
  }

  /**
   * GET request
   */
  async get<T = any>(
    endpoint: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    
    // Non-blocking token refresh
    await this.ensureValidToken().catch(err => {
      console.warn('Token refresh failed, continuing:', err);
    });
    console.log('📤 GET Request:', endpoint, params, this.ensureValidToken());

    try {
      const response = await apiClient.get<ApiResponse<T>>(endpoint, {
        params,
        ...config,
      });
      console.log('📥 GET Response:', endpoint, response.data);
      return response.data;
    } catch (error) {
      console.error('❌ GET Error:', endpoint, error);
      return this.handleError(error);
    }
  }

  /**
   * POST request
   */
  async post<T = any>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    console.log('📤 POST Request:', endpoint, data);
    
    // Non-blocking token refresh
    await this.ensureValidToken().catch(err => {
      console.warn('Token refresh failed, continuing:', err);
    });

    try {
      const response = await apiClient.post<ApiResponse<T>>(endpoint, data, config);
      console.log('📥 POST Response:', endpoint, response.data);
      return response.data;
    } catch (error) {
      console.error('❌ POST Error:', endpoint, error);
      return this.handleError(error);
    }
  }

  /**
   * PUT request
   */
  async put<T = any>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    console.log('📤 PUT Request:', endpoint, data);
    
    await this.ensureValidToken().catch(err => {
      console.warn('Token refresh failed, continuing:', err);
    });

    try {
      const response = await apiClient.put<ApiResponse<T>>(endpoint, data, config);
      console.log('📥 PUT Response:', endpoint, response.data);
      return response.data;
    } catch (error) {
      console.error('❌ PUT Error:', endpoint, error);
      return this.handleError(error);
    }
  }

  /**
   * PATCH request
   */
  async patch<T = any>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    console.log('📤 PATCH Request:', endpoint, data);
    
    await this.ensureValidToken().catch(err => {
      console.warn('Token refresh failed, continuing:', err);
    });

    try {
      const response = await apiClient.patch<ApiResponse<T>>(endpoint, data, config);
      console.log('📥 PATCH Response:', endpoint, response.data);
      return response.data;
    } catch (error) {
      console.error('❌ PATCH Error:', endpoint, error);
      return this.handleError(error);
    }
  }

  /**
   * DELETE request
   */
  async delete<T = any>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    console.log('📤 DELETE Request:', endpoint);
    
    await this.ensureValidToken().catch(err => {
      console.warn('Token refresh failed, continuing:', err);
    });

    try {
      const response = await apiClient.delete<ApiResponse<T>>(endpoint, config);
      console.log('📥 DELETE Response:', endpoint, response.data);
      return response.data;
    } catch (error) {
      console.error('❌ DELETE Error:', endpoint, error);
      return this.handleError(error);
    }
  }

  /**
   * Upload single file (multipart/form-data)
   */
  async uploadFile<T = any>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<ApiResponse<T>> {
    console.log('📤 Upload File:', endpoint, file.name);
    
    await this.ensureValidToken().catch(err => {
      console.warn('Token refresh failed, continuing:', err);
    });

    try {
      const formData = new FormData();
      formData.append('files', file);

      if (additionalData) {
        Object.keys(additionalData).forEach((key) => {
          formData.append(key, additionalData[key]);
        });
      }

      const response = await apiClient.post<ApiResponse<T>>(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
      });

      console.log('📥 Upload Response:', endpoint, response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Upload Error:', endpoint, error);
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
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<ApiResponse<T>> {
    console.log('📤 Upload Files:', endpoint, files.length, 'files');
    
    await this.ensureValidToken().catch(err => {
      console.warn('Token refresh failed, continuing:', err);
    });

    try {
      const formData = new FormData();

      files.forEach((file, index) => {
        formData.append(`file${index}`, file);
      });

      if (additionalData) {
        Object.keys(additionalData).forEach((key) => {
          formData.append(key, additionalData[key]);
        });
      }

      const response = await apiClient.post<ApiResponse<T>>(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
      });

      console.log('📥 Upload Response:', endpoint, response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Upload Error:', endpoint, error);
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
    console.log('📤 Download File:', endpoint, filename);
    
    await this.ensureValidToken().catch(err => {
      console.warn('Token refresh failed, continuing:', err);
    });

    try {
      const response = await apiClient.get(endpoint, {
        params,
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      console.log('✅ File downloaded:', filename);
    } catch (error) {
      console.error('❌ Download Error:', endpoint, error);
      this.handleError(error);
    }
  }

  /**
   * Batch requests (execute multiple requests in parallel)
   */
  async batch<T = any>(
    requests: Array<() => Promise<ApiResponse<any>>>
  ): Promise<ApiResponse<T>[]> {
    console.log('📤 Batch Request:', requests.length, 'requests');
    return Promise.all(requests.map((request) => request()));
  }

  /**
   * GET request with raw Axios response
   */
  async getRaw(
    endpoint: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<any> {
    console.log('📤 GET Raw:', endpoint);
    
    await this.ensureValidToken().catch(err => {
      console.warn('Token refresh failed, continuing:', err);
    });

    try {
      const response = await apiClient.get(endpoint, {
        params,
        ...config,
      });
      console.log('📥 GET Raw Response:', endpoint);
      return response;
    } catch (error) {
      console.error('❌ GET Raw Error:', endpoint, error);
      return this.handleError(error);
    }
  }

  /**
   * POST request with raw Axios response
   */
  async postRaw(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<any> {
    console.log('📤 POST Raw:', endpoint);
    
    await this.ensureValidToken().catch(err => {
      console.warn('Token refresh failed, continuing:', err);
    });

    try {
      const response = await apiClient.post(endpoint, data, config);
      console.log('📥 POST Raw Response:', endpoint);
      return response;
    } catch (error) {
      console.error('❌ POST Raw Error:', endpoint, error);
      return this.handleError(error);
    }
  }
}

// Export singleton instance
export const apiService = new ApiServiceClass();

// Export class
export const ApiService = ApiServiceClass;

// Default export
export default apiService;