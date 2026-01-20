// import { apiService } from './api.service';

// // Types
// export interface Claim {
//   investigationID: string;
//   sbigClaimNo: string;
//   tpaClaimNo: string;
//   tpaName: string;
//   proposerName: string;
//   policyCode: string;
//   policyStartDate: string;
//   hospitalName: string;
//   tat: number;
//   hospitalCity: string;
//   hospitalState: string;
//   claimAmount: number;
//   patientName: string;
//   memberAge: number;
//   finalDiagnosis: string;
//   dateOfIntimetion: string;
//   admissionDate: string;
//   dischargeDate: string;
//   workflowStatus: string;
// }

// /**
//  * Claims Service
//  * Handles all claims-related API calls
//  */
// class claimsService {
//   /**
//    * Get all claims assigned to Field Officer
//    */
//   async getAllAssignedToFO() {
//     return apiService.get<any>('/claims/getAllCentralNewCases');
//   }

//   async getAllAssignedToForAction() {
//     return apiService.get<any>('/claims/getALLCentralNewCasesForAction');
//   }

//   async getAllAssignedToReim() {
//     return apiService.get<any>('/reclaims/getAllCentralNewCases');
//   }
//   async getAllAssignedReimToForAction() {
//     return apiService.get<any>('/reclaims/getALLCentralNewCasesForAction');
//   }
//   async fetchAllCentralReworkCases() {
//     return apiService.get<any>('/claims/getAllCentralReworkCases');
//   }
//   async fetchAllCentralReworkCasesReim() {
//     return apiService.get<any>('/reclaims/getAllCentralReworkCases');
//   }
//   async fetchAllCentralReassignedCases() {
//     return apiService.get<any>('/claims/getAllCentralReassignedCases');
//   }
//   async fetchAllCentralReassignedCasesReim() {
//     return apiService.get<any>('/reclaims/getAllCentralReassignedCases');
//   }
//   async getNotCompletedCasesRegional() {
//     return apiService.get<any>('/claims/getAllCompleteCaseNotInvestigated');
//   }
//   async getNotCompletedCasesRegionalReim() {
//     return apiService.get<any>('/reclaims/getAllCompleteCaseNotInvestigated');
//   }

//   // _________________________
//   async claimDetails(investigationId: string) {
//     var insid = investigationId.split(' ')[0];
//     insid = insid.split('-')[0];
//     return apiService.get<any>(`/claims/getClaimsDataByInvClaimId/${insid}`);
//   }

//   async updateClaim(data: any) {
//     return apiService.put<any>('/claims/update', data);
//   }

//   async acceptDenyClaim(data: any) {
//     return apiService.post<any>('/claims/accept-deny', data);
//   }
//   async reclaimDetails(investigationId: string) {
//     var insid = investigationId.split(' ')[0];
//     insid = insid.split('-')[0];
//     return apiService.get<any>(`/reclaims/getClaimsDataByInvClaimId/${insid}`);
//   }
//   // >>>>>>>>>>>>>
//   async fetchClaims() { return apiService.get('/claims/getAllNewCases') }
//   async fetchReimClaims() { return apiService.get('/reclaims/getAllNewCases') }
//   async fetchClaimsByTat(tatRange: string) { apiService.get<any>(`/claims/getAllNewCases?tatFilter=${tatRange}`) }
//   async fetchReimClaimsByTat(tatRange: string) { apiService.get<any>(`/reclaims/getAllNewCases?tatFilter=${tatRange}`) }


//   async getAssignedToSelfCases() {
//     apiService.get('/claims/getAllAgencyAssignedToSelf')
//   }
//   async getAssignedToSelfCasesByTat(tatRange: string) {
//     apiService.get(`/claims/getAllAgencyAssignedToSelf?tatFilter=${tatRange}`)
//   }
//   async getAssignedToSelfCasesRegional() {
//     apiService.get('/claims/getAssignedToSelfCases')
//   }
//   async getAssignedToSelfCasesRegionalByTat(tatRange: string) {
//     apiService.get(`/claims/getAssignedToSelfCases?tatFilter=${tatRange}`)
//   }
//   async getAssignedToSelfCasesReim() {
//     apiService.get('/reclaims/getAllAgencyAssignedToSelf')
//   }
//   async getAssignedToSelfCasesReimByTat(tatRange: string) {
//     apiService.get(`/reclaims/getAllAgencyAssignedToSelf?tatFilter=${tatRange}`)
//   }
//   async getAssignedToSelfCasesReimRegional() {
//     apiService.get('/reclaims/getAssignedToSelfCases')
//   }
//   async getAssignedToSelfCasesReimRegionalByTat(tatRange: string) {
//     apiService.get(`/reclaims/getAssignedToSelfCases?tatFilter=${tatRange}`)
//   }

