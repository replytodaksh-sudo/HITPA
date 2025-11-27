import { apiService } from './api.service';

export const caseUpdateService = {
    /**
     * Get case update preview for display
     * @param investigationId - Investigation ID
     * @returns Promise with case update details
     */
    caseUpdatePreview: (investigationId: string) =>
        apiService.get(`/activecase/getCaseUpdateData?invClaimId=${investigationId}`),

    /**
     * Submit final case update
     * @param caseUpdateId - Case update ID from localStorage
     * @param investigationId - Investigation ID
     * @returns Promise with submission result
     */
    addCaseUpdateFinal: (caseUpdateId: string | null, investigationId: string) =>
        apiService.post(`/activecase/caseUpdateFinal?investigationId=${investigationId}&activeCaseID=${caseUpdateId}`),

    /**
     * Get case update by ID
     * @param caseUpdateId - Case update ID
     * @returns Promise with case update data
     */

    async caseUpdatePreviousData(investigationId: string) {
        var insid = investigationId.split(' ')[0];
        insid = insid.split('-')[0];
        return apiService.get<any>(`/activecase/getCaseUpdateData?invClaimId=${insid}`);
    },
    
    async caseUpdatePreviousDataReim(investigationId: string) {
        var insid = investigationId.split(' ')[0];
        insid = insid.split('-')[0];
        return apiService.get<any>(`/reactivecase/getReCaseUpdateData?invClaimId=${insid}`);
    },
    // getCaseUpdateById: (caseUpdateId: string) => {
    //     return apiService.get(`/activecase/getCaseUpdateData?invClaimId=${caseUpdateId}`),
    // }

    /**
     * Create or update case update
     * @param data - Case update data
     * @returns Promise with created/updated case update
     */
    saveCaseUpdate: (data: any) =>
        apiService.post('/case-update/save', data),

    /**
     * Save case update as draft
     * @param data - Case update data
     * @returns Promise with draft save result
     */
    saveCaseUpdateDraft: (data: any) =>
        apiService.post('/case-update/draft', data),

    /**
     * Get case update menu items
     * @param investigationId - Investigation ID
     * @returns Promise with menu items
     */
    getCaseUpdateMenu: (investigationId: string) =>
        apiService.get(`/case-update/menu/${investigationId}`),

    /**
     * Delete case update
     * @param caseUpdateId - Case update ID
     * @returns Promise with delete result
     */
    deleteCaseUpdate: (caseUpdateId: string) =>
        apiService.delete(`/case-update/${caseUpdateId}`),
};

export default caseUpdateService;