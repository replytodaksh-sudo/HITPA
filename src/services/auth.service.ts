import { sessionService } from '../utils/session.service';
import { apiService } from './api.service';

// Types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
  isFlagStatus?: number;
}

export interface User {
  userCode: string;
  username: string;
  email: string;
  name: string;
  roleName: string;
  permissions?: string[];
}

export interface ChangePasswordRequest {
  newPassword: string;
  confirmPassword: string;
  oldPassword?: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface Menu {
  menuCode: string;
  menuName: string;
  menuUrl: string;
  menuIcon?: string;
  subMenus?: Menu[];
}

/**
 * Authentication Service
 * Handles all auth-related API calls
 */
class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials) {
    const response = await apiService.post<LoginResponse>('/auth/login', credentials);

    // Store token and user data on successful login
    if (response.statusCode === 0 && response.payload.accessToken) {
      this.setSession(response.payload);
    }

    return response;
  }

  /**
   * Logout user
   */
  async logout() {
    sessionService.clearSession();
    window.location.href = '/login';
  }

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordRequest) {
    return apiService.post('/auth/change-password', data);
  }

  /**
   * Reset password (forgot password)
   */
  async resetPassword(data: ResetPasswordRequest) {
    return apiService.post('/auth/reset-password', data);
  }

  /**
   * Verify token
   */
  async verifyToken() {
    return apiService.get('/auth/verify');
  }

  /**
   * Refresh token
   */
  async refreshToken(refreshToken: string) {
    const response = await apiService.post<LoginResponse>('/auth/refresh', {
      refreshToken,
    });

    if (response.statusCode === 0 && response.payload.accessToken) {
      this.setSession(response.payload);
    }

    return response;
  }

  /**
   * Get current user profile
   */
  async getCurrentUser() {
    return apiService.get<User>('/auth/profile');
  }

  /**
   * Get user menu/permissions
   */
  async getUserMenu() {
    console.log("getUserMenu called")
    return apiService.get<{
      roleName: string;
      accessedItem: Menu[];
    }>('/accessRight/accessRightsMenu');
  }

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<User>) {
    return apiService.put<User>('/auth/profile', data);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const decoded = sessionService.decodeToken(token);
    if (!decoded) return false;

    // Check if token is expired
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }

  /**
   * Get stored user
   */
  getUser(): User | null {
    const userStr = sessionStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Get user role
   */
  getUserRole(): string | null {
    return sessionStorage.getItem('roleName');
  }

  /**
   * Set session data
   */
  private setSession(data: LoginResponse) {
    if (data.accessToken) {
      sessionStorage.setItem('accessToken', data.accessToken);
    }

    if (data.refreshToken) {
      sessionStorage.setItem('refreshToken', data.refreshToken);
    }
// console.log("234567890", data)
    if (data.user) {
      sessionStorage.setItem('user', JSON.stringify(data.user));
      sessionStorage.setItem('roleName', data.user.roleName);
      sessionStorage.setItem('userName', data.user.name);
    }
  }

  /**
   * Clear session data
   */
  private clearSession() {
    sessionStorage.clear();
    localStorage.clear();
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(permission: string): boolean {
    const user = this.getUser();
    return user?.permissions?.includes(permission) ?? false;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const userRole = this.getUserRole();
    return userRole === role;
  }

}

// Export singleton instance
export const authService = new AuthService();

// Export class
export default AuthService;