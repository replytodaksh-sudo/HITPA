// // src/services/log.service.ts

// import { apiService } from './api.service';

// export interface LogResponse {
//   statusCode: number;
//   message: string;
//   payload: LogItem[];
// }

// export interface LogItem {
//   logTime: string;
//   description: string;
//   information: string;
//   userId?: string;
//   userName?: string;
//   action?: string;
// }

// export const logService = {
//   /**
//    * Get all logs for cashless investigation
//    */
//   allLogs: (invClaimId: string) =>
//     apiService.get<any>(`/claims/getLogDetails/${invClaimId.split('-')[0]}`),

//   /**
//    * Get all logs for reimbursement investigation
//    */

//   allReLogs: (invClaimId:string) =>
//     apiService.get<any>(`/reclaims/getLogDetails/${invClaimId.split('-')[0]}`),

//   /**
//    * Add a new log entry
//    */
//   addLog: (investigationId: string, data: Partial<LogItem>) =>
//     apiService.post<any>(`/logs/${investigationId}`, data),

// // getSbigLogDetails(sbigClaimNo:any, claimType:any):Observable<any>{
// //     return this.http.get(apiurls.getLogDetailsBySbigClaimNo+"?sbigClaimNo="+sbigClaimNo+"&claimType="+claimType, {responseType:"json"});

//   getSbigLogDetails: (sbigClaimNo: string, claimType: any) =>
//     apiService.get<any>(`/claims/getLogDetailsBySbigClaimNo?sbigClaimNo=${sbigClaimNo}&claimType=${claimType}`),

//   /**
//    * Get logs by date range
//    */
//   getLogsByDateRange: (investigationId: string, startDate: string, endDate: string) =>
//     apiService.get<any>(`/logs/${investigationId}/date-range`, {
//       params: { startDate, endDate },
//     }),

//   /**
//    * Get logs by user
//    */
//   getLogsByUser: (investigationId: string, userId: string) =>
//     apiService.get<any>(`/logs/${investigationId}/user/${userId}`),

//   /**
//    * Search logs by keyword
//    */
//   searchLogs: (investigationId: string, keyword: string) =>
//     apiService.get<any>(`/logs/${investigationId}/search`, {
//       params: { q: keyword },
//     }),

//   /**
//    * Delete a log entry
//    */
//   deleteLog: (investigationId: string, logId: string) =>
//     apiService.delete<any>(`/logs/${investigationId}/${logId}`),
// };


// ============================================================================
// FILE: src/services/logService.ts
// Log Service - React/TypeScript version
// ============================================================================

import { apiUrls } from '../constants/apiConstants';
import apiService from './api.service';

// ==================== INTERFACES ====================

export interface LogEntry {
  id?: string;
  timestamp?: string;
  action?: string;
  performedBy?: string;
  description?: string;
  status?: string;
  details?: any;
  [key: string]: any;
}

export interface LogResponse {
  statusCode: number;
  message?: string;
  payload?: LogEntry[] | null;
}

export interface SbigLogDetail {
  sbigClaimNo?: string;
  claimType?: string;
  logs?: LogEntry[];
  [key: string]: any;
}

export interface SbigLogResponse {
  statusCode: number;
  message?: string;
  payload?: SbigLogDetail | null;
}

// ==================== SERVICE ====================

export const logService = {
  /**
   * Get all logs for a claim (cashless)
   * @param invClaimId - Investigation/Claim ID (will be cleaned)
   * @returns Promise with log entries
   * 
   * @example
   * const logs = await logService.allLogs('INV-123-ABC');
   * // Calls: GET /api/logs/INV
   */
  allLogs: async (invClaimId: string): Promise<LogResponse> => {
    try {
      // Clean investigation ID (remove suffix after dash)
      const cleanInvClaimId = invClaimId.split('-')[0];

      const response = await apiService.get<LogEntry[]>(
        `${apiUrls.logs}${cleanInvClaimId}`
      );

      return response;
    } catch (error) {
      console.error('Error in allLogs:', error);
      throw error;
    }
  },

  /**
   * Get all logs for a reimbursement claim
   * @param invClaimId - Investigation/Claim ID (will be cleaned)
   * @returns Promise with log entries
   * 
   * @example
   * const logs = await logService.allReLogs('REINV-456-XYZ');
   * // Calls: GET /api/relogs/REINV
   */
  allReLogs: async (invClaimId: string): Promise<LogResponse> => {
    try {
      // Clean investigation ID (remove suffix after dash)
      const cleanInvClaimId = invClaimId.split('-')[0];

      const response = await apiService.get<LogEntry[]>(
        `${apiUrls.relogs}${cleanInvClaimId}`
      );

      return response;
    } catch (error) {
      console.error('Error in allReLogs:', error);
      throw error;
    }
  },

  /**
   * Get log details by claim number and type
   * @param sbigClaimNo - Claim Number
   * @param claimType - Type of claim (e.g., 'cashless', 'reimbursement')
   * @returns Promise with log details
   * 
   * @example
   * const details = await logService.getSbigLogDetails('SBIG123', 'cashless');
   * // Calls: GET /api/logs/sbig-details?sbigClaimNo=SBIG123&claimType=cashless
   */
  getSbigLogDetails: async (
    sbigClaimNo: string,
    claimType: string
  ): Promise<SbigLogResponse> => {
    try {
      const response = await apiService.get<SbigLogDetail>(
        `${apiUrls.getLogDetailsBySbigClaimNo}?sbigClaimNo=${sbigClaimNo}&claimType=${claimType}`
      );

      return response;
    } catch (error) {
      console.error('Error in getSbigLogDetails:', error);
      throw error;
    }
  },
};

export default logService;