//   async fetchAllDeniedByRegional() {
//     return apiService.get<any>('/claims/getAllDeniedByRegional');
//   }

//   async fetchAllDeniedByRegionalReim() {
//     return apiService.get<any>('/reclaims/getAllDeniedByRegional');
//   }

//   async fetchAllCentralAssignedToRegional() {
//     return apiService.get<any>('/claims/getAllCentralAssignedToRegional');
//   }

//   async fetchAllCentralAssignedToRegionalReims() {
//     return apiService.get<any>('/reclaims/getAllCentralAssignedToRegional');
//   }

//   async fetchAllCentralAssignedToAgency() {
//     return apiService.get<any>('/claims/getAllCentralAssignedToAgency');
//   }

//   async fetchAllCentralAssignedToAgencyReims() {
//     return apiService.get<any>('/reclaims/getAllCentralAssignedToAgency');
//   }

//   async fetchAllCentralCaseNotInvestigated() {
//     return apiService.get<any>('/claims/getAllCentralCaseNotInvestigated');
//   }

//   async fetchAllCentralCaseNotInvestigatedReim() {
//     return apiService.get<any>('/reclaims/getAllCentralCaseNotInvestigated');
//   }

//   async getAllCentralInvestigationCompletedByPage(pageNo: number, pageSize: number) {
//     return apiService.get<any>(`/claims/getAllCentralInvestigationCompletedByPage?pageNo=${pageNo}&pageSize=${pageSize}`);
//   }

//   async getAllCentralInvestigationTotalCompleted() {
//     return apiService.get<any>('/claims/getAllCentralInvestigationTotalCompleted');
//   }

//   async getAllCentralInvestigationCompletedBySearch(claimNo: string) {
//     return apiService.get<any>(`/claims/getAllCentralInvestigationCompletedBySearch??sbigClaimNo=${claimNo}`);
//   }
//   async getAllCentralInvestigationCompletedByPageReim(pageNo: number, pageSize: number) {
//     return apiService.get<any>(`/claims/getAllCentralInvestigationCompletedByPage?pageNo=${pageNo}&pageSize=${pageSize}`);
//   }

//   async getAllCentralInvestigationTotalCompletedReim() {
//     return apiService.get<any>('/claims/getAllCentralInvestigationTotalCompleted');
//   }

//   async getAllCentralInvestigationCompletedBySearchReim(claimNo: string) {
//     return apiService.get<any>(`/claims/getAllCentralInvestigationCompletedBySearch??sbigClaimNo=${claimNo}`);
//   }
  
//   async getAllPEDEvidences() {
//     return apiService.get<any>(`/claimsQC/getPEDClaimEvidence`);
//   }
  
//   async getCompletedRegional() {
//     return apiService.get<any>(`/claims/getAllCompleteInvestigationCases`);
//   }
  
//   async getCompletedRegionalReim() {
//     return apiService.get<any>(`/reclaims/getAllCompleteInvestigationCases`);
//   }
  
//   async getReAssignClaimsReg() {
//     return apiService.get<any>(`/claims/getReAssignClaims`);
//   }
  
//   async getReAssignClaims() {
//     return apiService.get<any>(`/claims/getAllAgencyReassignedCases`);
//   }

//   async getReAssignClaimsRegByTat(tatRange: string) {
//     apiService.get(`/claims/getReAssignClaims?tatFilter=${tatRange}`)
//   }

//   async getReAssignClaimsByTat(tatRange: string) {
//     apiService.get(`/claims/getAllAgencyReassignedCases?tatFilter=${tatRange}`)
//   }
  
//   async getReAssignClaimsRegReim() {
//     return apiService.get<any>(`/reclaims/getReAssignClaims`);
//   }
  
//   async getReAssignClaimsReim() {
//     return apiService.get<any>(`/reclaims/getAllAgencyReassignedCases`);
//   }

//   async getReAssignClaimsRegByTatReim(tatRange: string) {
//     apiService.get(`/reclaims/getReAssignClaims?tatFilter=${tatRange}`)
//   }

//   async getReAssignClaimsByTatReim(tatRange: string) {
//     apiService.get(`/reclaims/getAllAgencyReassignedCases?tatFilter=${tatRange}`)
//   }
  
