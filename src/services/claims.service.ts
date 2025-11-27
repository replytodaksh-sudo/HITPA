import { apiService } from './api.service';

// Types
export interface Claim {
  investigationID: string;
  sbigClaimNo: string;
  tpaClaimNo: string;
  tpaName: string;
  proposerName: string;
  policyCode: string;
  policyStartDate: string;
  hospitalName: string;
  tat: number;
  hospitalCity: string;
  hospitalState: string;
  claimAmount: number;
  patientName: string;
  memberAge: number;
  finalDiagnosis: string;
  dateOfIntimetion: string;
  admissionDate: string;
  dischargeDate: string;
  workflowStatus: string;
}

/**
 * Claims Service
 * Handles all claims-related API calls
 */
class ClaimsService {
  /**
   * Get all claims assigned to Field Officer
   */
  async getAllAssignedToFO() {
    return apiService.get<any>('/claims/getAllCentralNewCases');
  }

  async getAllAssignedToForAction() {
    return apiService.get<any>('/claims/getALLCentralNewCasesForAction');
  }

  async getAllAssignedToReim() {
    return apiService.get<any>('/reclaims/getAllCentralNewCases');
  }
  async getAllAssignedReimToForAction() {
    return apiService.get<any>('/reclaims/getALLCentralNewCasesForAction');
  }

  // _________________________
  async claimDetails(investigationId: string) {
    var insid = investigationId.split(' ')[0];
    insid = insid.split('-')[0];
    return apiService.get<any>(`/claims/getClaimsDataByInvClaimId/${insid}`);
  }

  async updateClaim(data: any) {
    return apiService.put<any>('/claims/update', data);
  }

  async acceptDenyClaim(data: any) {
    return apiService.post<any>('/claims/accept-deny', data);
  }
  async reclaimDetails(investigationId: string) {
    var insid = investigationId.split(' ')[0];
    insid = insid.split('-')[0];
    return apiService.get<any>(`/reclaims/getClaimsDataByInvClaimId/${insid}`);
  }
  // >>>>>>>>>>>>>
  async fetchClaims() { return apiService.get('/claims/getAllNewCases') }
  async fetchReimClaims() { return apiService.get('/reclaims/getAllNewCases') }
  async fetchClaimsByTat(tatRange: string) { apiService.get<any>(`/claims/getAllNewCases?tatFilter=${tatRange}`) }
  async fetchReimClaimsByTat(tatRange: string) { apiService.get<any>(`/reclaims/getAllNewCases?tatFilter=${tatRange}`) }


  async getAssignedToSelfCases() {
    apiService.get('/claims/getAllAgencyAssignedToSelf')
  }
  async getAssignedToSelfCasesByTat(tatRange: string) {
    apiService.get(`/claims/getAllAgencyAssignedToSelf?tatFilter=${tatRange}`)
  }
  async getAssignedToSelfCasesRegional() {
    apiService.get('/claims/getAssignedToSelfCases')
  }
  async getAssignedToSelfCasesRegionalByTat(tatRange: string) {
    apiService.get(`/claims/getAssignedToSelfCases?tatFilter=${tatRange}`)
  }
  async getAssignedToSelfCasesReim() {
    apiService.get('/reclaims/getAllAgencyAssignedToSelf')
  }
  async getAssignedToSelfCasesReimByTat(tatRange: string) {
    apiService.get(`/reclaims/getAllAgencyAssignedToSelf?tatFilter=${tatRange}`)
  }
  async getAssignedToSelfCasesReimRegional() {
    apiService.get('/reclaims/getAssignedToSelfCases')
  }
  async getAssignedToSelfCasesReimRegionalByTat(tatRange: string) {
    apiService.get(`/reclaims/getAssignedToSelfCases?tatFilter=${tatRange}`)
  }


  async fetchAllDeniedByRegional() {
    return apiService.get<any>('/claims/getAllDeniedByRegional');
  }
  
  async fetchAllDeniedByRegionalReim() {
    return apiService.get<any>('/reclaims/getAllDeniedByRegional');
  }
  
  async fetchAllCentralAssignedToRegional() {
    return apiService.get<any>('/claims/getAllCentralAssignedToRegional');
  }
  
  async fetchAllCentralAssignedToRegionalReims() {
    return apiService.get<any>('/reclaims/getAllCentralAssignedToRegional');
  }
  
  async fetchAllCentralAssignedToAgency() {
    return apiService.get<any>('/claims/getAllCentralAssignedToAgency');
  }
  
  async fetchAllCentralAssignedToAgencyReims() {
    return apiService.get<any>('/reclaims/getAllCentralAssignedToAgency');
  }
  

        /**
         * Get all claims assigned to self
         */
        // async getAllAssignedToSelf() {
        //   return apiService.get<Claim[]>('/claims/assigned-to-self');
        // }

        // /**
        //  * Get claim by investigation ID
        //  */
        // async getClaimByInvestigationId(investigationId: string) {
        //   return apiService.get<Claim>(`/claims/${investigationId}`);
        // }

        // /**
        //  * Get fresh cases
        //  */
        // async getFreshCases(caseType: string) {
        //   return apiService.get<Claim[]>('/claims/fresh', { caseType });
        // }

        // /**
        //  * Get on field cases
        //  */
        // async getOnFieldCases(caseType: string) {
        //   return apiService.get<Claim[]>('/claims/on-field', { caseType });
        // }

        // /**
        //  * Get completed cases
        //  */
        // async getCompletedCases(caseType: string) {
        //   return apiService.get<Claim[]>('/claims/completed', { caseType });
        // }

        // /**
        //  * Get QC cases
        //  */
        // async getQCCases(caseType: string) {
        //   return apiService.get<Claim[]>('/claims/qc', { caseType });
        // }

        // /**
        //  * Update claim
        //  */
        // async updateClaim(investigationId: string, data: any) {
        //   return apiService.put(`/claims/${investigationId}`, data);
        // }

        // /**
        //  * Assign claim
        //  */
        // async assignClaim(investigationId: string, assignTo: string) {
        //   return apiService.post(`/claims/${investigationId}/assign`, { assignTo });
        // }

        // /**
        //  * Get claim statistics
        //  */
        // async getClaimStatistics() {
        //   return apiService.get<{
        //     totalClaims: number;
        //     totalAmount: number;
        //     avgTAT: number;
        //     byStatus: Record<string, number>;
        //   }>('/claims/statistics');
        // }

        // /**
        //  * Export claims to Excel
        //  */
        // async exportClaims(filters: any) {
        //   return apiService.downloadFile('/claims/export', 'claims-export.xlsx', filters);
        // }
      }

      // Export singleton instance
      export const claimsService = new ClaimsService();

      // Export class
      export default ClaimsService;