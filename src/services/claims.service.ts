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
    return apiService.get<Claim[]>('/claims/getAllFOAssignedTo');
  }
  
  async getAllAssignedToReim() {
    return apiService.get<Claim[]>('/reclaims/getAllFOAssignedTo');
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