// import { apiService } from './api.service';


// export interface QCUpdateField {
//   fieldName: string;
//   oldValue: string;
//   newValue: string;
//   reason: string;
// }

// export interface QCObservation {
//   observationType: string;
//   findings: string;
//   recommendations: string;
// }

// export interface QCChecklist {
//   checklistItemId: string;
//   status: 'compliant' | 'non-compliant' | 'na';
//   remarks: string;
// }

// export interface GroundOfRejection {
//   code: string;
//   description: string;
//   category: string;
// }

// export interface RecommendationToCentralQC {
//   policyCancellation: boolean | null;
//   hospitalBlacklisted: boolean | null;
//   hospitalDepanelled: boolean | null;
//   hospitalCautionTagged: boolean | null;
//   insuredBlacklisted: boolean | null;
//   insuredCautionTagged: boolean | null;
//   policyFraud: boolean | null;
//   treatingDoctorFraud: boolean | null;
//   pathologistFraud: boolean | null;
//   chemistFraud: boolean | null;
//   pathologyLabFraud: boolean | null;
//   corporateFraud: boolean | null;
//   legalAction: boolean | null;
// }

// export interface QCSubmitData {
//   // Main QC Observations
//   qcObservations: string;
//   finalDecision?: string;

//   // Queries and Remarks
//   queryRM?: string;
//   queryCM?: string;
//   centralQuery?: string;
//   payableRemarks?: string;
//   lowminiremarks?: string;
//   queryRemark?: string;
//   queryTxt?: string;
//   repadiateRemarks?: string;
//   suspectedCaseFindings?: string;

//   // Ground of Rejection
//   groundOfRejection?: string[];
//   groundOfRejectionFraud?: string[];
//   groundOfRejectionExclusion?: string[];
//   groundOfRejectionMisrepresentation?: string[];

//   // Recommendation to Central QC
//   recommendationToCentralQC?: RecommendationToCentralQC;

//   // Reassignment
//   agencyCode?: string;
//   userCodeForRegionalManager?: string;
//   prevInvestigatorReport?: boolean;
//   acceptInstruction?: string;
//   documentsCodes?: string[];

//   // Questions
//   selectedForInseredQues?: string[];
//   customForInsuredQuestionList?: any[];
//   selectedTreatingdctrInseredQues?: string[];
//   customForTreatingDoctorQuestionList?: any[];

//   // Metadata
//   qcUpdateID?: string;
//   investigationId: string;
//   claimType?: string;
// }

// /**
//  * QC Update Service
//  * Handles Quality Check (QC) update operations for investigations
//  */
// export const QCUpdateService = {
//   /**
//    * Get QC update preview for cashless claims
//    * @param investigationId - Investigation ID
//    * @param tabName - Tab name (regionalQC or centralQC)
//    */
//   qcUpdatePreview: (investigationId: string, tabName: string) =>
//     apiService.get(`/qcupdate/getQCUpdateData?invClaimId=${investigationId}&tabName=${tabName}`),

//   /**
//    * Get QC update preview for reimbursement claims
//    * @param investigationId - Investigation ID
//    * @param tabName - Tab name (regionalQC or centralQC)
//    */
//   qcUpdatePreviewReim: (investigationId: string, tabName: string) =>
//     apiService.get(`/qcupdate/getReQCUpdateData?invClaimId=${investigationId}&tabName=${tabName}`),

//   /**
//    * Submit QC update fields
//    * @param investigationId - Investigation ID
//    * @param data - QC update field data
//    * @param tabName - Tab name (regionalQC or centralQC)
//    */
//   submitQcUpdateFields: (investigationId: string, data: any, tabName: string) =>
//     apiService.post(`/qc-update/fields/${investigationId}/${tabName}`, data),

//   /**
//    * Submit QC observations
//    * @param investigationId - Investigation ID
//    * @param data - QC observation data
//    * @param tabName - Tab name (regionalQC or centralQC)
//    */
//   submitQcObservations: (investigationId: string, data: any, tabName: string) =>
//     apiService.post(`/qc-update/observations/${investigationId}/${tabName}`, data),

//   /**
//    * Get QC update fields
//    * @param investigationId - Investigation ID
//    * @param qcUpdateId - QC Update ID
//    */
//   getQcUpdateFields: (investigationId: string, qcUpdateId: string) =>
//     apiService.get(`/qc-update/fields/${investigationId}/${qcUpdateId}`),

