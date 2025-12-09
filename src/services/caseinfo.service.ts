// File: src/services/caseInfoService.ts
import { apiService } from './api.service';
import { apiUrls } from '../constants/apiConstants';

// ==================== INTERFACES ====================
export interface CaseInfo {
  investigationId?: string;
  claimNumber?: string;
  policyNumber?: string;
  insuredName?: string;
  hospitalName?: string;
  diagnosis?: string;
  claimAmount?: number;
  dateOfAdmission?: string;
  dateOfDischarge?: string;
  status?: string;
  [key: string]: any;
}

export interface CaseInfoResponse {
  statusCode: number;
  message?: string;
  payload?: CaseInfo | null;
}

// ==================== SERVICE ====================
export const caseInfoService = {
  /**
   * Get case information details for cashless claim
   * @param invClaimId - Investigation/Claim ID (will be cleaned)
   * @returns Promise with case information
   */
  getCaseInfoDetails: async (
    invClaimId: string
  ): Promise<CaseInfoResponse> => {
    try {
      // Clean investigation ID (remove suffix after dash)
      const cleanInvClaimId = invClaimId.split('-')[0];
      
      const response = await apiService.get(
        `${apiUrls.caseInfoDetails}${cleanInvClaimId}`
      );
      return response;
    } catch (error) {
      console.error('Error in getCaseInfoDetails:', error);
      throw error;
    }
  },

  /**
   * Get case information details for reimbursement claim
   * @param invClaimId - Investigation/Claim ID (will be cleaned)
   * @returns Promise with case information
   */
  getCaseInfoDetailsReim: async (
    invClaimId: string
  ): Promise<CaseInfoResponse> => {
    try {
      // Clean investigation ID (remove suffix after dash)
      const cleanInvClaimId = invClaimId.split('-')[0];
      
      const response = await apiService.get(
        `${apiUrls.recaseInfoDetails}${cleanInvClaimId}`
      );
      return response;
    } catch (error) {
      console.error('Error in getCaseInfoDetailsReim:', error);
      throw error;
    }
  },
};

export default caseInfoService;