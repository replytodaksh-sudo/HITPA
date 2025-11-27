import { apiService } from './api.service';

export const AssignService = {
    getQuestions: (questionType: string, invClaimId: string) => apiService.get(`/questionairy/getQuestions?questionType=${questionType}&invClaimId=${invClaimId.split('-')[0]}`),

    assignFO: (acceptRequest: any, docsIds: any) => apiService.post(`/accept-assign/acceptAssignAgency?documentIds=${docsIds}`, acceptRequest),

    reimAssign: (acceptAssignDetails: any, docsId: any) => apiService.post(`/accept-assign/acceptReimbursementAssign?documentIds=${docsId}`, acceptAssignDetails),

    assign: (acceptRequest: any, docsIds: any) => apiService.post(`/accept-assign/acceptAssign?documentIds=${docsIds}`, acceptRequest),

    accept: (data: {
        investigationId: string;
        investigationType: string;
        investigationSubType: string;
        acceptAssignId: string;
    }) => apiService.post('/accept-assign/accept', data),

    // Deny a case
    deny: (data: {
        reasonsCode: string[];
        denialReason: string;
        investigationId: string;
        investigationType: string;
        investigationSubType: string;
        denialDecision?: string;
        acceptAssignId: string;
    }) => apiService.post('/accept-assign/deny', data),

    // Assign case to field officer
    assignToFO: (data: {
        investigationId: string;
        fieldOfficerCode: string;
        investigationType: string;
        investigationSubType: string;
    }) => apiService.post('/accept-assign/assign-fo', data),

    // Assign case to internal team
    assignToInternalTeam: (data: {
        investigationId: string;
        teamMemberCode: string;
        investigationType: string;
        investigationSubType: string;
    }) => apiService.post('/accept-assign/assign-internal', data),

    // Get available internal team members
    getAvailableInternalTeam: () =>
        apiService.get('/user/getAllRegionalUsers'),
}