//   /**
//    * Get QC observations
//    * @param investigationId - Investigation ID
//    * @param qcUpdateId - QC Update ID
//    */
//   getQcObservations: (investigationId: string, qcUpdateId: string) =>
//     apiService.get(`/qc-update/observations/${investigationId}/${qcUpdateId}`),

//   /**
//    * Update QC fields
//    * @param investigationId - Investigation ID
//    * @param qcUpdateId - QC Update ID
//    * @param data - Updated field data
//    */
//   updateQcFields: (investigationId: string, qcUpdateId: string, data: any) =>
//     apiService.put(`/qc-update/fields/${investigationId}/${qcUpdateId}`, data),

//   /**
//    * Update QC observations
//    * @param investigationId - Investigation ID
//    * @param qcUpdateId - QC Update ID
//    * @param data - Updated observation data
//    */
//   updateQcObservations: (investigationId: string, qcUpdateId: string, data: any) =>
//     apiService.put(`/qc-update/observations/${investigationId}/${qcUpdateId}`, data),

//   /**
//    * Get QC history
//    * @param investigationId - Investigation ID
//    */
//   getQcHistory: (investigationId: string) =>
//     apiService.get(`/qc-update/history/${investigationId}`),

//   /**
//    * Approve QC update
//    * @param investigationId - Investigation ID
//    * @param qcUpdateId - QC Update ID
//    * @param remarks - Approval remarks
//    */
//   approveQcUpdate: (investigationId: string, qcUpdateId: string, remarks: string) =>
//     apiService.post(`/qc-update/approve/${investigationId}/${qcUpdateId}`, { remarks }),

//   /**
//    * Reject QC update
//    * @param investigationId - Investigation ID
//    * @param qcUpdateId - QC Update ID
//    * @param reasons - Rejection reasons
//    * @param remarks - Rejection remarks
//    */
//   rejectQcUpdate: (
//     investigationId: string,
//     qcUpdateId: string,
//     reasons: string[],
//     remarks: string
//   ) =>
//     apiService.post(`/qc-update/reject/${investigationId}/${qcUpdateId}`, {
//       reasons,
//       remarks,
//     }),

//   /**
//    * Send back for rework
//    * @param investigationId - Investigation ID
//    * @param qcUpdateId - QC Update ID
//    * @param reason - Rework reason
//    * @param remarks - Rework remarks
//    */
//   sendBackForRework: (
//     investigationId: string,
//     qcUpdateId: string,
//     reason: string,
//     remarks: string
//   ) =>
//     apiService.post(`/qc-update/rework/${investigationId}/${qcUpdateId}`, {
//       reason,
//       remarks,
//     }),

//   /**
//    * Get QC checklist
//    * @param investigationId - Investigation ID
//    * @param claimType - Claim type (cashless/reim)
//    */
//   getQcChecklist: (investigationId: string, claimType: 'cashless' | 'reim') =>
//     apiService.get(`/qc-update/checklist/${investigationId}/${claimType}`),

//   /**
//    * Submit QC checklist
//    * @param investigationId - Investigation ID
//    * @param data - Checklist data
//    */
//   submitQcChecklist: (investigationId: string, data: any) =>
//     apiService.post(`/qc-update/checklist/${investigationId}`, data),

//   /**
//    * Add QC comment
//    * @param investigationId - Investigation ID
//    * @param qcUpdateId - QC Update ID
//    * @param comment - Comment text
//    * @param isInternal - Whether comment is internal
//    */
//   addQcComment: (
//     investigationId: string,
//     qcUpdateId: string,
//     comment: string,
//     isInternal: boolean = false
//   ) =>
//     apiService.post(`/qc-update/comment/${investigationId}/${qcUpdateId}`, {
//       comment,
//       isInternal,
//     }),

//   getRegQCUpdateData: (
//     invId: string,
//     role: any,
//   ) =>
//     apiService.post(`/qcupdate/addQCUpdate?investigationId=${invId}&role=${role}`),

//   addQCUpdate: (
//     qcUpdateModel: any,
//     invId: string,
//   ) =>
//     apiService.post(`/qcupdate/addQCUpdate?investigationId=${invId}`, qcUpdateModel),

//   /**
//    * Get QC comments
//    * @param investigationId - Investigation ID
//    * @param qcUpdateId - QC Update ID
//    */
//   getQcComments: (investigationId: string, qcUpdateId: string) =>
//     apiService.get(`/qc-update/comments/${investigationId}/${qcUpdateId}`),

