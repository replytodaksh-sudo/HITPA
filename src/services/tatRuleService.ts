// File: src/services/tatRuleService.ts
import { apiService } from './api.service';
import { apiUrls } from '../constants/apiConstants';

// ==================== INTERFACES ====================
export interface TatRule {
  tatCode?: string;
  tatName?: string;
  tatDescription?: string;
  codeType?: string;
  duration?: number;
  durationUnit?: string; // days, hours, etc.
  isActive?: boolean;
  createdBy?: string;
  createdDate?: string;
  modifiedBy?: string;
  modifiedDate?: string;
  [key: string]: any;
}

export interface CodeType {
  code?: string;
  name?: string;
  description?: string;
  [key: string]: any;
}

export interface TatRuleResponse {
  statusCode: number;
  message?: string;
  payload?: any;
}

// ==================== SERVICE ====================
export const tatRuleService = {
  /**
   * Get code types for TAT rules
   * @param type - Code type category
   * @returns Promise with code types
   */
  getCodeType: async (type: string): Promise<TatRuleResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.forCodeType}${type}`);
      return response;
    } catch (error) {
      console.error('Error in getCodeType:', error);
      throw error;
    }
  },

  /**
   * Get all TAT rules
   * @returns Promise with array of TAT rules
   */
  getTats: async (): Promise<TatRuleResponse> => {
    try {
      const response = await apiService.get(apiUrls.forTatTable);
      return response;
    } catch (error) {
      console.error('Error in getTats:', error);
      throw error;
    }
  },

  /**
   * Submit new TAT rule
   * @param payload - TAT rule details
   * @returns Promise with API response
   */
  submitTatRule: async (payload: TatRule): Promise<TatRuleResponse> => {
    try {
      const response = await apiService.post(apiUrls.tatRuleSubmit, payload);
      return response;
    } catch (error) {
      console.error('Error in submitTatRule:', error);
      throw error;
    }
  },

  /**
   * Get TAT rule details by code
   * @param tatCode - TAT rule code
   * @returns Promise with TAT rule details
   */
  getTatDetails: async (tatCode: string): Promise<TatRuleResponse> => {
    try {
      const response = await apiService.get(`${apiUrls.forSingleTat}${tatCode}`);
      return response;
    } catch (error) {
      console.error('Error in getTatDetails:', error);
      throw error;
    }
  },

  /**
   * Update existing TAT rule
   * @param tatCode - TAT rule code
   * @param payload - Updated TAT rule details
   * @returns Promise with API response
   */
  updateTat: async (
    tatCode: string,
    payload: TatRule
  ): Promise<TatRuleResponse> => {
    try {
      const response = await apiService.put(
        `${apiUrls.editTat}${tatCode}`,
        payload
      );
      return response;
    } catch (error) {
      console.error('Error in updateTat:', error);
      throw error;
    }
  },

  /**
   * Delete TAT rule
   * @param tatCode - TAT rule code
   * @returns Promise with API response
   */
  deleteTat: async (tatCode: string): Promise<TatRuleResponse> => {
    try {
      const response = await apiService.delete(`${apiUrls.deleteTat}${tatCode}`);
      return response;
    } catch (error) {
      console.error('Error in deleteTat:', error);
      throw error;
    }
  },
};

export default tatRuleService;