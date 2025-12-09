// import { apiService } from "./api.service";

// export const agencyQcUpdateService = {
//     /**
//      * Get QC update data for a specific tab
//      */
//     getQCUpdateData: async (investigationId: string, tabName: string) => {
//         return apiService.get(`/claimsQC/getClaimQCUpdateData?invClaimId=${investigationId.split('-')[0]}?tabName=${tabName}`);
//     },

//     /**
//      * Save agency QC update
//      */
//     saveAgencyQC: async (investigationId: string, data: any) => {
//         return apiService.post(`/agency-qc/${investigationId}`, data);
//     },

//     /**
//      * Submit agency QC update
//      */
//     submitAgencyQC: async (investigationId: string, data: any) => {
//         return apiService.post(`/agency-qc/${investigationId}/submit`, data);
//     },

//     /**
//      * Get agency QC recommendation
//      */
//     getRecommendation: async (investigationId: string) => {
//         return apiService.get(`/agency-qc/${investigationId}/recommendation`);
//     },

//     getReClaimQCData: async (investigationId: string, tabName: string) => {
//         return apiService.get(`/claimsQC/getReClaimQCUpdateData?invClaimId=${investigationId}&tabName=${tabName}`);
//     },
// };


// File: src/services/agencyQcUpdateService.ts
import { apiService } from './api.service';
import { apiUrls } from '../constants/apiConstants';

// ==================== INTERFACES ====================
export interface AgencyQCUpdate {
  investigationId?: string;
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
  tabName?: string;
  [key: string]: any;
}

export interface QCUpdateResponse {
  statusCode: number;
  message?: string;
  payload?: any;
}

// ==================== SERVICE ====================
export const agencyQcUpdateService = {
  /**
   * Add QC update for cashless case
   * @param agencyQC - Agency QC update details
   * @param invId - Investigation ID (will be cleaned)
   * @returns Promise with API response
   */
  addQCUpdate: async (
    agencyQC: AgencyQCUpdate,
    invId: string
  ): Promise<QCUpdateResponse> => {
    try {
      // Clean investigation ID (remove suffix after dash)
      const cleanInvId = invId.split('-')[0];
      
      const response = await apiService.post(
        `${apiUrls.agencyQCUpdates}${cleanInvId}`,
        agencyQC
      );
      return response;
    } catch (error) {
      console.error('Error in addQCUpdate:', error);
      throw error;
    }
  },

  /**
   * Add QC update for reimbursement case
   * @param agencyQC - Agency QC update details
   * @param invId - Investigation ID (will be cleaned)
   * @returns Promise with API response
   */
  addQCUpdateReim: async (
    agencyQC: AgencyQCUpdate,
    invId: string
  ): Promise<QCUpdateResponse> => {
    try {
      // Clean investigation ID (remove suffix after dash)
      const cleanInvId = invId.split('-')[0];
      
      const response = await apiService.post(
        `${apiUrls.agencyQCUpdatesReim}${cleanInvId}`,
        agencyQC
      );
      return response;
    } catch (error) {
      console.error('Error in addQCUpdateReim:', error);
      throw error;
    }
  },

  /**
   * Get QC update data for a specific tab
   * @param invId - Investigation ID (will be cleaned)
   * @param tabName - Tab name to fetch data for
   * @returns Promise with QC update data
   */
  getQCUpdateData: async (
    invId: string,
    tabName: string
  ): Promise<QCUpdateResponse> => {
    try {
      // Clean investigation ID (remove suffix after dash)
      const cleanInvId = invId.split('-')[0];
      
      const response = await apiService.get(
        `${apiUrls.getAgencyQCUpdateData}${cleanInvId}&tabName=${tabName}`
      );
      return response;
    } catch (error) {
      console.error('Error in getQCUpdateData:', error);
      throw error;
    }
  },

  /**
   * Get reclaim QC update data for a specific tab
   * @param invId - Investigation ID (will be cleaned)
   * @param tabName - Tab name to fetch data for
   * @returns Promise with reclaim QC update data
   */
  getReClaimQCData: async (
    invId: string,
    tabName: string
  ): Promise<QCUpdateResponse> => {
    try {
      // Clean investigation ID (remove suffix after dash)
      const cleanInvId = invId.split('-')[0];
      
      const response = await apiService.get(
        `${apiUrls.getReclaimQCUpdateData}${cleanInvId}&tabName=${tabName}`
      );
      return response;
    } catch (error) {
      console.error('Error in getReClaimQCData:', error);
      throw error;
    }
  },
};

export default agencyQcUpdateService;