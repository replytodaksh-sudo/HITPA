import { apiService } from './api.service';

/**
 * Accept Assignment Service
 * Handles all accept/deny operations for case assignments
 */
export const AcceptAssignService = {
    /**
     * Get internal team members for assignment
     * @returns List of available internal team members
     */
    getInternalTeamMembers: () =>
        apiService.get('/accept-assign/internal-team-members'),

    /**
     * Get agencies for assignment
     * @returns List of available agencies
     */
    getAgencies: () =>
        apiService.get('/accept-assign/agencies'),

    /**
     * Get field officers for a specific agency
     * @param agencyCode - Agency code to get field officers for
     * @returns List of field officers
     */
    getFieldOfficers: (agencyCode: string) =>
        apiService.get(`/accept-assign/field-officers/${agencyCode}`),

    /**
     * Assign investigation to an agency
     * @param data - Assignment payload
     * @returns Assignment response
     */
    assignToAgency: (data: {
        acceptAssignmentId: string;
        investigationId: string;
        agencyCode: string;
        fieldOfficerCode?: string;
        instructions?: string;
        isMajorTrigger?: boolean;
        documents?: string[];
        questions?: any;
    }) =>
        apiService.post('/accept-assign/assign-to-agency', data),

    /**
     * Assign investigation to internal team
     * @param data - Assignment payload
     * @returns Assignment response
     */
    assignToInternalTeam: (data: {
        acceptAssignmentId: string;
        investigationId: string;
        assignedTo?: string;
        caseAllocationType?: 'full' | 'split' | 'part';
        splitUsers?: string[];
        partCaseType?: 'document_verification' | 'field_verification';
        instructions?: string;
        isMajorTrigger?: boolean;
        documents?: string[];
        questions?: any;
    }) =>
        apiService.post('/accept-assign/assign-to-internal-team', data),

    /**
     * Assign investigation to field officer
     * @param data - Assignment payload
     * @returns Assignment response
     */
    assignToFieldOfficer: (data: {
        acceptAssignmentId: string;
        investigationId: string;
        fieldOfficerCode: string;
        instructions?: string;
        documents?: string[];
        questions?: any;
    }) =>
        apiService.post('/accept-assign/assign-to-field-officer', data),

    assign: (acceptRequest: any, docIds: string[]) =>
        apiService.post('/accept-assign/acceptAssign"?documentIds=' + docIds, acceptRequest),

    assignFO: (acceptRequest: any, docIds: string[]) =>
        apiService.post('/accept-assign/acceptAssignAgency"?documentIds=' + docIds, acceptRequest),

    /**
     * Deny an assignment (Regional Manager rejecting agency denial)
     * @param data - Denial payload
     * @returns Denial response
     */
    deny: (data: {
        acceptAssignId: string;
        investigationId: string;
        denialDecision: string;
        denialDecisionReason: string;
    }) =>
        apiService.post('/accept-assign/deny', data),

    getAssignUsers: () =>
        apiService.get(`/user/getUsersByRegionByUserCode`),
    
    getRegionalUsers: () =>
        apiService.get(`/user/getAllRegionalUsers`),

    reimAssign: (acceptAssignDetails:any, docsId:string[]) =>
        apiService.post('/accept-assign/acceptReimbursementAssign"?documentIds=' + docsId, acceptAssignDetails),

    reimAgencyAssign: (acceptAssignDetails:any, docsId:string[]) =>
        apiService.post('/accept-assign/acceptReimbursementAgencyAssign"?documentIds=' + docsId, acceptAssignDetails),
    /**
     * Get accept assignment details
     * @param acceptAssignId - Accept assignment ID
     * @returns Accept assignment details
     */
    getAcceptAssignDetails: (acceptAssignId: string) =>
        apiService.get(`/accept-assign/${acceptAssignId}`),

    /**
     * Get system suggested agencies based on case details
     * @param investigationId - Investigation ID
     * @returns List of suggested agencies with performance metrics
     */
    getSystemSuggestedAgencies: (investigationId: string) =>
        apiService.get(`/accept-assign/system-suggested-agencies/${investigationId}`),

    /**
     * Accept and assign with system suggestion
     * @param data - System assignment payload
     * @returns Assignment response
     */
    acceptSystemSuggestion: (data: {
        acceptAssignmentId: string;
        investigationId: string;
        agencyCode: string;
        instructions?: string;
        isMajorTrigger?: boolean;
        documents?: string[];
        questions?: any;
    }) =>
        apiService.post('/accept-assign/accept-system-suggestion', data),

    /**
     * Get assignment history for an investigation
     * @param investigationId - Investigation ID
     * @returns Assignment history
     */
    getAssignmentHistory: (investigationId: string) =>
        apiService.get(`/accept-assign/history/${investigationId}`),

    /**
     * Reassign investigation (for denied cases)
     * @param data - Reassignment payload
     * @returns Reassignment response
     */
    reassign: (data: {
        acceptAssignId: string;
        investigationId: string;
        assignmentType: 'agency' | 'internal_team' | 'field_officer';
        assignedTo: string;
        reason: string;
        instructions?: string;
    }) =>
        apiService.post('/accept-assign/reassign', data),

    /**
     * Bulk assign multiple investigations
     * @param data - Bulk assignment payload
     * @returns Bulk assignment response
     */
    bulkAssign: (data: {
        investigations: Array<{
            acceptAssignmentId: string;
            investigationId: string;
        }>;
        assignmentType: 'agency' | 'internal_team';
        assignedTo: string;
        instructions?: string;
    }) =>
        apiService.post('/accept-assign/bulk-assign', data),

    /**
     * Update assignment instructions
     * @param acceptAssignId - Accept assignment ID
     * @param instructions - Updated instructions
     * @returns Update response
     */
    updateInstructions: (acceptAssignId: string, instructions: string) =>
        apiService.put(`/accept-assign/${acceptAssignId}/instructions`, { instructions }),

    /**
     * Cancel an assignment
     * @param acceptAssignId - Accept assignment ID
     * @param reason - Cancellation reason
     * @returns Cancellation response
     */
    cancelAssignment: (acceptAssignId: string, reason: string) =>
        apiService.post(`/accept-assign/${acceptAssignId}/cancel`, { reason }),

    /**
     * Get pending assignments for current user
     * @returns List of pending assignments
     */
    getPendingAssignments: () =>
        apiService.get('/accept-assign/pending'),

    /**
     * Get completed assignments for current user
     * @param filters - Optional filters
     * @returns List of completed assignments
     */
    getCompletedAssignments: (filters?: {
        fromDate?: string;
        toDate?: string;
        status?: string;
    }) =>
        apiService.get('/accept-assign/completed', { params: filters }),
};

export default AcceptAssignService;