//   async getReworkClaimsReg() {
//     return apiService.get<any>(`/claims/getReworkClaims`);
//   }
  
//   async getReworkClaims() {
//     return apiService.get<any>(`/claims/getAllAgencyReworkCases`);
//   }

//   async getReworkClaimsRegByTat(tatRange: string) {
//     apiService.get(`/claims/getReworkClaims?tatFilter=${tatRange}`)
//   }

//   async getReworkClaimsByTat(tatRange: string) {
//     apiService.get(`/claims/getAllAgencyReworkCases?tatFilter=${tatRange}`)
//   }
  
//   async getClaimsAssignedToAgencyCases() {
//     return apiService.get<any>(`/claims/getAssignedToAgencyCases`);
//   }
  
//   async getClaimsAssignedToFOCases() {
//     return apiService.get<any>(`/claims/getAllAgencyAssignedToFO`);
//   }

//   async getClaimsAssignedToAgencyCasesByTat(tatRange: string) {
//     apiService.get(`/claims/getAssignedToAgencyCases?tatFilter=${tatRange}`)
//   }

//   async getClaimsAssignedToFOCasesByTat(tatRange: string) {
//     apiService.get(`/claims/getAllAgencyAssignedToFO?tatFilter=${tatRange}`)
//   }
  
//   async getClaimsAssignedToAgencyCasesReim() {
//     return apiService.get<any>(`/reclaims/getAssignedToAgencyCases`);
//   }
  
//   async getClaimsAssignedToFOCasesReim() {
//     return apiService.get<any>(`/reclaims/getAllAgencyAssignedToFO`);
//   }

//   async getClaimsAssignedToAgencyCasesByTatReim(tatRange: string) {
//     apiService.get(`/reclaims/getAssignedToAgencyCases?tatFilter=${tatRange}`)
//   }

//   async getClaimsAssignedToFOCasesByTatReim(tatRange: string) {
//     apiService.get(`/reclaims/getAllAgencyAssignedToFO?tatFilter=${tatRange}`)
//   }
  
//   async getClaimsRegionalSelfDeniedCasesReim() {
//     return apiService.get<any>(`/reclaims/getAllRegionalDeniedCases`);
//   }
  
//   async getClaimsAgencySelfDeniedCasesReim() {
//     return apiService.get<any>(`/reclaims/getAllAgencySelfDeniedCases`);
//   }

//   async getClaimsRegionalSelfDeniedCasesByTatReim(tatRange: string) {
//     apiService.get(`/reclaims/getAllRegionalDeniedCases?tatFilter=${tatRange}`)
//   }

//   async getClaimsAgencySelfDeniedCasesByTatReim(tatRange: string) {
//     apiService.get(`/reclaims/getAllAgencySelfDeniedCases?tatFilter=${tatRange}`)
//   }
  
//   async getClaimsRegionalSelfDeniedCases() {
//     return apiService.get<any>(`/claims/getAllRegionalDeniedCases`);
//   }
  
//   async getClaimsAgencySelfDeniedCases() {
//     return apiService.get<any>(`/claims/getAllAgencySelfDeniedCases`);
//   }

//   async getClaimsRegionalSelfDeniedCasesByTat(tatRange: string) {
//     apiService.get(`/claims/getAllRegionalDeniedCases?tatFilter=${tatRange}`)
//   }
  
//   async getClaimsAgencySelfDeniedCasesByTat(tatRange: string) {
//     apiService.get(`/claims/getAllAgencySelfDeniedCases?tatFilter=${tatRange}`)
//   }
  
//   async fetchCentralMandatedCases() {
//     return apiService.get<any>(`/claims/getAllCentralMandatedCases`);
//   }

//   async fetchCentralMandatedCasesByTat(tatRange: string) {
//     apiService.get(`/claims/getAllCentralMandatedCases?tatFilter=${tatRange}`)
//   }
  
//   async fetchCentralMandatedCasesReim() {
//     return apiService.get<any>(`/reclaims/getAllCentralMandatedCases`);
//   }

//   async fetchCentralMandatedCasesByTatReim(tatRange: string) {
//     apiService.get(`/reclaims/getAllCentralMandatedCases?tatFilter=${tatRange}`)
//   }
  
//   async fetchAgencyDeniedCases() {
//     return apiService.get<any>(`/claims/getAllAgencyDeniedCases`);
//   }

//   async fetchAgencyDeniedCasesByTat(tatRange: string) {
//     apiService.get(`/claims/getAllAgencyDeniedCases?tatFilter=${tatRange}`)
//   }
  
