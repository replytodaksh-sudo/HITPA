// File: src/services/caseAssignmentService.ts
import { apiService } from './api.service';
import { apiUrls } from '../constants/apiConstants';

// ==================== INTERFACES ====================
export interface CaseAssignment {
  ruleId?: string;
  ruleName?: string;
  ruleCode?: string;
  agencyCode?: string;
  agencyName?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  claimType?: string;
  priority?: number;
  isActive?: boolean;
  createdBy?: string;
  createdDate?: string;
  modifiedBy?: string;
  modifiedDate?: string;
  [key: string]: any;
}

export interface CaseAssignmentResponse {
  statusCode: number;
  message?: string;
  payload?: any;
}

// ==================== SERVICE ====================
export const caseAssignmentService = {
  /**
   * Add new case assignment rule
   * @param caseAssignmentModel - Case assignment rule details
   * @returns Promise with API response
   */
  addCaseAssignmentRule: async (
    caseAssignmentModel: CaseAssignment
  ): Promise<CaseAssignmentResponse> => {
    try {
      const response = await apiService.post(
        apiUrls.addRuleAssign,
        caseAssignmentModel
      );
      return response;
    } catch (error) {
      console.error('Error in addCaseAssignmentRule:', error);
      throw error;
    }
  },

  /**
   * Get all case assignment rules
   * @returns Promise with array of case assignment rules
   */
  getCaseAssignmentRule: async (): Promise<CaseAssignmentResponse> => {
    try {
      const response = await apiService.get(apiUrls.getRuleAssign);
      return response;
    } catch (error) {
      console.error('Error in getCaseAssignmentRule:', error);
      throw error;
    }
  },

  /**
   * Get assigned rule by code/ID
   * @param id - Rule code or ID
   * @returns Promise with rule details
   */
  getAssignedRuleByCode: async (
    id: string
  ): Promise<CaseAssignmentResponse> => {
    try {
      const response = await apiService.get(
        `${apiUrls.getAssignedRuleByCode}${id}`
      );
      return response;
    } catch (error) {
      console.error('Error in getAssignedRuleByCode:', error);
      throw error;
    }
  },
};

export default caseAssignmentService;