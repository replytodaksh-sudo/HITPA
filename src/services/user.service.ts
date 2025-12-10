// import { apiService } from './api.service';
// import { apiUrls } from '../constants/apiConstants';

// class UserService {
//   async forgotPassword(username: string): Promise<any> {
//     const response = await apiService.post(
//       `${apiUrls.forgotPassword}?username=${username}`
//     );
//     return response as any;
//   }

//   async verifyPassword(username: string): Promise<any> {
//     const response = await apiService.post(
//       `${apiUrls.verifyPassword}?username=${username}`
//     );
//     return response as any;
//   }

//   async resetPassword(username: string, newPassword: string): Promise<any> {
//     const response = await apiService.post(
//       `${apiUrls.resetPassword}?username=${username}&newPassword=${newPassword}`
//     );
//     return response as any;
//   }

//   async getAllUsers(): Promise<any> {
//     const response = await apiService.get(
//       "/user/getAllUsers"
//     );
//     return response as any;
//   }

//   async getUserByCode(userCode: string): Promise<any> {
//     const response = await apiService.get(
//       `/user/getUserByCode?userCodeFromUI=${userCode}`
//     );
//     return response as any;
//   }
  
//   async addUser(data: any): Promise<any> {
//     const response = await apiService.post('/user/addUser', data);
//     return response as any;
//   }

//   async editUser(data: any): Promise<any> {
//     const response = await apiService.put('/user/editUser', data);
//     return response as any;
//   }
  
//   async deleteUser(userCode: string): Promise<any> {
//     const response = await apiService.delete(`/users/${userCode}`);
//     return response as any;
//   }
  
//   // async verifyPassword(userName: string): Promise<any> {
//   //   const response = await apiService.post('/users/verify-password', { userName });
//   //   return response as any;
//   // }
  
//   // async resetPassword(username: string, newPassword: string): Promise<any> {
//   //   const response = await apiService.post('/users/reset-password', { username, newPassword });
//   //   return response as any;
//   // }

//   // getAllUsers: () => apiService.get('/users/all'),
//   // getUserByCode: (userCode: string) => apiService.get(`/users/${userCode}`),
//   // addUser: (data: any) => apiService.post('/users/add', data),
//   // editUser: (data: any) => apiService.put('/users/update', data),
//   // deleteUser: (userCode: string) => apiService.delete(`/users/${userCode}`),

//       // verifyPassword: (username: string) =>
//       //   apiService.post('/users/verify-password', { username }),
//         // resetPassword: (username: string, newPassword: string) =>
//         //   apiService.post('/users/reset-password', { username, newPassword }),
// }

// export const userService = new UserService();

// File: src/services/userService.ts
import { apiService } from './api.service';
import { apiUrls } from '../constants/apiConstants';

// ==================== INTERFACES ====================
export interface User {
  userId?: string;
  userName?: string;
  userCode?: string;
  email?: string;
  phone?: string;
  password?: string;
  role?: string;
  roleId?: string;
  roleName?: string;
  agencyCode?: string;
  agencyName?: string;
  isActive?: boolean;
  createdBy?: string;
  createdDate?: string;
  modifiedBy?: string;
  modifiedDate?: string;
  [key: string]: any;
}

export interface UserResponse {
  statusCode: number;
  message?: string;
  payload?: any;
}

// ==================== SERVICE ====================
export const userService = {
  /**
   * Add new user
   * @param userModel - User details
   * @returns Promise with API response
   */
  addUser: async (userModel: User): Promise<UserResponse> => {
    try {
      const response = await apiService.post(apiUrls.addUser, userModel);
      return response;
    } catch (error) {
      console.error('Error in addUser:', error);
      throw error;
    }
  },

  /**
   * Edit existing user
   * @param userModel - Updated user details
   * @returns Promise with API response
   */
  editUser: async (userModel: User): Promise<UserResponse> => {
    try {
      const response = await apiService.post(apiUrls.editUser, userModel);
      return response;
    } catch (error) {
      console.error('Error in editUser:', error);
      throw error;
    }
  },

  /**
   * Get all users
   * @returns Promise with array of users
   */
  getAllUsers: async (): Promise<UserResponse> => {
    try {
      const response = await apiService.get(apiUrls.allUsers);
      return response;
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      throw error;
    }
  },

  /**
   * Get user by user code
   * @param id - User code or ID
   * @returns Promise with user details
   */
  getUserByCode: async (id: string): Promise<UserResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.getUserbycode}${id}`);
      return response;
    } catch (error) {
      console.error('Error in getUserByCode:', error);
      throw error;
    }
  },

  /**
   * Forgot password - Send reset link
   * @param userName - Username or email
   * @returns Promise with API response
   */
  forgotPassword: async (userName: string): Promise<UserResponse> => {
    try {
      const response = await apiService.get(
        `${apiUrls.forgotPassword}?userName=${userName}`,
        {
          headers: {
            skip: 'true', // Skip auth interceptor
          },
        }
      );
      return response;
    } catch (error) {
      console.error('Error in forgotPassword:', error);
      throw error;
    }
  },

  /**
   * Verify password reset token/link
   * @param userName - Username or email
   * @returns Promise with verification status
   */
  verifyPassword: async (userName: string): Promise<UserResponse> => {
    try {
      const response = await apiService.get(
        `${apiUrls.verifyPassword}?userName=${userName}`
      );
      return response;
    } catch (error) {
      console.error('Error in verifyPassword:', error);
      throw error;
    }
  },

  /**
   * Reset password
   * @param userName - Username or email
   * @param password - New password
   * @returns Promise with API response
   */
  resetPassword: async (
    userName: string,
    password: string
  ): Promise<UserResponse> => {
    try {
      const response = await apiService.get(
        `${apiUrls.resetPassword}?userName=${userName}&password=${password}`
      );
      return response;
    } catch (error) {
      console.error('Error in resetPassword:', error);
      throw error;
    }
  },
};

export default userService;