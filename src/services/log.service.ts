// src/services/log.service.ts

import { apiService } from './api.service';

export interface LogResponse {
  statusCode: number;
  message: string;
  payload: LogItem[];
}

export interface LogItem {
  logTime: string;
  description: string;
  information: string;
  userId?: string;
  userName?: string;
  action?: string;
}

export const logService = {
  /**
   * Get all logs for cashless investigation
   */
  allLogs: (invClaimId: string) =>
    apiService.get<any>(`/claims/getLogDetails/${invClaimId.split('-')[0]}`),
  
  /**
   * Get all logs for reimbursement investigation
   */

  allReLogs: (invClaimId:string) =>
    apiService.get<any>(`/reclaims/getLogDetails/${invClaimId.split('-')[0]}`),

  /**
   * Add a new log entry
   */
  addLog: (investigationId: string, data: Partial<LogItem>) =>
    apiService.post<any>(`/logs/${investigationId}`, data),
  
// getSbigLogDetails(sbigClaimNo:any, claimType:any):Observable<any>{
//     return this.http.get(apiurls.getLogDetailsBySbigClaimNo+"?sbigClaimNo="+sbigClaimNo+"&claimType="+claimType, {responseType:"json"});

  getSbigLogDetails: (sbigClaimNo: string, claimType: any) =>
    apiService.get<any>(`/claims/getLogDetailsBySbigClaimNo?sbigClaimNo=${sbigClaimNo}&claimType=${claimType}`),

  /**
   * Get logs by date range
   */
  getLogsByDateRange: (investigationId: string, startDate: string, endDate: string) =>
    apiService.get<any>(`/logs/${investigationId}/date-range`, {
      params: { startDate, endDate },
    }),

  /**
   * Get logs by user
   */
  getLogsByUser: (investigationId: string, userId: string) =>
    apiService.get<any>(`/logs/${investigationId}/user/${userId}`),

  /**
   * Search logs by keyword
   */
  searchLogs: (investigationId: string, keyword: string) =>
    apiService.get<any>(`/logs/${investigationId}/search`, {
      params: { q: keyword },
    }),

  /**
   * Delete a log entry
   */
  deleteLog: (investigationId: string, logId: string) =>
    apiService.delete<any>(`/logs/${investigationId}/${logId}`),
};