//   /**
//    * Get QC statistics for investigation
//    * @param investigationId - Investigation ID
//    */
//   getQcStats: (investigationId: string) =>
//     apiService.get(`/qc-update/stats/${investigationId}`),

//   /**
//    * Get QC dashboard data
//    * @param filters - Optional filters (dateRange, status, etc.)
//    */
//   getQcDashboard: (filters?: {
//     fromDate?: string;
//     toDate?: string;
//     status?: string;
//     teamType?: 'regional' | 'central';
//   }) =>
//     apiService.get('/qc-update/dashboard', { params: filters }),

//   /**
//    * Validate QC data before submission
//    * @param investigationId - Investigation ID
//    * @param data - Data to validate
//    * @param updateType - Type of update (fields/observations)
//    */
//   validateQcData: (
//     investigationId: string,
//     data: any,
//     updateType: 'fields' | 'observations'
//   ) =>
//     apiService.post(`/qc-update/validate/${investigationId}/${updateType}`, data),

//   /**
//    * Get mandatory QC fields
//    * @param claimType - Claim type
//    * @param updateType - Type of update (fields/observations)
//    */
//   getMandatoryQcFields: (
//     claimType: 'cashless' | 'reim',
//     updateType: 'fields' | 'observations'
//   ) =>
//     apiService.get(`/qc-update/mandatory-fields/${claimType}/${updateType}`),

//   /**
//    * Lock QC update for editing
//    * @param investigationId - Investigation ID
//    * @param qcUpdateId - QC Update ID
//    */
//   lockQcUpdate: (investigationId: string, qcUpdateId: string) =>
//     apiService.post(`/qc-update/lock/${investigationId}/${qcUpdateId}`),

//   qcUpdateFinalReim: (invId: string, qcupdateId: string, acceptAssignId: string) =>
//     apiService.post(`/qcupdate/reqcUpdateFinal?investigationId=${invId.split('-')[0]}&qcUpdateID=${qcupdateId}&acceptAssignId=${acceptAssignId}`),

//   qcUpdateFinal: (invId: string, qcupdateId: string) =>
//     apiService.post(`/qcupdate/qcUpdateFinal?investigationId=${invId.split('-')[0]}&qcUpdateID=${qcupdateId}`),

//   /**
//    * Unlock QC update
//    * @param investigationId - Investigation ID
//    * @param qcUpdateId - QC Update ID
//    */
//   unlockQcUpdate: (investigationId: string, qcUpdateId: string) =>
//     apiService.post(`/qc-update/unlock/${investigationId}/${qcUpdateId}`),

//   /**
//    * Get QC template fields
//    * @param claimType - Claim type
//    * @param teamType - Team type (regional/central)
//    */
//   getQcTemplateFields: (
//     claimType: 'cashless' | 'reim',
//     teamType: 'regional' | 'central'
//   ) =>
//     apiService.get(`/qc-update/template/${claimType}/${teamType}`),

//   /**
//    * Submit bulk QC updates
//    * @param updates - Array of QC updates
//    */
//   submitBulkQcUpdates: (updates: Array<{ investigationId: string; data: any }>) =>
//     apiService.post('/qc-update/bulk-submit', { updates }),


//   /**
//    * Get Ground of Rejection - Main
//    */
//   getGroundOfRejection: async () => {
//     const response = await apiService.get('/dropdowns/ground-of-rejection');
//     return response;
//   },

//   /**
//    * Get Ground of Rejection - Fraud
//    */
//   getGroundOfRejectionFraud: async () => {
//     const response = await apiService.get('/dropdowns/ground-of-rejection-fraud');
//     return response;
//   },

//   /**
//    * Get Ground of Rejection - Exclusion
//    */
//   getGroundOfRejectionExclusion: async () => {
//     const response = await apiService.get('/dropdowns/ground-of-rejection-exclusion');
//     return response;
//   },

//   /**
//    * Get Ground of Rejection - Misrepresentation
//    */
//   getGroundOfRejectionMisrepresentation: async () => {
//     const response = await apiService.get('/dropdowns/ground-of-rejection-misrepresentation');
//     return response;
//   },

//   /**
//    * Get Pending QC Updates
//    */
//   getPendingQcUpdates: async (page: number = 1, limit: number = 10) => {
//     const response = await apiService.get(
//       `/qc-update/pending?page=${page}&limit=${limit}`
//     );
//     return response;
//   },

//   /**
//    * Get Completed QC Updates
//    */
//   getCompletedQcUpdates: async (page: number = 1, limit: number = 10) => {
//     const response = await apiService.get(
//       `/qc-update/completed?page=${page}&limit=${limit}`
//     );
//     return response;
//   },

