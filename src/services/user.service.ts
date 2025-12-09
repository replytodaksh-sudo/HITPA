import { apiService } from './api.service';
import { apiUrls } from '../constants/apiConstants';

class UserService {
  async forgotPassword(username: string): Promise<any> {
    const response = await apiService.post(
      `${apiUrls.forgotPassword}?username=${username}`
    );
    return response as any;
  }

  async verifyPassword(username: string): Promise<any> {
    const response = await apiService.post(
      `${apiUrls.verifyPassword}?username=${username}`
    );
    return response as any;
  }

  async resetPassword(username: string, newPassword: string): Promise<any> {
    const response = await apiService.post(
      `${apiUrls.resetPassword}?username=${username}&newPassword=${newPassword}`
    );
    return response as any;
  }

  async getAllUsers(): Promise<any> {
    const response = await apiService.get(
      "/user/getAllUsers"
    );
    return response as any;
  }

  async getUserByCode(userCode: string): Promise<any> {
    const response = await apiService.get(
      `/user/getUserByCode?userCodeFromUI=${userCode}`
    );
    return response as any;
  }
  
  async addUser(data: any): Promise<any> {
    const response = await apiService.post('/user/addUser', data);
    return response as any;
  }

  async editUser(data: any): Promise<any> {
    const response = await apiService.put('/user/editUser', data);
    return response as any;
  }
  
  async deleteUser(userCode: string): Promise<any> {
    const response = await apiService.delete(`/users/${userCode}`);
    return response as any;
  }
  
  // async verifyPassword(userName: string): Promise<any> {
  //   const response = await apiService.post('/users/verify-password', { userName });
  //   return response as any;
  // }
  
  // async resetPassword(username: string, newPassword: string): Promise<any> {
  //   const response = await apiService.post('/users/reset-password', { username, newPassword });
  //   return response as any;
  // }

  // getAllUsers: () => apiService.get('/users/all'),
  // getUserByCode: (userCode: string) => apiService.get(`/users/${userCode}`),
  // addUser: (data: any) => apiService.post('/users/add', data),
  // editUser: (data: any) => apiService.put('/users/update', data),
  // deleteUser: (userCode: string) => apiService.delete(`/users/${userCode}`),

      // verifyPassword: (username: string) =>
      //   apiService.post('/users/verify-password', { username }),
        // resetPassword: (username: string, newPassword: string) =>
        //   apiService.post('/users/reset-password', { username, newPassword }),
}

export const userService = new UserService();