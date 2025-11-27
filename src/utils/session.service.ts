import { jwtDecode } from 'jwt-decode';
import type { DecodedToken } from '../types/auth.types';

class SessionService {
  private TOKEN_KEY = 'accessToken';
  private USER_CODE_KEY = 'userCode';
  private SESSION_ID_KEY = 'sessionId';

  storeSession(token: string): void {
    sessionStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
    // return localStorage.getItem(this.TOKEN_KEY);
  }

  storeOther(key: string, value: string): void {
    localStorage.setItem(key, value);
    sessionStorage.setItem(key, value);
  }

  getOther(key: string): string | null {
    // return localStorage.getItem(key);
    return sessionStorage.getItem(key);
  }

  decodeToken(token: string): DecodedToken | null {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  }

  clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_CODE_KEY);
    sessionStorage.removeItem(this.USER_CODE_KEY);
    localStorage.removeItem(this.SESSION_ID_KEY);
    sessionStorage.removeItem(this.SESSION_ID_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const decoded = this.decodeToken(token);
    if (!decoded) return false;

    // Check if token is expired
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  }
}

export const sessionService = new SessionService();