//   /**
//    * Search QC Updates
//    */
//   searchQcUpdates: async (searchTerm: string) => {
//     const response = await apiService.get(
//       `/qc-update/search?q=${encodeURIComponent(searchTerm)}`
//     );
//     return response;
//   },

//   /**
//    * Reassign from QC
//    */
//   reassignFromQC: async (data: {
//     investigationId: string;
//     agencyCode?: string;
//     userCode?: string;
//     prevInvestigatorReport?: boolean;
//     instructions?: string;
//     documentsCodes?: string[];
//     selectedForInseredQues?: string[];
//     customForInsuredQuestionList?: any[];
//     selectedTreatingdctrInseredQues?: string[];
//     customForTreatingDoctorQuestionList?: any[];
//   }) => {
//     const response = await apiService.post('/qc-update/reassign', data);
//     return response;
//   },

//   /**
//    * Submit Recommendation to Central QC
//    */
//   submitRecommendationToCentralQC: async (
//     investigationId: string,
//     recommendations: RecommendationToCentralQC
//   ) => {
//     const response = await apiService.post(
//       `/qc-update/${investigationId}/recommendations`,
//       recommendations
//     );
//     return response;
//   },

//   /**
//    * Get Recommendation to Central QC
//    */
//   getRecommendationToCentralQC: async (investigationId: string) => {
//     const response = await apiService.get(
//       `/qc-update/${investigationId}/recommendations`
//     );
//     return response;
//   },

//   /**
//    * Export QC Report
//    */
//   exportQcReport: async (investigationId: string, format: 'pdf' | 'excel') => {
//     const response = await apiService.get(
//       `/qc-update/${investigationId}/export?format=${format}`,
//       { responseType: 'blob' }
//     );
//     return response;
//   },

//   /**
//    * Bulk QC Update
//    */
//   bulkQcUpdate: async (updates: Array<{ investigationId: string; data: any }>) => {
//     const response = await apiService.post('/qc-update/bulk', { updates });
//     return response;
//   },

//   /**
//    * Get QC Performance Metrics
//   */
//   getQcPerformanceMetrics: async (userId: string, startDate: string, endDate: string) => {
//     const response = await apiService.get(
//       `/qc-update/performance/${userId}?startDate=${startDate}&endDate=${endDate}`
//     );
//     return response;
//   },

//   addQCObservations: async (payload: any, invId: string, docsUpload: any) => {
//     const response = await apiService.post(`qcupdate/addQCUpdateObservation?investigationId=${invId.split('-')[0]}&documentIds=${docsUpload}`, payload);
//     return response;
//   },

//   getGroundDetails: async () => {
//     const response = await apiService.get(
//       `qcupdate/getGroundDetails`
//     );
//     return response;
//   },
//   getGroundFraudDetails: async () => {
//     const response = await apiService.get(
//       `qcupdate/getGroundFraudDetails`
//     );
//     return response;
//   },
//   getGroundExclusionDetails: async () => {
//     const response = await apiService.get(
//       `qcupdate/getGroundExclusionDetails`
//     );
//     return response;
//   },
//   getMisrepresentationFraudDetails: async () => {
//     const response = await apiService.get(
//       `qcupdate/getMisrepresentationFraudDetails`
//     );
//     return response;
//   },
// };

// export default QCUpdateService;


// File: src/services/qcUpdateService.ts
import { apiService } from './api.service';
import { apiUrls } from '../constants/apiConstants';

// ==================== INTERFACES ====================
export interface QCUpdate {
  investigationId?: string;
  qcUpdateID?: string;
  billInflation?: boolean;
  billInflationDetails?: string;
  stayConfirmed?: boolean;
  stayConfirmedDetails?: string;
  pedNoted?: boolean;
  pedNotedDetails?: string;
  permanentExclusions?: boolean;
  permanentExclusionsDetails?: string;
  allopathyQualification?: boolean;
  allopathyQualificationDetails?: string;
  discrepanciesObserved?: boolean;
  discrepanciesObservedDetails?: string;
  hospitalizationJustified?: boolean;
  hospitalizationJustifiedDetails?: string;
  hospitalCriteria?: boolean;
  hospitalCriteriaDetails?: string;
  firstYearExclusions?: boolean;
  firstYearExclusionsDetails?: string;
  waitingPeriod?: boolean;
  waitingPeriodDetails?: string;
  ageCrossCheck?: boolean;
  ageCrossCheckDetails?: string;
  convertedToFullCase?: boolean;
  convertedToFullCaseDetails?: string;
  [key: string]: any;
}

