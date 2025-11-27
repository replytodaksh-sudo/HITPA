import { apiService } from './api.service';
import { apiurls } from '../constants/apiConstants';

interface CaseInfoResponse {
  statusCode: number;
  message: string;
  payload?: any;
}

class CaseInfoService {
  /**
   * Get case information details for cashless cases
   */
  async getCaseInfoDetails(investigationId: string): Promise<CaseInfoResponse> {
    try {
      const response:any = await apiService.get<CaseInfoResponse>(
        `${apiurls.caseInfo}/${investigationId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching case info details:', error);
      throw error;
    }
  }

  /**
   * Get case information details for reimbursement cases
   */
  async getCaseInfoDetailsReim(investigationId: string): Promise<CaseInfoResponse> {
    try {
      const response:any = await apiService.get<CaseInfoResponse>(
        `${apiurls.caseInfoReim}/${investigationId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching reimbursement case info details:', error);
      throw error;
    }
  }

  /**
   * Download consent letter
   */
  async downloadConsentLetter(investigationId: string): Promise<Blob> {
    try {
      const response:any = await apiService.get(
        `${apiurls.downloadConsentLetter}/${investigationId}`,
        { responseType: 'blob' }
      );
      return response.data;
    } catch (error) {
      console.error('Error downloading consent letter:', error);
      throw error;
    }
  }

  /**
   * Download hospital application letter
   */
  async downloadHospitalLetter(investigationId: string): Promise<Blob> {
    try {
      const response:any = await apiService.get(
        `${apiurls.downloadHospitalLetter}/${investigationId}`,
        { responseType: 'blob' }
      );
      return response.data;
    } catch (error) {
      console.error('Error downloading hospital letter:', error);
      throw error;
    }
  }

  /**
   * Download vendor authorization letter
   */
  async downloadVendorLetter(investigationId: string): Promise<Blob> {
    try {
      const response:any = await apiService.get(
        `${apiurls.downloadVendorLetter}/${investigationId}`,
        { responseType: 'blob' }
      );
      return response.data;
    } catch (error) {
      console.error('Error downloading vendor letter:', error);
      throw error;
    }
  }
}

export const caseInfoService = new CaseInfoService();