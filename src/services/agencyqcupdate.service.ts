import { apiService } from "./api.service";

export const agencyQCService = {
    /**
     * Get QC update data for a specific tab
     */
    getQCUpdateData: async (investigationId: string, tabName: string) => {
        return apiService.get(`/claimsQC/getClaimQCUpdateData?invClaimId=${investigationId.split('-')[0]}?tabName=${tabName}`);
    },

    /**
     * Save agency QC update
     */
    saveAgencyQC: async (investigationId: string, data: any) => {
        return apiService.post(`/agency-qc/${investigationId}`, data);
    },

    /**
     * Submit agency QC update
     */
    submitAgencyQC: async (investigationId: string, data: any) => {
        return apiService.post(`/agency-qc/${investigationId}/submit`, data);
    },

    /**
     * Get agency QC recommendation
     */
    getRecommendation: async (investigationId: string) => {
        return apiService.get(`/agency-qc/${investigationId}/recommendation`);
    },

    getReClaimQCData: async (investigationId: string, tabName: string) => {
        return apiService.get(`/claimsQC/getReClaimQCUpdateData?invClaimId=${investigationId}&tabName=${tabName}`);
    },
};