import { apiService } from './api.service';
import { apiurls } from '../constants/apiConstants';
import type { LoginRequest, LoginResponse } from '../types/auth.types';

class LoginService {
  async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    const response = await apiService.post<LoginResponse>(
      apiurls.login,
      loginRequest,
    //   { headers: { skip: 'true' } }
    );
    console.log("ppppppp", response)
    return (response as any);
  }

  async changePassword(newPassword: string, confirmPassword: string): Promise<any> {
    const response = await apiService.post(apiurls.changePassword, {
      password: newPassword,
      confirmPassword: confirmPassword,
    });
    return (response as any).data;
  }

  async logout(): Promise<any> {
    const response = await apiService.post(apiurls.logout);
    return (response as any).data;
  }

  async sessionOut(userName: string): Promise<any> {
    const response = await apiService.post(
      `${apiurls.sessionOut}?username=${userName}`,
      { headers: { skip: 'true' } }
    );
    return (response as any).data;
  }
}

export const loginService = new LoginService();