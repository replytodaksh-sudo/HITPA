import { apiService } from './api.service';

/**
 * Reimbursement Service
 * Handles all reimbursement claim operations
 */
export const ReimService = {
  /**
   * Get tab details for case update view
   * Returns which verification types should be shown (hospital/insured/employer)
   * @param investigationId - Investigation ID
   * @param tabType - Tab type (e.g., 'caseUpdate', 'acceptAssign')
   */
  getTabDetails: (investigationId: string, tabType: string) =>
    apiService.get(`/reclaims/getSplitCaseTabDetails?invClaimId=${investigationId}&callType=${tabType}`),

  /**
   * Get previous case update data for reimbursement claims
   * @param investigationId - Investigation ID
   */
  caseUpdatePreviousDataReim: (investigationId: string) =>
    apiService.get(`/reactivecase/getReCaseUpdateData?invClaimId=${investigationId}`),

  /**
   * Submit hospital verification data
   * @param investigationId - Investigation ID
   * @param data - Hospital verification data
   */
  submitHospitalVerification: (investigationId: string, data: any) =>
    apiService.post(`/reim/hospital-verification/${investigationId}`, data),

  /**
   * Submit insured verification data
   * @param investigationId - Investigation ID
   * @param data - Insured verification data
   */
  submitInsuredVerification: (investigationId: string, data: any) =>
    apiService.post(`/reim/insured-verification/${investigationId}`, data),

  /**
   * Submit employer verification data
   * @param investigationId - Investigation ID
   * @param data - Employer verification data
   */
  submitEmployerVerification: (investigationId: string, data: any) =>
    apiService.post(`/reim/employer-verification/${investigationId}`, data),

  /**
   * Get hospital verification data
   * @param investigationId - Investigation ID
   */
  getHospitalVerification: (investigationId: string) =>
    apiService.get(`/reim/hospital-verification/${investigationId}`),

  /**
   * Get insured verification data
   * @param investigationId - Investigation ID
   */
  getInsuredVerification: (investigationId: string) =>
    apiService.get(`/reim/insured-verification/${investigationId}`),

  /**
   * Get employer verification data
   * @param investigationId - Investigation ID
   */
  getEmployerVerification: (investigationId: string) =>
    apiService.get(`/reim/employer-verification/${investigationId}`),

  /**
   * Update hospital verification data
   * @param investigationId - Investigation ID
   * @param data - Updated hospital verification data
   */
  updateHospitalVerification: (investigationId: string, data: any) =>
    apiService.put(`/reim/hospital-verification/${investigationId}`, data),

  /**
   * Update insured verification data
   * @param investigationId - Investigation ID
   * @param data - Updated insured verification data
   */
  updateInsuredVerification: (investigationId: string, data: any) =>
    apiService.put(`/reim/insured-verification/${investigationId}`, data),

  /**
   * Update employer verification data
   * @param investigationId - Investigation ID
   * @param data - Updated employer verification data
   */
  updateEmployerVerification: (investigationId: string, data: any) =>
    apiService.put(`/reim/employer-verification/${investigationId}`, data),

  /**
   * Get reimbursement claim details
   * @param investigationId - Investigation ID
   */
  getReimClaimDetails: (investigationId: string) =>
    apiService.get(`/reim/claim-details/${investigationId}`),

  /**
   * Get verification status summary
   * @param investigationId - Investigation ID
   */
  getVerificationStatus: (investigationId: string) =>
    apiService.get(`/reim/verification-status/${investigationId}`),

  /**
   * Submit complete case
   * @param investigationId - Investigation ID
   * @param data - Complete case data
   */
  submitCompleteCase: (investigationId: string, data: any) =>
    apiService.post(`/reim/submit-case/${investigationId}`, data),

  /**
   * Save draft case data
   * @param investigationId - Investigation ID
   * @param data - Draft data
   */
  saveDraft: (investigationId: string, data: any) =>
    apiService.post(`/reim/save-draft/${investigationId}`, data),

  /**
   * Get case assignment details for reimbursement
   * @param investigationId - Investigation ID
   */
  getCaseAssignmentDetails: (investigationId: string) =>
    apiService.get(`/reim/case-assignment/${investigationId}`),

  /**
   * Validate verification data before submission
   * @param investigationId - Investigation ID
   * @param verificationType - Type of verification (hospital/insured/employer)
   * @param data - Data to validate
   */
  validateVerification: (
    investigationId: string,
    verificationType: 'hospital' | 'insured' | 'employer',
    data: any
  ) =>
    apiService.post(`/reim/validate/${verificationType}/${investigationId}`, data),

  /**
   * Get mandatory fields for verification type
   * @param verificationType - Type of verification
   */
  getMandatoryFields: (verificationType: 'hospital' | 'insured' | 'employer') =>
    apiService.get(`/reim/mandatory-fields/${verificationType}`),

  /**
   * Get case history
   * @param investigationId - Investigation ID
   */
  getCaseHistory: (investigationId: string) =>
    apiService.get(`/reim/case-history/${investigationId}`),

  /**
   * Add comment to case
   * @param investigationId - Investigation ID
   * @param comment - Comment text
   * @param verificationType - Type of verification
   */
  addComment: (
    investigationId: string,
    comment: string,
    verificationType: 'hospital' | 'insured' | 'employer'
  ) =>
    apiService.post(`/reim/comment/${investigationId}`, {
      comment,
      verificationType,
    }),

  /**
   * Get all comments for case
   * @param investigationId - Investigation ID
   */
  getComments: (investigationId: string) =>
    apiService.get(`/reim/comments/${investigationId}`),

  /**
   * Request review for verification
   * @param investigationId - Investigation ID
   * @param verificationType - Type of verification
   * @param remarks - Review remarks
   */
  requestReview: (
    investigationId: string,
    verificationType: 'hospital' | 'insured' | 'employer',
    remarks: string
  ) =>
    apiService.post(`/reim/request-review/${investigationId}`, {
      verificationType,
      remarks,
    }),

  /**
   * Approve verification
   * @param investigationId - Investigation ID
   * @param verificationType - Type of verification
   * @param remarks - Approval remarks
   */
  approveVerification: (
    investigationId: string,
    verificationType: 'hospital' | 'insured' | 'employer',
    remarks: string
  ) =>
    apiService.post(`/reim/approve/${investigationId}`, {
      verificationType,
      remarks,
    }),

  /**
   * Reject verification
   * @param investigationId - Investigation ID
   * @param verificationType - Type of verification
   * @param reasons - Rejection reasons
   * @param remarks - Rejection remarks
   */
  rejectVerification: (
    investigationId: string,
    verificationType: 'hospital' | 'insured' | 'employer',
    reasons: string[],
    remarks: string
  ) =>
    apiService.post(`/reim/reject/${investigationId}`, {
      verificationType,
      reasons,
      remarks,
    }),

  /**
   * Get case statistics
   * @param investigationId - Investigation ID
   */
  getCaseStats: (investigationId: string) =>
    apiService.get(`/reim/stats/${investigationId}`),
};

export default ReimService;