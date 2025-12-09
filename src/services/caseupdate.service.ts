// import { apiService } from './api.service';

// export const caseUpdateService = {
//     /**
//      * Get case update preview for display
//      * @param investigationId - Investigation ID
//      * @returns Promise with case update details
//      */
//     caseUpdatePreview: (investigationId: string) =>
//         apiService.get(`/activecase/getCaseUpdateData?invClaimId=${investigationId}`),

//     /**
//      * Submit final case update
//      * @param caseUpdateId - Case update ID from localStorage
//      * @param investigationId - Investigation ID
//      * @returns Promise with submission result
//      */
//     addCaseUpdateFinal: (caseUpdateId: string | null, investigationId: string) =>
//         apiService.post(`/activecase/caseUpdateFinal?investigationId=${investigationId}&activeCaseID=${caseUpdateId}`),
    
//     addCaseUpdateHospital: (payload:any, invId:string) =>
//         apiService.post(`/activecase/addCaseUpdateAnyOtherObservation?investigationId=${invId}`, payload),
    
//     addCaseUpdate: (payload:any, invId:string) =>
//         apiService.post(`/activecase/addCaseUpdate?investigationId=${invId}`, payload),
    
//     addCaseUpdateFindings: (payload:any, invId:string) =>
//         apiService.post(`/activecase/addCaseUpdateAnyOtherObservation?investigationId=${invId}`, payload),

//     /**
//      * Get case update by ID
//      * @param caseUpdateId - Case update ID
//      * @returns Promise with case update data
//      */

//     async caseUpdatePreviousData(investigationId: string) {
//         var insid = investigationId.split(' ')[0];
//         insid = insid.split('-')[0];
//         return apiService.get<any>(`/activecase/getCaseUpdateData?invClaimId=${insid}`);
//     },
    
//     async caseUpdatePreviousDataReim(investigationId: string) {
//         var insid = investigationId.split(' ')[0];
//         insid = insid.split('-')[0];
//         return apiService.get<any>(`/reactivecase/getReCaseUpdateData?invClaimId=${insid}`);
//     },
//     // getCaseUpdateById: (caseUpdateId: string) => {
//     //     return apiService.get(`/activecase/getCaseUpdateData?invClaimId=${caseUpdateId}`),
//     // }

//     /**
//      * Create or update case update
//      * @param data - Case update data
//      * @returns Promise with created/updated case update
//      */
//     saveCaseUpdate: (data: any) =>
//         apiService.post('/case-update/save', data),

//     /**
//      * Save case update as draft
//      * @param data - Case update data
//      * @returns Promise with draft save result
//      */
//     saveCaseUpdateDraft: (data: any) =>
//         apiService.post('/case-update/draft', data),

//     /**
//      * Get case update menu items
//      * @param investigationId - Investigation ID
//      * @returns Promise with menu items
//      */
//     getCaseUpdateMenu: (investigationId: string) =>
//         apiService.get(`/case-update/menu/${investigationId}`),

//     /**
//      * Delete case update
//      * @param caseUpdateId - Case update ID
//      * @returns Promise with delete result
//      */
//     deleteCaseUpdate: (caseUpdateId: string) =>
//         apiService.delete(`/case-update/${caseUpdateId}`),
// };

// export default caseUpdateService;


// File: src/services/caseUpdateService.ts
import { apiService } from './api.service';
import { apiUrls } from '../constants/apiConstants';

// ==================== INTERFACES ====================
export interface CaseUpdate {
  investigationId?: string;
  activeCaseID?: string;
  statusOfInsured?: string;
  roomCategory?: string;
  doa?: string;
  diagnosis?: string;
  [key: string]: any;
}

export interface CaseUpdateResponse {
  statusCode: number;
  message?: string;
  payload?: any;
}

