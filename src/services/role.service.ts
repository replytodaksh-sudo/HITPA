import { apiService } from './api.service';

export const RoleService = {
    // Fetch all agencies
    getRoles: (userTypeCode:string) => apiService.get(`role/getRoles/${userTypeCode}`),
    // Add new agency
    createRole: (data: any) => apiService.post('/agency/addAgency', data),

    // Edit agency
    updateRole: (data: any) => apiService.put('/agency/editAgency', data),

    // Delete agency
    deleteRole: (agencyCode: string) =>
        apiService.delete(`/agency/deleteAgency/${agencyCode}`),
};

// class RoleService {
//   async getRoles() {
//     const response = await axios.get(`${API_BASE_URL}/roles`);
//     return response.data;
//   }

//   async createRole(payload: RolePayload) {
//     const response = await axios.post(`${API_BASE_URL}/roles`, payload);
//     return response.data;
//   }

//   async updateRole(roleId: string, payload: RolePayload) {
//     const response = await axios.put(`${API_BASE_URL}/roles/${roleId}`, payload);
//     return response.data;
//   }

//   async deleteRole(roleId: string) {
//     const response = await axios.delete(`${API_BASE_URL}/roles/${roleId}`);
//     return response.data;
//   }
// }