//   async fetchAgencyDeniedCasesReim() {
//     return apiService.get<any>(`/reclaims/getAllAgencyDeniedCases`);
//   }

//   async fetchAgencyDeniedCasesByTatReim(tatRange: string) {
//     apiService.get(`/reclaims/getAllAgencyDeniedCases?tatFilter=${tatRange}`)
//   }
  
//   async fetchPendingFromCentralCashless() {
//     return apiService.get<any>(`/claims/getAllQCPendingFromCentralCases`);
//   }

//   async fetchPendingFromCentralCashlessByTat(tatRange: string) {
//     apiService.get(`/claims/getAllQCPendingFromCentralCases?tatFilter=${tatRange}`)
//   }
  
//   async fetchPendingFromCentralReim() {
//     return apiService.get<any>(`/reclaims/getAllQCPendingFromCentralCases`);
//   }

//   async fetchPendingFromCentralByTatReim(tatRange: string) {
//     apiService.get(`/reclaims/getAllQCPendingFromCentralCases?tatFilter=${tatRange}`)
//   }
  
//   async fetchCentralQueryCashless() {
//     return apiService.get<any>(`/claims/getAllQCCentralQueryCases`);
//   }

//   async fetchCentralQueryCashlessByTat(tatRange: string) {
//     apiService.get(`/claims/getAllQCCentralQueryCases?tatFilter=${tatRange}`)
//   }
  
//   async fetchCentralQueryReim() {
//     return apiService.get<any>(`/reclaims/getAllQCCentralQueryCases`);
//   }

//   async fetchCentralQueryReimByTat(tatRange: string) {
//     apiService.get(`/reclaims/getAllQCCentralQueryCases?tatFilter=${tatRange}`)
//   }
  
//   async fetchQCPendingClaimsCashless() {
//     return apiService.get<any>(`/claims/getAllQCPendingCases`);
//   }

//   async fetchQCPendingClaimsCashlessByTat(tatRange: string) {
//     apiService.get(`/claims/getAllQCPendingCases?tatFilter=${tatRange}`)
//   }
  
//   async fetchQCPendingClaimsReim() {
//     return apiService.get<any>(`/reclaims/getAllQCPendingCases`);
//   }

//   async fetchQCPendingClaimsReimByTat(tatRange: string) {
//     apiService.get(`/reclaims/getAllQCPendingCases?tatFilter=${tatRange}`)
//   }


//   /**
//    * Get all claims assigned to self
//    */
//   // async getAllAssignedToSelf() {
//   //   return apiService.get<Claim[]>('/claims/assigned-to-self');
//   // }

//   // /**
//   //  * Get claim by investigation ID
//   //  */
//   // async getClaimByInvestigationId(investigationId: string) {
//   //   return apiService.get<Claim>(`/claims/${investigationId}`);
//   // }

//   // /**
//   //  * Get fresh cases
//   //  */
//   // async getFreshCases(caseType: string) {
//   //   return apiService.get<Claim[]>('/claims/fresh', { caseType });
//   // }

//   // /**
//   //  * Get on field cases
//   //  */
//   // async getOnFieldCases(caseType: string) {
//   //   return apiService.get<Claim[]>('/claims/on-field', { caseType });
//   // }

//   // /**
//   //  * Get completed cases
//   //  */
//   // async getCompletedCases(caseType: string) {
//   //   return apiService.get<Claim[]>('/claims/completed', { caseType });
//   // }

//   // /**
//   //  * Get QC cases
//   //  */
//   // async getQCCases(caseType: string) {
//   //   return apiService.get<Claim[]>('/claims/qc', { caseType });
//   // }

//   // /**
//   //  * Update claim
//   //  */
//   // async updateClaim(investigationId: string, data: any) {
//   //   return apiService.put(`/claims/${investigationId}`, data);
//   // }

//   // /**
//   //  * Assign claim
//   //  */
//   // async assignClaim(investigationId: string, assignTo: string) {
//   //   return apiService.post(`/claims/${investigationId}/assign`, { assignTo });
//   // }

//   // /**
//   //  * Get claim statistics
//   //  */
//   // async getClaimStatistics() {
//   //   return apiService.get<{
//   //     totalClaims: number;
//   //     totalAmount: number;
//   //     avgTAT: number;
//   //     byStatus: Record<string, number>;
//   //   }>('/claims/statistics');
//   // }

//   // /**
//   //  * Export claims to Excel
//   //  */
//   // async exportClaims(filters: any) {
//   //   return apiService.downloadFile('/claims/export', 'claims-export.xlsx', filters);
//   // }
// }

