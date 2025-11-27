// File: src/services/reim-case-update.service.ts

import { apiService } from './api.service';
import { apiurls } from '../constants/apiConstants';

class ReimCaseUpdateService {
  /**
   * Add employer verification
   */
  async addEmployeerVerify(payload: any, investigationId: string) {
    const response = await apiService.post(
      `${apiurls.employerVerification}${investigationId}`,
      payload
    );
    return response;
  }

  /**
   * Get employer verification data
   */
  async getEmployerVerification(investigationId: string) {
    const response = await apiService.get(
      `${apiurls.employerVerification}${investigationId}`
    );
    return response;
  }

  /**
   * Add hospital verification
   */
  async addHospitalVerify(payload: any, investigationId: string) {
    const response = await apiService.post(
      `${apiurls.hospitalVerification}${investigationId}`,
      payload
    );
    return response;
  }

  /**
   * Get hospital verification data
   */
  async getHospitalVerification(investigationId: string) {
    const response = await apiService.get(
      `${apiurls.hospitalVerification}${investigationId}`
    );
    return response;
  }

  /**
   * Add insured verification
   */
  async addInsuredVerify(payload: any, investigationId: string) {
    const response = await apiService.post(
      `${apiurls.insuredVerification}${investigationId}`,
      payload
    );
    return response;
  }

  /**
   * Get insured verification data
   */
  async getInsuredVerification(investigationId: string) {
    const response = await apiService.get(
      `${apiurls.insuredVerification}${investigationId}`
    );
    return response;
  }

  /**
   * Submit final reimbursement case update
   */
  async submitFinalReimUpdate(payload: any, investigationId: string) {
    const response = await apiService.post(
      `${apiurls.reimFinalSubmit}${investigationId}`,
      payload
    );
    return response;
  }

  /**
   * Save reimbursement case update as draft
   */
  async saveDraftReimUpdate(payload: any, investigationId: string) {
    const response = await apiService.post(
      `${apiurls.reimDraftSave}${investigationId}`,
      payload
    );
    return response;
  }
}

export const reimCaseUpdateService = new ReimCaseUpdateService();