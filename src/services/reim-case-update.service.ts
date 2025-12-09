// File: src/services/reim-case-update.service.ts

import { apiService } from './api.service';
import { apiUrls } from '../constants/apiConstants';

class ReimcaseUpdateService {
  /**
   * Add employer verification
   */
  async addEmployeerVerify(payload: any, investigationId: string) {
    const response = await apiService.post(
      `${apiUrls.employerVerification}${investigationId}`,
      payload
    );
    return response;
  }

  /**
   * Get employer verification data
   */
  async getEmployerVerification(investigationId: string) {
    const response = await apiService.get(
      `${apiUrls.employerVerification}${investigationId}`
    );
    return response;
  }

  /**
   * Add hospital verification
   */
  async addHospitalVerify(payload: any, investigationId: string) {
    const response = await apiService.post(
      `${apiUrls.hospitalVerification}${investigationId}`,
      payload
    );
    return response;
  }

  /**
   * Get hospital verification data
   */
  async getHospitalVerification(investigationId: string) {
    const response = await apiService.get(
      `${apiUrls.hospitalVerification}${investigationId}`
    );
    return response;
  }

  /**
   * Add insured verification
   */
  async addInsuredVerify(payload: any, investigationId: string) {
    const response = await apiService.post(
      `${apiUrls.insuredVerification}${investigationId}`,
      payload
    );
    return response;
  }

  /**
   * Get insured verification data
   */
  async getInsuredVerification(investigationId: string) {
    const response = await apiService.get(
      `${apiUrls.insuredVerification}${investigationId}`
    );
    return response;
  }

  /**
   * Submit final reimbursement case update
   */
  async submitFinalReimUpdate(payload: any, investigationId: string) {
    const response = await apiService.post(
      `${apiUrls.reimFinalSubmit}${investigationId}`,
      payload
    );
    return response;
  }

  /**
   * Save reimbursement case update as draft
   */
  async saveDraftReimUpdate(payload: any, investigationId: string) {
    const response = await apiService.post(
      `${apiUrls.reimDraftSave}${investigationId}`,
      payload
    );
    return response;
  }
}

export const reimcaseUpdateService = new ReimcaseUpdateService();