export interface QCUpdateObservations {
  investigationId?: string;
  observations?: string;
  groundForRejection?: string;
  groundForFraud?: string;
  groundForExclusion?: string;
  misrepresentationFraud?: string;
  recommendation?: string;
  [key: string]: any;
}

export interface QCUpdateResponse {
  statusCode: number;
  message?: string;
  payload?: any;
}

// ==================== SERVICE ====================
export const QCUpdateService = {
  /**
   * Add QC update (cashless)
   * @param qcUpdateModel - QC update details
   * @param invId - Investigation ID (will be cleaned)
   * @returns Promise with API response
   */
  addQCUpdate: async (
    qcUpdateModel: QCUpdate,
    invId: string
  ): Promise<QCUpdateResponse> => {
    try {
      // Clean investigation ID (remove suffix after dash)
      const cleanInvId = invId.split('-')[0];

      const response = await apiService.post(
        `${apiUrls.qcUpdate}${cleanInvId}`,
        qcUpdateModel
      );
      return response;
    } catch (error) {
      console.error('Error in addQCUpdate:', error);
      throw error;
    }
  },

  /**
   * Add QC vendor feedback (cashless)
   * @param payload - Vendor feedback data
   * @param invId - Investigation ID (will be cleaned)
   * @returns Promise with API response
   */
  addQCVendorFeedback: async (
    payload: any,
    invId: string
  ): Promise<QCUpdateResponse> => {
    try {
      // Clean investigation ID (remove suffix after dash)
      const cleanInvId = invId.split('-')[0];

      const response = await apiService.post(
        `${apiUrls.qcUpdateVEndorFeedback}${cleanInvId}`,
        payload
      );
      return response;
    } catch (error) {
      console.error('Error in addQCVendorFeedback:', error);
      throw error;
    }
  },

  /**
   * Add QC vendor feedback (reimbursement)
   * @param payload - Vendor feedback data
   * @param invId - Investigation ID (will be cleaned)
   * @returns Promise with API response
   */
  addQCVendorFeedbackReim: async (
    payload: any,
    invId: string
  ): Promise<QCUpdateResponse> => {
    try {
      // Clean investigation ID (remove suffix after dash)
      const cleanInvId = invId.split('-')[0];

      const response = await apiService.post(
        `${apiUrls.qcUpdateVEndorFeedbackReim}${cleanInvId}`,
        payload
      );
      return response;
    } catch (error) {
      console.error('Error in addQCVendorFeedbackReim:', error);
      throw error;
    }
  },

  /**
   * Add QC observations with document upload
   * @param payload - Observations data
   * @param invId - Investigation ID (will be cleaned)
   * @param docsUpload - Document IDs (comma-separated string or array)
   * @returns Promise with API response
   */
  addQCObservations: async (
    payload: QCUpdateObservations,
    invId: string,
    docsUpload: string | string[]
  ): Promise<QCUpdateResponse> => {
    try {
      // Clean investigation ID (remove suffix after dash)
      const cleanInvId = invId.split('-')[0];

      // Convert array to comma-separated string if needed
      const docIds = Array.isArray(docsUpload)
        ? docsUpload.join(',')
        : docsUpload;

      const response = await apiService.post(
        `${apiUrls.qcUpdateObservations}${cleanInvId}&documentIds=${docIds}`,
        payload
      );
      return response;
    } catch (error) {
      console.error('Error in addQCObservations:', error);
      throw error;
    }
  },

  /**
   * Submit final QC update (cashless)
   * @param invId - Investigation ID (will be cleaned)
   * @param qcUpdateId - QC update ID
   * @returns Promise with API response
   */
  qcUpdateFinal: async (
    invId: string,
    qcUpdateId: string
  ): Promise<QCUpdateResponse> => {
    try {
      // Clean investigation ID (remove suffix after dash)
      const cleanInvId = invId.split('-')[0];

      const response = await apiService.post(
        `${apiUrls.qcUpdateFinal}${cleanInvId}&qcUpdateID=${qcUpdateId}`,
        {}
      );
      return response;
    } catch (error) {
      console.error('Error in qcUpdateFinal:', error);
      throw error;
    }
  },

  /**
   * Submit final QC update (reimbursement)
   * @param invId - Investigation ID (will be cleaned)
   * @param qcUpdateId - QC update ID
   * @param acceptAssignId - Accept assign ID
   * @returns Promise with API response
   */
  qcUpdateFinalReim: async (
    invId: string,
    qcUpdateId: string,
    acceptAssignId: string
  ): Promise<QCUpdateResponse> => {
    try {
      // Clean investigation ID (remove suffix after dash)
      const cleanInvId = invId.split('-')[0];

      const response = await apiService.post(
        `${apiUrls.qcUpdateFinalReim}${cleanInvId}&qcUpdateID=${qcUpdateId}&acceptAssignId=${acceptAssignId}`,
        {}
      );
      return response;
    } catch (error) {
      console.error('Error in qcUpdateFinalReim:', error);
      throw error;
    }
  },

  /**
   * Get QC update preview (cashless)
   * @param invId - Investigation ID (will be cleaned)
   * @param tabName - Tab name to fetch
   * @returns Promise with preview data
   */
  qcUpdatePreview: async (
    invId: string,
    tabName: string
  ): Promise<QCUpdateResponse> => {
    try {
      // Clean investigation ID (remove suffix after dash)
      const cleanInvId = invId.split('-')[0];

      const response = await apiService.get(
        `${apiUrls.qcupdateDetails}${cleanInvId}&tabName=${tabName}`
      );
      return response;
    } catch (error) {
      console.error('Error in qcUpdatePreview:', error);
      throw error;
    }
  },

  /**
   * Get QC update preview (reimbursement)
   * @param invId - Investigation ID (will be cleaned)
   * @param tabName - Tab name to fetch
   * @returns Promise with preview data
   */
  qcUpdatePreviewReim: async (
    invId: string,
    tabName: string
  ): Promise<QCUpdateResponse> => {
    try {
      // Clean investigation ID (remove suffix after dash)
      const cleanInvId = invId.split('-')[0];

      const response = await apiService.get(
        `${apiUrls.qcupdateDetailsReim}${cleanInvId}&tabName=${tabName}`
      );
      return response;
    } catch (error) {
      console.error('Error in qcUpdatePreviewReim:', error);
      throw error;
    }
  },

  /**
   * Get QC update preview by QC update ID
   * @param id - QC update ID
   * @returns Promise with preview data
   */
  qcUpdatePreviewWithID: async (id: string): Promise<QCUpdateResponse> => {
    try {
      const response = await apiService.get(
        `${apiUrls.qcUpdateDetailsWithId}${id}`
      );
      return response;
    } catch (error) {
      console.error('Error in qcUpdatePreviewWithID:', error);
      throw error;
    }
  },

  /**
   * Get ground details for rejection
   * @returns Promise with ground details
   */
  getGroundDetails: async (): Promise<QCUpdateResponse> => {
    try {
      const response = await apiService.get(apiUrls.getGroundDetails);
      return response;
    } catch (error) {
      console.error('Error in getGroundDetails:', error);
      throw error;
    }
  },

  /**
   * Get ground fraud details
   * @returns Promise with fraud ground details
   */
  getGroundFraudDetails: async (): Promise<QCUpdateResponse> => {
    try {
      const response = await apiService.get(apiUrls.getGroundFraudDetails);
      return response;
    } catch (error) {
      console.error('Error in getGroundFraudDetails:', error);
      throw error;
    }
  },

  /**
   * Get ground exclusion details
   * @returns Promise with exclusion ground details
   */
  getGroundExclusionDetails: async (): Promise<QCUpdateResponse> => {
    try {
      const response = await apiService.get(apiUrls.getGroundExclusionDetails);
      return response;
    } catch (error) {
      console.error('Error in getGroundExclusionDetails:', error);
      throw error;
    }
  },

  /**
   * Get misrepresentation fraud details
   * @returns Promise with misrepresentation fraud details
   */
  getMisrepresentationFraudDetails: async (): Promise<QCUpdateResponse> => {
    try {
      const response = await apiService.get(
        apiUrls.getMisrepresentationFraudDetails
      );
      return response;
    } catch (error) {
      console.error('Error in getMisrepresentationFraudDetails:', error);
      throw error;
    }
  },

  getRegQCUpdateData: async (id: string, role: string): Promise<QCUpdateResponse> => {
    try {
      const response = await apiService.get(
        `${apiUrls.getRegQCUpdateData}${id}&role=${role}`
      );
      return response;
      return response;
    } catch (error) {
      console.error('Error in getMisrepresentationFraudDetails:', error);
      throw error;
    }
  },

};

export default QCUpdateService;