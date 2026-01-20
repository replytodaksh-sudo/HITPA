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
};

export default caseUpdateService;