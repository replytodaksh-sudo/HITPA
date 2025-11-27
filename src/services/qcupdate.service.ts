import { apiService } from './api.service';

/**
 * QC Update Service
 * Handles Quality Check (QC) update operations for investigations
 */
export const QCUpdateService = {
  /**
   * Get QC update preview for cashless claims
   * @param investigationId - Investigation ID
   * @param tabName - Tab name (regionalQC or centralQC)
   */
  qcUpdatePreview: (investigationId: string, tabName: string) =>
    apiService.get(`/qcupdate/getQCUpdateData?invClaimId=${investigationId}&tabName=${tabName}`),

  /**
   * Get QC update preview for reimbursement claims
   * @param investigationId - Investigation ID
   * @param tabName - Tab name (regionalQC or centralQC)
   */
  qcUpdatePreviewReim: (investigationId: string, tabName: string) =>
    apiService.get(`/qcupdate/getReQCUpdateData?invClaimId=${investigationId}&tabName=${tabName}`),

  /**
   * Submit QC update fields
   * @param investigationId - Investigation ID
   * @param data - QC update field data
   * @param tabName - Tab name (regionalQC or centralQC)
   */
  submitQcUpdateFields: (investigationId: string, data: any, tabName: string) =>
    apiService.post(`/qc-update/fields/${investigationId}/${tabName}`, data),

  /**
   * Submit QC observations
   * @param investigationId - Investigation ID
   * @param data - QC observation data
   * @param tabName - Tab name (regionalQC or centralQC)
   */
  submitQcObservations: (investigationId: string, data: any, tabName: string) =>
    apiService.post(`/qc-update/observations/${investigationId}/${tabName}`, data),

  /**
   * Get QC update fields
   * @param investigationId - Investigation ID
   * @param qcUpdateId - QC Update ID
   */
  getQcUpdateFields: (investigationId: string, qcUpdateId: string) =>
    apiService.get(`/qc-update/fields/${investigationId}/${qcUpdateId}`),

  /**
   * Get QC observations
   * @param investigationId - Investigation ID
   * @param qcUpdateId - QC Update ID
   */
  getQcObservations: (investigationId: string, qcUpdateId: string) =>
    apiService.get(`/qc-update/observations/${investigationId}/${qcUpdateId}`),

  /**
   * Update QC fields
   * @param investigationId - Investigation ID
   * @param qcUpdateId - QC Update ID
   * @param data - Updated field data
   */
  updateQcFields: (investigationId: string, qcUpdateId: string, data: any) =>
    apiService.put(`/qc-update/fields/${investigationId}/${qcUpdateId}`, data),

  /**
   * Update QC observations
   * @param investigationId - Investigation ID
   * @param qcUpdateId - QC Update ID
   * @param data - Updated observation data
   */
  updateQcObservations: (investigationId: string, qcUpdateId: string, data: any) =>
    apiService.put(`/qc-update/observations/${investigationId}/${qcUpdateId}`, data),

  /**
   * Get QC history
   * @param investigationId - Investigation ID
   */
  getQcHistory: (investigationId: string) =>
    apiService.get(`/qc-update/history/${investigationId}`),

  /**
   * Approve QC update
   * @param investigationId - Investigation ID
   * @param qcUpdateId - QC Update ID
   * @param remarks - Approval remarks
   */
  approveQcUpdate: (investigationId: string, qcUpdateId: string, remarks: string) =>
    apiService.post(`/qc-update/approve/${investigationId}/${qcUpdateId}`, { remarks }),

  /**
   * Reject QC update
   * @param investigationId - Investigation ID
   * @param qcUpdateId - QC Update ID
   * @param reasons - Rejection reasons
   * @param remarks - Rejection remarks
   */
  rejectQcUpdate: (
    investigationId: string,
    qcUpdateId: string,
    reasons: string[],
    remarks: string
  ) =>
    apiService.post(`/qc-update/reject/${investigationId}/${qcUpdateId}`, {
      reasons,
      remarks,
    }),

  /**
   * Send back for rework
   * @param investigationId - Investigation ID
   * @param qcUpdateId - QC Update ID
   * @param reason - Rework reason
   * @param remarks - Rework remarks
   */
  sendBackForRework: (
    investigationId: string,
    qcUpdateId: string,
    reason: string,
    remarks: string
  ) =>
    apiService.post(`/qc-update/rework/${investigationId}/${qcUpdateId}`, {
      reason,
      remarks,
    }),

  /**
   * Get QC checklist
   * @param investigationId - Investigation ID
   * @param claimType - Claim type (cashless/reim)
   */
  getQcChecklist: (investigationId: string, claimType: 'cashless' | 'reim') =>
    apiService.get(`/qc-update/checklist/${investigationId}/${claimType}`),

  /**
   * Submit QC checklist
   * @param investigationId - Investigation ID
   * @param data - Checklist data
   */
  submitQcChecklist: (investigationId: string, data: any) =>
    apiService.post(`/qc-update/checklist/${investigationId}`, data),

  /**
   * Add QC comment
   * @param investigationId - Investigation ID
   * @param qcUpdateId - QC Update ID
   * @param comment - Comment text
   * @param isInternal - Whether comment is internal
   */
  addQcComment: (
    investigationId: string,
    qcUpdateId: string,
    comment: string,
    isInternal: boolean = false
  ) =>
    apiService.post(`/qc-update/comment/${investigationId}/${qcUpdateId}`, {
      comment,
      isInternal,
    }),

  /**
   * Get QC comments
   * @param investigationId - Investigation ID
   * @param qcUpdateId - QC Update ID
   */
  getQcComments: (investigationId: string, qcUpdateId: string) =>
    apiService.get(`/qc-update/comments/${investigationId}/${qcUpdateId}`),

  /**
   * Get QC statistics for investigation
   * @param investigationId - Investigation ID
   */
  getQcStats: (investigationId: string) =>
    apiService.get(`/qc-update/stats/${investigationId}`),

  /**
   * Get QC dashboard data
   * @param filters - Optional filters (dateRange, status, etc.)
   */
  getQcDashboard: (filters?: {
    fromDate?: string;
    toDate?: string;
    status?: string;
    teamType?: 'regional' | 'central';
  }) =>
    apiService.get('/qc-update/dashboard', { params: filters }),

  /**
   * Validate QC data before submission
   * @param investigationId - Investigation ID
   * @param data - Data to validate
   * @param updateType - Type of update (fields/observations)
   */
  validateQcData: (
    investigationId: string,
    data: any,
    updateType: 'fields' | 'observations'
  ) =>
    apiService.post(`/qc-update/validate/${investigationId}/${updateType}`, data),

  /**
   * Get mandatory QC fields
   * @param claimType - Claim type
   * @param updateType - Type of update (fields/observations)
   */
  getMandatoryQcFields: (
    claimType: 'cashless' | 'reim',
    updateType: 'fields' | 'observations'
  ) =>
    apiService.get(`/qc-update/mandatory-fields/${claimType}/${updateType}`),

  /**
   * Lock QC update for editing
   * @param investigationId - Investigation ID
   * @param qcUpdateId - QC Update ID
   */
  lockQcUpdate: (investigationId: string, qcUpdateId: string) =>
    apiService.post(`/qc-update/lock/${investigationId}/${qcUpdateId}`),

  /**
   * Unlock QC update
   * @param investigationId - Investigation ID
   * @param qcUpdateId - QC Update ID
   */
  unlockQcUpdate: (investigationId: string, qcUpdateId: string) =>
    apiService.post(`/qc-update/unlock/${investigationId}/${qcUpdateId}`),

  /**
   * Get QC template fields
   * @param claimType - Claim type
   * @param teamType - Team type (regional/central)
   */
  getQcTemplateFields: (
    claimType: 'cashless' | 'reim',
    teamType: 'regional' | 'central'
  ) =>
    apiService.get(`/qc-update/template/${claimType}/${teamType}`),

  /**
   * Submit bulk QC updates
   * @param updates - Array of QC updates
   */
  submitBulkQcUpdates: (updates: Array<{ investigationId: string; data: any }>) =>
    apiService.post('/qc-update/bulk-submit', { updates }),
};

export default QCUpdateService;