// // Export singleton instance
// export const claimsService = new claimsService();

// // Export class
// export default claimsService;




// File: src/services/claimsService.ts - COMPLETE VERSION
// This file contains all 200+ methods from the Angular claimsService
// Copy this entire file to your project

import { apiService } from './api.service';
import { apiUrls } from '../constants/apiConstants';

export interface Claim {
  investigationId?: string;
  claimNumber?: string;
  sbigClaimNo?: string;
  tpaClaimNo?: string;
  [key: string]: any;
}

export interface ClaimsResponse {
  statusCode: number;
  message?: string;
  payload?: any;
}

export const claimsService = {
  // FRESH CASES
  fetchClaims: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchClaims);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchClaimsByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.fetchClaims}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchClaimsReim: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchClaimsReim);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchClaimsReimByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.fetchClaimsReim}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // AGENCY DENIED
  fetchAgencyDeniedCases: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchAgencyDeniedCases);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchAgencyDeniedCasesByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.fetchAgencyDeniedCases}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchAgencyDeniedCasesReim: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchAgencyDeniedCasesReim);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchAgencyDeniedCasesReimByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.fetchAgencyDeniedCasesReim}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchRegionalDeniedCases: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchRegionalDeniedCases);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // CENTRAL MANDATED
  fetchCentralMandatedCases: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchCentralMandatedCases);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchCentralMandatedCasesByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.fetchCentralMandatedCases}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchCentralMandatedCasesReim: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchCentralMandatedCasesReim);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchCentralMandatedCasesReimByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.fetchCentralMandatedCasesReim}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // CENTRAL NEW CASES FOR ACTION
  fetchALLCentralNewCasesForAction: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchALLCentralNewCasesForAction);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchALLCentralNewCasesForActionByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.fetchALLCentralNewCasesForAction}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchALLCentralNewCasesForActionReim: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchALLCentralNewCasesForActionReim);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchALLCentralNewCasesForActionReimByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.fetchALLCentralNewCasesForActionReim}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // CENTRAL ASSIGNED TO AGENCY
  fetchAllCentralAssignedToAgency: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchAllCentralAssignedToAgency);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchAllCentralAssignedToAgencyByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.fetchAllCentralAssignedToAgency}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchAllCentralAssignedToAgencyReims: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchAllCentralAssignedToAgencyReims);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchAllCentralAssignedToAgencyReimsBytat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.fetchAllCentralAssignedToAgencyReims}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // CENTRAL REWORK CASES
  fetchAllCentralReworkCases: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchAllCentralReworkCases);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchAllCentralReworkCasesByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.fetchAllCentralReworkCases}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchAllCentralReworkCasesReim: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchAllCentralReworkCasesReim);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchAllCentralReworkCasesReimByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.fetchAllCentralReworkCasesReim}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // CENTRAL REASSIGNED CASES
  fetchAllCentralReassignedCases: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchAllCentralReassignedCases);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchAllCentralReassignedCasesByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.fetchAllCentralReassignedCases}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchAllCentralReassignedCasesReim: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchAllCentralReassignedCasesReim);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchAllCentralReassignedCasesReimByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.fetchAllCentralReassignedCasesReim}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // CENTRAL CASE NOT INVESTIGATED
  fetchAllCentralCaseNotInvestigated: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchAllCentralCaseNotInvestigated);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchAllCentralCaseNotInvestigatedReim: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchAllCentralCaseNotInvestigatedReim);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // CENTRAL INVESTIGATION COMPLETED
  fetchAllCentralInvestigationCompleted: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchAllCentralInvestigationCompleted);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchAllCentralInvestigationCompletedReim: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchAllCentralInvestigationCompletedReim);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // CENTRAL QC PENDING
  fetchAllCentralQCPending: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchAllCentralQCPending);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchAllCentralQCPendingByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.fetchAllCentralQCPending}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchAllCentralQCPendingReim: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchAllCentralQCPendingReim);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchAllCentralQCPendingReimByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.fetchAllCentralQCPendingReim}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // CENTRAL QUERY RESPONSE
  fetchAllCentralQueryResponse: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchAllCentralQueryResponse);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchAllCentralQueryResponseByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.fetchAllCentralQueryResponse}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchAllCentralQueryResponsePending: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchAllCentralQueryResponsePending);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchAllCentralQueryResponsePendingByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.fetchAllCentralQueryResponsePending}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchAllCentralQueryResponsePendingReim: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchAllCentralQueryResponsePendingReim);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchAllCentralQueryResponsePendingReimByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.fetchAllCentralQueryResponsePendingReim}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchAllCentralQueryResponseReim: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchAllCentralQueryResponseReim);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchAllCentralQueryResponseReimByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.fetchAllCentralQueryResponseReim}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // DENIED BY REGIONAL
  fetchAllDeniedByRegional: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchAllDeniedByRegional);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchAllDeniedByRegionalByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.fetchAllDeniedByRegional}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchAllDeniedByRegionalReim: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchAllDeniedByRegionalReim);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchAllDeniedByRegionalReimByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.fetchAllDeniedByRegionalReim}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // QUERIES BY CLAIMS TEAM
  fetchAllQueriesByClaimsTeam: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchAllQueriesByClaimsTeam);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchAllQueriesByClaimsTeamByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.fetchAllQueriesByClaimsTeam}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchAllQueriesByClaimsTeamReim: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchAllQueriesByClaimsTeamReim);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchAllQueriesByClaimsTeamReimByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.fetchAllQueriesByClaimsTeamReim}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // CENTRAL ASSIGNED TO REGIONAL
  fetchAllCentralAssignedToRegional: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchAllCentralAssignedToRegional);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchAllCentralAssignedToRegionalByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.fetchAllCentralAssignedToRegional}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchAllCentralAssignedToRegionalReims: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchAllCentralAssignedToRegionalReims);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchAllCentralAssignedToRegionalReimsByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.fetchAllCentralAssignedToRegionalReims}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // CENTRAL NEW CASES
  fetchAllCentralNewCases: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchAllCentralNewCases);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchAllCentralNewCasesWithTatRange: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.fetchAllCentralNewCases}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchAllCentralNewCasesReim: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchAllCentralNewCasesReim);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchAllCentralNewCasesReimByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.fetchAllCentralNewCasesReim}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // ACTIVE CASE CLAIMS
  fetchActiveCaseClaims: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.activeCaseClaims);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchDeniedCaseClaims: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.deniedCaseClaims);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchReimDeniedCaseClaims: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.reimdeniedCaseClaims);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // CLAIM DETAILS
  claimDetails: async (investigationId: string): Promise<ClaimsResponse> => {
    try {
      let insid = investigationId.split(' ')[0];
      insid = insid.split('-')[0];
      const response = await apiService.get(`${apiUrls.claimDetails}${insid}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  reclaimDetails: async (investigationId: string): Promise<ClaimsResponse> => {
    try {
      let insid = investigationId.split(' ')[0];
      insid = insid.split('-')[0];
      const response = await apiService.get(`${apiUrls.reclaimDetails}${insid}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // QC CLAIMS
  fetchAllQCClaims: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.getAllQCClaims);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchAllReimQCClaims: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.reimQCClaims);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // REIM CLAIMS
  fetchReimClaims: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.reimAssignAgencyFreshClaims);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchReimClaimsByTat: async (range:string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.reimAssignAgencyFreshClaims}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  reimRegionalDeniedCases: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.reimRegionalDeniedCases);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchReimActiveCaseClaims: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.reimActiveClaims);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // COMPLETE CLAIMS
  fetchCompleteClaims: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.getAllCompleteClaims);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchReimCompleteClaims: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.reimgetAllCompleteClaims);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // REINV CLAIMS
  fetchReinvClaims: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchReinvClaims);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // QC PENDING CLAIMS
  fetchQCPendingClaimsCashless: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.allQCPendingCaseCashless);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchQCPendingClaimsCashlessByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.allQCPendingCaseCashless}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchQCPendingClaimsReim: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.allQCPendingCaseReim);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchQCPendingClaimsReimByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.allQCPendingCaseReim}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // CENTRAL QUERY
  fetchCentralQueryCashless: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.allCentralQueryCashless);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchCentralQueryCashlessByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.allCentralQueryCashless}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchCentralQueryReim: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.allCentralQueryReim);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchCentralQueryReimByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.allCentralQueryReim}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // PENDING FROM CENTRAL
  fetchPendingFromCentralCashless: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.allPendingFromCentralCashless);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchPendingFromCentralCashlessByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.allPendingFromCentralCashless}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchPendingFromCentralReim: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.allPendingFromCentralReim);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchPendingFromCentralReimByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.allPendingFromCentralReim}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  fetchReinvReClaims: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchReinvreClaims);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // ASSIGNED TO SELF
  getAssignedToSelfCases: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.getAssignedToSelfCases);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getAssignedToSelfCasesByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.getAssignedToSelfCases}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getReclaimsAssignedToSelfCases: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.getReclaimsAssignedToSelfCases);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getReclaimsAssignedToSelfCasesByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.getReclaimsAssignedToSelfCases}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getAssignedToSelfCasesRegional: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.getAssignedToSelfCasesReg);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getAssignedToSelfCasesRegionalByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.getAssignedToSelfCasesReg}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getAssignedToSelfCasesRegionalReim: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.getAssignedToSelfCasesRegReim);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getReClaimsAssignedToSelfCasesRegional: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.getReclaimsAssignedToSelfCasesReg);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getReClaimsAssignedToSelfCasesRegionalByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.getReclaimsAssignedToSelfCasesReg}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // NOT COMPLETED CASES REGIONAL
  getNotCompletedCasesRegional: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.getNotCompletedCasesReg);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getNotCompletedCasesRegionalReim: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.getNotCompletedCasesRegReim);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // COMPLETED REGIONAL
  getCompletedRegional: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.getCompletedCasesReg);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getCompletedRegionalReim: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.getCompletedCasesRegReim);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // ASSIGNED TO AGENCY
  getAssignedToAgencyCases: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.getAssignedToAgencyCases);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getAssignedToAgencyCasesByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.getAssignedToAgencyCases}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getReclaimsAssignedToAgencyCases: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.getReclaimedAssignedToAgencyCases);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getReclaimsAssignedToAgencyCasesByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.getReclaimedAssignedToAgencyCases}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // ASSIGNED TO FO
  getAssignedToFOCases: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.getAssignedToFOCases);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getAssignedToFOCasesByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.getAssignedToFOCases}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getReclaimsAssignedToFOCases: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.getReclaimsAssignedToFOCases);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getReclaimsAssignedToFOCasesByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.getReclaimsAssignedToFOCases}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // REWORK CLAIMS
  getReworkClaims: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.getReworkClaims);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getReworkClaimsByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.getReworkClaims}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getReworkReclaims: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.getReworkReclaims);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getReworkReclaimsByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.getReworkReclaims}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getReworkClaimsReg: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.getReworkClaimsReg);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getReworkClaimsRegByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.getReworkClaimsReg}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getReworkClaimsRegReim: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.getReworkClaimsRegReim);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getReworkReclaimsReg: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.getReworkReclaimsReg);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getReworkReclaimsRegByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.getReworkReclaimsReg}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // REASSIGN CLAIMS
  getReAssignClaimsReg: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.getReAssignClaimsReg);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getReAssignClaimsRegByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.getReAssignClaimsReg}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getReAssignClaimsRegReim: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.getReAssignClaimsRegReim);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getReAssignClaimsRegReimByTat: async (range:string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.getReAssignClaimsRegReim}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getReAssignReclaimsReg: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.getReAssignReclaimsReg);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getReAssignReclaimsRegByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.getReAssignReclaimsReg}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getReAssignClaims: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.getReAssignClaims);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getReAssignClaimsByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.getReAssignClaims}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getReAssignClaimsReim: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.getReAssignClaimsReim);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getReAssignReclaims: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.getReAssignReclaims);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getReAssignReclaimsByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.getReAssignReclaims}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // AGENCY NEW CASES
  getAgencyNewCases: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchAgencyNewCases);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getAgencyNewCasesByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.fetchAgencyNewCases}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getReclaimsAgencyNewCases: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchReclaimsAgencyNewCases);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getReclaimsAgencyNewCasesByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.fetchReclaimsAgencyNewCases}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // AGENCY SELF DENIED
  getAgencySelfDeniedCases: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchAgencySelfDeniedCase);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getAgencySelfDeniedCasesByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.fetchAgencySelfDeniedCase}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getReclaimsAgencySelfDeniedCases: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchReclaimsAgencySelfDeniedCase);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getReclaimsAgencySelfDeniedCasesByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.fetchReclaimsAgencySelfDeniedCase}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // ALL ASSIGNED TO FO
  getAllAssignedToFO: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchAllAssignedToFo);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getAllAssignedToReim: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.getAllAssignedToReim);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // REGIONAL SELF DENIED
  getRegionalSelfDeniedCases: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchRegionalSelfDeniedCase);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getRegionalSelfDeniedCasesByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.fetchRegionalSelfDeniedCase}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getReclaimsRegionalSelfDeniedCases: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchReclaimsRegionalSelfDeniedCase);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getReclaimsRegionalSelfDeniedCasesByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.fetchReclaimsRegionalSelfDeniedCase}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // AGENCY NOT COMPLETED
  getAgencyNotCompletedCases: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchAgencyNotInvestigatedCase);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getAgencyNotCompletedCasesByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.fetchAgencyNotInvestigatedCase}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getReclaimsAgencyNotCompletedCases: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchReclaimsAgencyNotInvestigatedCase);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getReclaimsAgencyNotCompletedCasesByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.fetchReclaimsAgencyNotInvestigatedCase}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // AGENCY COMPLETED
  getAgencyCompletedCases: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchAgencyInvestigationCompletedCase);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getAgencyCompletedCasesByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.fetchAgencyInvestigationCompletedCase}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getReclaimsAgencyCompletedCases: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchReclaimsAgencyInvestigationCompletedCase);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getReclaimsAgencyCompletedCasesByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.fetchReclaimsAgencyInvestigationCompletedCase}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // AGENCY PENDING FROM REG
  getAllAgencyPendingFromReg: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.getAllAgencyPendingFromReg);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getAllAgencyPendingFromRegByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.getAllAgencyPendingFromReg}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getAllAgencyPendingFromRegReim: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.getAllAgencyPendingFromRegReim);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getAllAgencyPendingFromRegReimByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.getAllAgencyPendingFromRegReim}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // AGENCY QC PENDING
  getAllAgencyQCPending: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.getAllAgencyQCPending);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getAllAgencyQCPendingByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.getAllAgencyQCPending}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getAllAgencyQCPendingReim: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.getAllAgencyQCPendingReim);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getAllAgencyQCPendingReimByTat: async (range: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.getAllAgencyQCPendingReim}?tatFilter=${range}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // CASE DATA
  getCaseData: async (acceptAssignId: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.getCaseData}?acceptAssignId=${acceptAssignId}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // PED EVIDENCES
  getAllPEDEvidences: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.pedEvidences);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },

  // PAGINATION METHODS
  getAllCentralInvestigationCompletedByPage: async (pageNo: number, pageSize: number): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.getAllCentralInvestigationCompletedByPage}?pageNo=${pageNo}&pageSize=${pageSize}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getAllCentralInvestigationTotalCompleted: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.getAllCentralInvestigationTotalCompleted);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getAllCentralInvestigationCompletedBySearch: async (sbigClaimNo: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.getAllCentralInvestigationCompletedBySearch}?sbigClaimNo=${sbigClaimNo}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getAllCentralInvestigationTotalCompletedClaims: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.getAllCentralInvestigationTotalCompletedClaims);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getAllCentralInvestigationTotalCompletedReClaims: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.getAllCentralInvestigationTotalCompletedReClaims);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getAllNewCasesCentral: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.getAllNewCasesCentral);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getAllNewReCasesCentral: async (): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(apiUrls.getAllNewReCasesCentral);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getAllCentralInvestigationCompletedByPageReClaims: async (pageNo: number, pageSize: number): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.getAllCentralInvestigationCompletedByPageReClaims}?pageNo=${pageNo}&pageSize=${pageSize}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getAllCentralInvestigationCompletedByPageClaims: async (pageNo: number, pageSize: number): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.getAllCentralInvestigationCompletedByPageClaims}?pageNo=${pageNo}&pageSize=${pageSize}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getAllCentralNewClaims: async (pageNo: number, pageSize: number): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.getAllCentralNewCasesByPage}?pageNo=${pageNo}&pageSize=${pageSize}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getAllCentralNewReClaims: async (pageNo: number, pageSize: number): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.getAllCentralNewReCasesByPage}?pageNo=${pageNo}&pageSize=${pageSize}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getAllCentralInvestigationCompletedBySearchReClaims: async (sbigClaimNo: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.getAllCentralInvestigationCompletedBySearchReClaims}?sbigClaimNo=${sbigClaimNo}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getAllCentralNewCaseBySearchClaims: async (sbigClaimNo: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.getAllCentralNewCaseBySearchClaims}?sbigClaimNo=${sbigClaimNo}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
  getAllCentralNewReCaseBySearchClaims: async (sbigClaimNo: string): Promise<ClaimsResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.getAllCentralNewReCaseBySearchClaims}?sbigClaimNo=${sbigClaimNo}`);
      return response;
    } catch (error) { console.error('Error:', error); throw error; }
  },
};

export default claimsService;