// ==================== SERVICE ====================
export const caseUpdateService = {
  /**
   * Add case update (primary data)
   * @param caseUpdateModel - Case update details
   * @param insId - Investigation ID
   * @returns Promise with API response
   */
  addCaseUpdate: async (
    caseUpdateModel: CaseUpdate,
    insId: string
  ): Promise<CaseUpdateResponse> => {
    try {
      const response = await apiService.post(
        `${apiUrls.caseUpdate}${insId}`,
        caseUpdateModel
      );
      return response;
    } catch (error) {
      console.error('Error in addCaseUpdate:', error);
      throw error;
    }
  },

  /**
   * Add case update hospital feedback
   * @param payload - Hospital feedback data
   * @param invId - Investigation ID
   * @returns Promise with API response
   */
  addCaseUpdateHospital: async (
    payload: any,
    invId: string
  ): Promise<CaseUpdateResponse> => {
    try {
      const response = await apiService.post(
        `${apiUrls.caseUpdateHspitl}${invId}`,
        payload
      );
      return response;
    } catch (error) {
      console.error('Error in addCaseUpdateHospital:', error);
      throw error;
    }
  },

  /**
   * Add case update findings
   * @param payload - Findings data
   * @param invId - Investigation ID
   * @returns Promise with API response
   */
  addCaseUpdateFindings: async (
    payload: any,
    invId: string
  ): Promise<CaseUpdateResponse> => {
    try {
      const response = await apiService.post(
        `${apiUrls.caseUpdateFindings}${invId}`,
        payload
      );
      return response;
    } catch (error) {
      console.error('Error in addCaseUpdateFindings:', error);
      throw error;
    }
  },

  /**
   * Submit final case update
   * @param caseUpdateId - Case update ID
   * @param invId - Investigation ID
   * @returns Promise with API response
   */
  addCaseUpdateFinal: async (
    caseUpdateId: string,
    invId: string
  ): Promise<CaseUpdateResponse> => {
    try {
      // Clear localStorage as per original Angular service
      localStorage.clear();
      
      const response = await apiService.post(
        `${apiUrls.caseUpdateFinal}${invId}&activeCaseID=${caseUpdateId}`,
        {}
      );
      return response;
    } catch (error) {
      console.error('Error in addCaseUpdateFinal:', error);
      throw error;
    }
  },

  /**
   * Get case update preview (cashless)
   * @param invId - Investigation ID (will be cleaned)
   * @returns Promise with preview data
   */
  caseUpdatePreview: async (
    invId: string
  ): Promise<CaseUpdateResponse> => {
    try {
      // Clean investigation ID (remove suffix after dash)
      const cleanInvId = invId.split('-')[0];
      
      const response = await apiService.get(
        `${apiUrls.caseUpdatePreview}${cleanInvId}`
      );
      return response;
    } catch (error) {
      console.error('Error in caseUpdatePreview:', error);
      throw error;
    }
  },

  /**
   * Get previous case update data (cashless)
   * @param invId - Investigation ID (will be cleaned)
   * @returns Promise with previous case data
   */
  caseUpdatePreviousData: async (
    invId: string
  ): Promise<CaseUpdateResponse> => {
    try {
      // Clean investigation ID (remove suffix after dash)
      const cleanInvId = invId.split('-')[0];
      
      const response = await apiService.get(
        `${apiUrls.caseUpdatePreviousData}${cleanInvId}`
      );
      return response;
    } catch (error) {
      console.error('Error in caseUpdatePreviousData:', error);
      throw error;
    }
  },

  /**
   * Get previous case update data for reimbursement
   * @param invId - Investigation ID
   * @returns Promise with previous case data
   */
  caseUpdatePreviousDataReim: async (
    invId: string
  ): Promise<CaseUpdateResponse> => {
    try {
      const response = await apiService.get(
        `${apiUrls.caseUpdatePreviousDataReim}${invId}`
      );
      return response;
    } catch (error) {
      console.error('Error in caseUpdatePreviousDataReim:', error);
      throw error;
    }
  },

  /**
   * Save surgical management data
   * @param surgicalData - Surgical management details
   * @param activeCaseID - Active case ID
   * @returns Promise with API response
   */
//   saveSurgicalManagement: async (
//     surgicalData: any,
//     activeCaseID: string
//   ): Promise<CaseUpdateResponse> => {
//     try {
//       const response = await apiService.post(
//         `${apiUrls.saveSurgicalManagement}/${activeCaseID}`,
//         surgicalData
//       );
//       return response;
//     } catch (error) {
//       console.error('Error in saveSurgicalManagement:', error);
//       throw error;
//     }
//   },

  /**
   * Save medical management data
   * @param medicalData - Medical management details
   * @param activeCaseID - Active case ID
   * @returns Promise with API response
   */
//   saveMedicalManagement: async (
//     medicalData: any,
//     activeCaseID: string
//   ): Promise<CaseUpdateResponse> => {
//     try {
//       const response = await apiService.post(
//         `${apiUrls.saveMedicalManagement}/${activeCaseID}`,
//         medicalData
//       );
//       return response;
//     } catch (error) {
//       console.error('Error in saveMedicalManagement:', error);
//       throw error;
//     }
//   },

  /**
   * Save RTA (Road Traffic Accident) data
   * @param rtaData - RTA details
   * @param activeCaseID - Active case ID
   * @returns Promise with API response
   */
//   saveRTAManagement: async (
//     rtaData: any,
//     activeCaseID: string
//   ): Promise<CaseUpdateResponse> => {
//     try {
//       const response = await apiService.post(
//         `${apiUrls.saveRTAManagement}/${activeCaseID}`,
//         rtaData
//       );
//       return response;
//     } catch (error) {
//       console.error('Error in saveRTAManagement:', error);
//       throw error;
//     }
//   },

  /**
   * Save treating doctor information
   * @param doctorData - Doctor details
   * @param activeCaseID - Active case ID
   * @returns Promise with API response
   */
//   saveTreatingDoctor: async (
//     doctorData: any,
//     activeCaseID: string
//   ): Promise<CaseUpdateResponse> => {
//     try {
//       const response = await apiService.post(
//         `${apiUrls.saveTreatingDoctor}/${activeCaseID}`,
//         doctorData
//       );
//       return response;
//     } catch (error) {
//       console.error('Error in saveTreatingDoctor:', error);
//       throw error;
//     }
//   },

  /**
   * Delete treating doctor
   * @param doctorId - Doctor ID to delete
   * @returns Promise with API response
   */
//   deleteTreatingDoctor: async (
//     doctorId: string
//   ): Promise<CaseUpdateResponse> => {
//     try {
//       const response = await apiService.delete(
//         `${apiUrls.deleteTreatingDoctor}/${doctorId}`
//       );
//       return response;
//     } catch (error) {
//       console.error('Error in deleteTreatingDoctor:', error);
//       throw error;
//     }
//   },

  /**
   * Update case update data
   * @param caseUpdate - Case update details
   * @param investigationId - Investigation ID
   * @returns Promise with API response
   */
//   updateCaseUpdate: async (
//     caseUpdate: CaseUpdate,
//     investigationId: string
//   ): Promise<CaseUpdateResponse> => {
//     try {
//       const response = await apiService.put(
//         `${apiUrls.updateCaseUpdate}/${investigationId}`,
//         caseUpdate
//       );
//       return response;
//     } catch (error) {
//       console.error('Error in updateCaseUpdate:', error);
//       throw error;
//     }
//   },
};

export default caseUpdateService;