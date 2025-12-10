// // File: src/services/reim-case-update.service.ts

// import { apiService } from './api.service';
// import { apiUrls } from '../constants/apiConstants';

// class ReimcaseUpdateService {
//   /**
//    * Add employer verification
//    */
//   async addEmployeerVerify(payload: any, investigationId: string) {
//     const response = await apiService.post(
//       `${apiUrls.employerVerification}${investigationId}`,
//       payload
//     );
//     return response;
//   }

//   /**
//    * Get employer verification data
//    */
//   async getEmployerVerification(investigationId: string) {
//     const response = await apiService.get(
//       `${apiUrls.employerVerification}${investigationId}`
//     );
//     return response;
//   }

//   /**
//    * Add hospital verification
//    */
//   async addHospitalVerify(payload: any, investigationId: string) {
//     const response = await apiService.post(
//       `${apiUrls.hospitalVerification}${investigationId}`,
//       payload
//     );
//     return response;
//   }

//   /**
//    * Get hospital verification data
//    */
//   async getHospitalVerification(investigationId: string) {
//     const response = await apiService.get(
//       `${apiUrls.hospitalVerification}${investigationId}`
//     );
//     return response;
//   }

//   /**
//    * Add insured verification
//    */
//   async addInsuredVerify(payload: any, investigationId: string) {
//     const response = await apiService.post(
//       `${apiUrls.insuredVerification}${investigationId}`,
//       payload
//     );
//     return response;
//   }

//   /**
//    * Get insured verification data
//    */
//   async getInsuredVerification(investigationId: string) {
//     const response = await apiService.get(
//       `${apiUrls.insuredVerification}${investigationId}`
//     );
//     return response;
//   }

//   /**
//    * Submit final reimbursement case update
//    */
//   async submitFinalReimUpdate(payload: any, investigationId: string) {
//     const response = await apiService.post(
//       `${apiUrls.reimFinalSubmit}${investigationId}`,
//       payload
//     );
//     return response;
//   }

//   /**
//    * Save reimbursement case update as draft
//    */
//   async saveDraftReimUpdate(payload: any, investigationId: string) {
//     const response = await apiService.post(
//       `${apiUrls.reimDraftSave}${investigationId}`,
//       payload
//     );
//     return response;
//   }
// }

// export const reimcaseUpdateService = new ReimcaseUpdateService();


// ============================================================================
// FILE: src/services/reimCaseUpdateService.ts
// Reimbursement Case Update Service - React/TypeScript version
// ============================================================================

import { apiUrls } from '../constants/apiConstants';
import apiService from './api.service';

// ==================== INTERFACES ====================

export interface EmployerVerifyPayload {
  employerName?: string;
  employerContact?: string;
  employerAddress?: string;
  verificationStatus?: string;
  verificationDate?: string;
  verificationRemarks?: string;
  documentsVerified?: boolean;
  [key: string]: any;
}

export interface HospitalVerifyPayload {
  hospitalName?: string;
  hospitalContact?: string;
  hospitalAddress?: string;
  verificationStatus?: string;
  verificationDate?: string;
  verificationRemarks?: string;
  documentsCollected?: boolean;
  admissionConfirmed?: boolean;
  [key: string]: any;
}

export interface InsuredVerifyPayload {
  insuredName?: string;
  insuredContact?: string;
  insuredAddress?: string;
  verificationStatus?: string;
  verificationDate?: string;
  verificationRemarks?: string;
  statementRecorded?: boolean;
  identityVerified?: boolean;
  [key: string]: any;
}

export interface CaseUpdateResponse {
  statusCode: number;
  message?: string;
  payload?: any;
}

// ==================== SERVICE ====================

export const reimcaseUpdateService = {

  addEmployerVerify: async (
    payload: EmployerVerifyPayload,
    investigationId: string
  ): Promise<CaseUpdateResponse> => {
    try {
      // Clean investigation ID (remove suffix after dash)
      const cleanInvId = investigationId.split('-')[0];

      const response = await apiService.post<any>(
        `${apiUrls.reCaseUpdateEmployeer}${cleanInvId}`,
        payload
      );

      return response;
    } catch (error) {
      console.error('Error in addEmployerVerify:', error);
      throw error;
    }
  },

  addHospitalVerify: async (
    payload: HospitalVerifyPayload,
    investigationId: string
  ): Promise<CaseUpdateResponse> => {
    try {
      // Clean investigation ID (remove suffix after dash)
      const cleanInvId = investigationId.split('-')[0];

      const response = await apiService.post<any>(
        `${apiUrls.reCaseUpdateHospital}${cleanInvId}`,
        payload
      );

      return response;
    } catch (error) {
      console.error('Error in addHospitalVerify:', error);
      throw error;
    }
  },

  addHospitalVerifyTwo: async (
    payload: HospitalVerifyPayload,
    investigationId: string
  ): Promise<CaseUpdateResponse> => {
    try {
      // Clean investigation ID (remove suffix after dash)
      const cleanInvId = investigationId.split('-')[0];

      const response = await apiService.post<any>(
        `${apiUrls.reCaseUpdateHospitalVeri}${cleanInvId}`,
        payload
      );

      return response;
    } catch (error) {
      console.error('Error in addHospitalVerifyTwo:', error);
      throw error;
    }
  },

  finalSubmit: async (
    investigationId: string,
    activeCaseId: string
  ): Promise<CaseUpdateResponse> => {
    try {
      // Clean investigation ID (remove suffix after dash)
      const cleanInvId = investigationId.split('-')[0];

      const response = await apiService.post<any>(
        apiUrls.finalReimCaseUpdate,
        {},
        {
          params: {
            invId: cleanInvId,
            activeReCaseID: activeCaseId,
          },
        }
      );

      return response;
    } catch (error) {
      console.error('Error in finalSubmit:', error);
      throw error;
    }
  },

  addInsuredVerify: async (
    payload: InsuredVerifyPayload,
    investigationId: string
  ): Promise<CaseUpdateResponse> => {
    try {
      // Clean investigation ID (remove suffix after dash)
      const cleanInvId = investigationId.split('-')[0];

      const response = await apiService.post<any>(
        `${apiUrls.reCaseUpdateInsured}${cleanInvId}`,
        payload
      );

      return response;
    } catch (error) {
      console.error('Error in addInsuredVerify:', error);
      throw error;
    }
  },

  async addEmployeerVerify(payload: any, investigationId: string) {
    const response = await apiService.post(
      `${apiUrls.employerVerification}${investigationId}`,
      payload
    );
    return response;
  }
};

export default reimcaseUpdateService;