// src/services/agency.service.ts
import { apiService } from './api.service';

export interface CaseAssignmentRule {
    ruleCode: string;
    ruleName: string;
    caseType: string;
    thresoldLimit: number;
    claimAmountCap: string;
    isRuleEnable: boolean;
    zones: string[];
    states: string[];
    cities: string[];
    pincodes: string[];
}

export interface CaseAssignmentRuleResponse {
    statusCode: number;
    message: string;
    payload: any;
}


export const agencyService = {
    // Fetch all agencies
    fetchAllAgency: () => apiService.get('/agency/agencies'),

    // Fetch agency by MDM ID
    fetchAgency: (mdmId: string) => apiService.get(`/agency/getAgencyByMDM?mdmID=${mdmId}`),

    // Get agency user by code
    getAgencyUserByCode: (agencyCode: string) =>
        apiService.get(`/agency/getUserByCode?agencyCodeFromUI=${agencyCode}`),

    // Add new agency
    addAgency: (data: any) => apiService.post('/agency/addAgency', data),

    // Edit agency
    editAgency: (data: any) => apiService.put('/agency/editAgency', data),

    // Delete agency
    deleteAgency: (agencyCode: string) =>
        apiService.delete(`/agency/deleteAgency/${agencyCode}`),

    getPerformanceIndex: (agencyCode: string) =>
        apiService.get(`/user/getPerformanceIndexDetailsByUser?userCode=${agencyCode}`),

    getSystemSuggestedAgency: () =>
        apiService.get('/agency/findAgencyByRegionByAgencyCodeandRoleCode'),

    fetchAllFieldOfficer: () =>
        apiService.get('/field-officers'),

    // fetchAllAgency: () =>
    //     apiService.get('/agencies'),

    /**
     * Get system suggested agencies based on rules
     * @returns Promise with suggested agencies
     */
    // getSystemSuggestedAgency: () =>
    //     apiService.get('/agencies/system-suggested'),

    /**
     * Get all field officers
     * @returns Promise with field officers list
     */
    // fetchAllFieldOfficer: () =>
    //     apiService.get('/agencies/field-officers'),

    /**
     * Get performance index for agency/user
     * @param agencyCode - Agency code or user code
     * @returns Promise with performance metrics
     */
    // getPerformanceIndex: (agencyCode: string) =>
    //     apiService.get(`/agencies/performance-index/${agencyCode}`),
};

// src/services/dropdown.service.ts
export const dropdownService = {
    // Get agency types
    getAgencyType: () => apiService.get('/codeMaster/getCode/agencyType'),

    // Get zones
    getZones: () => apiService.get('/zone/getAllZones'),

    // Get states
    getStates: () => apiService.get('/state/getAllState'),

    // Get cities by state
    getCities: (stateCode: string) =>
        apiService.get(`/city/getCityByState?stateCode=${stateCode}`),

    // Get states by zones
    getStatesByZones: (data: { zoneCodes: string[] }) =>
        apiService.post('/state/getStatesByZones', data),

    // Get cities by states
    getCitiesByStates: (data: { stateCodes: string[] }) =>
        apiService.post('/city/getCitiesByStates', data),

    // Get pins by cities
    getPinsByCities: (data: { cityCodes: string[] }) =>
        apiService.post('/pincode/getPincodesByCities', data),

    getAllStates: () =>
        apiService.get('/state/getAllState'),

    getUserType: () => apiService.get('/user/getAllUserTypesByRole'),

    getRoles: (userTypeCode: string) =>
        apiService.get(`/role/getRoles/${userTypeCode}`),

    getAllDenyReasons: () => apiService.get('/denialreason/getAllDenialReasons'),

    getDenyReasons: (investigationId: string) =>
        apiService.get(`/claims/getClaimsDataByInvClaimIdDenied/${investigationId}`),

    getRecomendation: () =>
        apiService.get('codeMaster/getCode/recommendation', { responseType: "json" }),

    getRepudiationGrounds: () =>
        apiService.get('codeMaster/getCode/repudiationGrounds', { responseType: "json" }),

    getFraudClaimReason: () =>
        apiService.get('claims/getFraudClaimReasons', { responseType: "json" }),

    getFraudClaimEvedance: () =>
        apiService.get('claims/getFraudEvidences', { responseType: "json" }),
    
    getAllEvidenceSupporting: () =>
        apiService.get('claims/getFraudEvidences', { responseType: "json" }),
    
    getAllPrimaryDiscrepancy: () =>
        apiService.get('claims/getFraudEvidences', { responseType: "json" }),
    
    getSecondaryDiscrepancy: (primaryId: string) =>
        apiService.get(`claims/getFraudEvidences/${primaryId}`, { responseType: "json" }),

};

// src/services/caseassignment.service.ts
export const caseAssignmentService = {
    // Get all case assignment rules
    getCaseAssignmentRule: () => apiService.get('/case-assignment/rules'),

    // Add case assignment rule
    addCaseAssignmentRule: (data: any) =>
        apiService.post('/case-assignment/add', data),

    // Update case assignment rule
    updateCaseAssignmentRule: (data: any) =>
        apiService.put('/case-assignment/update', data),

    // Delete case assignment rule
    deleteCaseAssignmentRule: (ruleCode: string) =>
        apiService.delete(`/case-assignment/${ruleCode}`),

    getAssignedRuleByCode: (ruleCode: string) =>
        apiService.get(`/ruleassign/getCaseAssignmentRule/${ruleCode}`),

    // getCaseAssignmentRule: () =>
    //     apiService.get(`/case-assignment-rules`),

    // addCaseAssignmentRule: (rule: CaseAssignmentRule) =>
    //     apiService.post(`/case-assignment-rules`, rule),

    // updateCaseAssignmentRule: (
    //     ruleCode: string,
    //     rule: CaseAssignmentRule) =>
    //     apiService.put(`/case-assignment-rules/${ruleCode}`, rule),

    // deleteCaseAssignmentRule: (ruleCode: string) =>
    //     apiService.delete(`/case-assignment-rules/${ruleCode}`),
};