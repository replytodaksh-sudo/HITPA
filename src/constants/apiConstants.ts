const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const apiUrls = {
    login: "/authentication/authenticate",
    sessionOut: "/authentication/sessionOut",
    accessedMenu: "/accessRight/accessRightsMenu",
    // fetchClaims:"/claims/getAllClaims",
    fetchClaims: "/claims/getAllNewCases",
    fetchClaimsReim: "/reclaims/getAllNewCases",
    fetchAgencyDeniedCases: "/claims/getAllAgencyDeniedCases",
    fetchAgencyDeniedCasesReim: "/reclaims/getAllAgencyDeniedCases",
    fetchRegionalDeniedCases: "/claims/getAllRegionalDeniedCases",
    fetchCentralMandatedCases: "/claims/getAllCentralMandatedCases",
    fetchCentralMandatedCasesReim: "/reclaims/getAllCentralMandatedCases",
    fetchALLCentralNewCasesForAction: "/claims/getALLCentralNewCasesForAction",
    fetchALLCentralNewCasesForActionReim: "/reclaims/getALLCentralNewCasesForAction",
    fetchAllCentralNewCases: "/claims/getAllCentralNewCases",
    fetchAllCentralNewCasesReim: "/reclaims/getAllCentralNewCases",
    fetchAllCentralAssignedToAgency: "/claims/getAllCentralAssignedToAgency",
    fetchAllCentralAssignedToAgencyReims: "/reclaims/getAllCentralAssignedToAgency",
    fetchAllCentralAssignedToRegional: "/claims/getAllCentralAssignedToRegional",
    fetchAllCentralAssignedToRegionalReims: "/reclaims/getAllCentralAssignedToRegional",
    fetchAllCentralReworkCases: "/claims/getAllCentralReworkCases",
    fetchAllCentralReworkCasesReim: "/reclaims/getAllCentralReworkCases",
    fetchAllCentralReassignedCases: "/claims/getAllCentralReassignedCases",
    fetchAllCentralReassignedCasesReim: "/reclaims/getAllCentralReassignedCases",
    fetchAllCentralCaseNotInvestigated: "/claims/getAllCentralCaseNotInvestigated",
    fetchAllCentralCaseNotInvestigatedReim: "/reclaims/getAllCentralCaseNotInvestigated",
    fetchAllCentralInvestigationCompleted: "/claims/getAllCentralInvestigationCompleted",
    fetchAllCentralInvestigationCompletedReim: "/reclaims/getAllCentralInvestigationCompleted",
    fetchAllCentralQCPending: "/claims/getAllCentralQCPending",
    fetchAllCentralQCPendingReim: "/reclaims/getAllCentralQCPending",
    fetchAllCentralQueryResponse: "/claims/getAllCentralQueryResponse",
    fetchAllCentralQueryResponsePending: "/claims/getAllCentralQueryResponsePending",
    fetchAllCentralQueryResponsePendingReim: "/reclaims/getAllCentralQueryResponsePending",
    fetchAllCentralQueryResponseReim: "/reclaims/getAllCentralQueryResponse",
    fetchAllQueriesByClaimsTeam: "/claims/getAllQueriesByClaimsTeam",
    fetchAllQueriesByClaimsTeamReim: "/reclaims/getAllQueriesByClaimsTeam",
    fetchAllDeniedByRegional: "/claims/getAllDeniedByRegional",
    fetchAllDeniedByRegionalReim: "/reclaims/getAllDeniedByRegional",
    getReworkClaimsRegReim: "/reclaims/getReworkClaims",
    getCaseData: "/reclaims/getDeniedInvestigationType",



    activeCaseClaims: "/claims/getClaimsActive",
    deniedCaseClaims: "/claims/getClaimsDenied",
    reimdeniedCaseClaims: "/reclaims/getClaimsDenied",
    userTypeDropdown: "/user/getAllUserTypesByRole",
    agencyTypeDropdown: "/codeMaster/getCode/agencyType",
    statesDropdownByZones: "/state/getStatesByZones",
    userStatesDropdownByZones: "/dashboard/getUserState",
    statesDropdown: "/state/getAllState",
    cityDropdown: "/city/getCityByState?stateCode=",
    cityDropdownMul: "/city/getCityByStates?stateCode=",
    getRoles: "/role/getRoles/",
    addUser: "/user/addUser",
    editUser: "/user/editUser",
    accessedForms: "/accessRight/accessRights",
    qcUpdate: "/qcupdate/addQCUpdate?investigationId=",
    qcUpdateObservations: "/qcupdate/addQCUpdateObservation?investigationId=",
    qcUpdateVEndorFeedback: "/qcupdate/addQCUpdateVendorFeedBack?investigationId=",
    qcUpdateVEndorFeedbackReim: "/qcupdate/addReQCUpdateVendorFeedBack?investigationId=",

    qcUpdateFinal: "/qcupdate/qcUpdateFinal?investigationId=",
    qcUpdateFinalReim: "/qcupdate/reqcUpdateFinal?investigationId=",

    qcUpdateData: "/qcupdate/getQCUpdateData",

    caseUpdate: "/activecase/addCaseUpdate?investigationId=",
    caseUpdateHspitl: "/activecase/addCaseUpdateHospital?investigationId=",
    caseUpdateFindings: "/activecase/addCaseUpdateAnyOtherObservation?investigationId=",
    caseUpdateFinal: "/activecase/caseUpdateFinal?investigationId=",
    caseUpdatePreview: "/activecase/getCaseUpdateData?invClaimId=",
    setupOrganization: "/organization/addOrganization",
    acceptAssign: "/accept-assign/acceptAssign",
    acceptAssignFO: "/accept-assign/acceptAssignAgency",
    fetchZones: "/zone/getAllZones",
    fetchZonesByUser: "/dashboard/getUserZone",

    recomendationDropdown: "/codeMaster/getCode/recommendation",
    repudiationGroundDropdown: "/codeMaster/getCode/repudiationGrounds",
    frodClaimReason: "/claims/getFraudClaimReasons",
    froudClaimEvidences: "/claims/getFraudEvidences",
    claimDetails: "/claims/getClaimsDataByInvClaimId/",
    reclaimDetails: "/reclaims/getClaimsDataByInvClaimId/",
    getAllQCClaims: "/claims/getAllQCClaims",
    getLogDetailsBySbigClaimNo: "/claims/getLogDetailsBySbigClaimNo",

    denyReasons: "/denialreason/getAllDenialReasons",

    denyRequest: "/accept-assign/deny",

    forQuestions: "/questionairy/getQuestions?questionType=",

    fetchAllAgencies: "/agency/agencies",
    addAgency: "/agency/addAgency",
    editAgency: "/agency/editAgency",

    allPendingFromCentralCashless: "/claims/getAllQCPendingFromCentralCases",
    allPendingFromCentralReim: "/reclaims/getAllQCPendingFromCentralCases",
    allCentralQueryCashless: "/claims/getAllQCCentralQueryCases",
    allCentralQueryReim: "/reclaims/getAllQCCentralQueryCases",
    allQCPendingCaseCashless: "/claims/getAllQCPendingCases",
    allQCPendingCaseReim: "/reclaims/getAllQCPendingCases",
    fetchDenyClaim: "/claims/getClaimsDataByInvClaimIdDenied/",
    citiesByStates: "/city/getCitiesByStates",
    userCitiesByStates: "/dashboard/getUserCity",
    pincodesByCities: "/pincode/getPincodesByCities",

    allUsers: "/user/getAllUsers",
    getUserbycode: "/user/getUserByCode?userCodeFromUI=",

    tatRuleSubmit: "/tat/addTAT",
    forTatTable: "/tat/tats",
    forCodeType: "/codeMaster/getCode/",
    forSingleTat: "/tat/getTat/",
    editTat: "/tat/updateTat/",
    deleteTat: "/tat/deleteTat/",

    downloadUrl: "/claims/getClaimsDataByInvClaimIdForPDF?invClaimId=",


    getAssignUsers: "/user/getUsersByRegionByUserCode",
    docsView: "/documents/getAllDocumentsByUploadedDuring",
    viewDocument: "/documents/downloadDocument?docLocation=",
    uploadInvestigationDocs: "/documents/uploadInvestigationDocument",
    getSystemSuggestedAgencies: "/agency/findAgencyByRegionByAgencyCodeandRoleCode",
    checkAccountSetup: "/organization/accountSetupDone",
    allFieldOfficers: "/user/getFieldOfficers",
    allRegionalUsers: "/user/getAllRegionalUsers",
    changePassword: "/user/changePassword",
    logout: "/authentication/logout",
    agencyuserbycode: "/agency/getUserByCode?agencyCodeFromUI=",


    addRuleAssign: "/ruleassign/addRuleAssign",
    getRuleAssign: "/ruleassign/getCaseAssignmentRules",
    getAssignedRuleByCode: "/ruleassign/getCaseAssignmentRule/",

    agencyQCUpdates: "/claimsQC/updateClaimsQC?investigationId=",
    agencyQCUpdatesReim: "/claimsQC/updateClaimsQCReim?investigationId=",

    getAllDashboardDetails: "/dashboard/getAllDashboardDetails",
    getAllDashboardDetailsWithFilter: "/dashboard/getAllDashboardDetailsWithFilter",
    qcupdateDetails: "/qcupdate/getQCUpdateData?invClaimId=",
    qcupdateDetailsReim: "/qcupdate/getReQCUpdateData?invClaimId=",

    qcUpdateDetailsWithId: "/qcupdate/getQCUpdateByID/",
    getGroundDetails: "/qcupdate/getGroundDetails",
    getGroundFraudDetails: "/qcupdate/getGroundFraudDetails",
    getGroundExclusionDetails: "/qcupdate/getGroundExclusionDetails",
    getMisrepresentationFraudDetails: "/qcupdate/getMisrepresentationFraudDetails",
    logs: "/claims/getLogDetails/",
    relogs: "/reclaims/getLogDetails/",
    caseUpdatePreviousData: "/activecase/getCaseUpdateData?invClaimId=",
    caseUpdatePreviousDataReim: "/reactivecase/getReCaseUpdateData?invClaimId=",
    addQuestion: "/questionairy/addQuestion",
    getPerformanceIndex: "/user/getPerformanceIndexDetailsByUser?userCode=",
    getPerformanceIndexRegionalMembers: "/user/getPerformanceIndexDetails?userCode=",

    reimFreshClaims: "/reclaims/getAllAgencyDeniedCases",
    reimRegionalDeniedCases: "/reclaims/getAllRegionalDeniedCases",
    reimAssignAgencyFreshClaims: "/reclaims/getAssignedToAgencyCases",

    reimActiveClaims: "/reclaims/getClaimsActive",
    reimQCClaims: "/reclaims/getAllQCClaims",
    reimCaseAssign: "/accept-assign/acceptReimbursementAssign",
    reimAgencyCaseAssign: "/accept-assign/acceptReimbursementAgencyAssign",
    caseInfoDetails: "/claims/getCaseInfoDetails/",
    recaseInfoDetails: "/reclaims/getCaseInfoDetails/",
    deleteDocument: "/documents/deleteDocumentById",
    getAllCompleteClaims: "/claims/getAllCompleteClaims",
    reimgetAllCompleteClaims: "/reclaims/getAllCompleteClaims",
    getAgencyQCUpdateData: "/claimsQC/getClaimQCUpdateData?invClaimId=",
    getReclaimQCUpdateData: "/claimsQC/getReClaimQCUpdateData?invClaimId=",

    fetchReinvClaims: "/claims/getReinvestmentClaims",
    fetchReinvreClaims: "/reclaims/getReinvestmentClaims",

    reCaseUpdateEmployeer: "/reactivecase/addReCaseUpdateEmployeer?investigationId=",
    reCaseUpdateHospital: "/reactivecase/addReCaseUpdate?investigationId=",
    reCaseUpdateHospitalVeri: "/reactivecase/addReCaseUpdateHospital?investigationId=",

    finalReimCaseUpdate: "/reactivecase/reCaseUpdateFinal?investigationId=",

    getPDFDetails: "/claims/getPDFDetails",

    reCaseUpdateInsured: "/reactivecase/addReCaseUpdateInsured?investigationId=",

    getTabDetails: "/reclaims/getSplitCaseTabDetails?invClaimId=",
    mdmDetails: "/agency/getAgencyByMDM?mdmID=",

    getAssignedToSelfCases: "/claims/getAllAgencyAssignedToSelf",
    getReclaimsAssignedToSelfCases: "/reclaims/getAllAgencyAssignedToSelf",
    getAssignedToSelfCasesReg: "/claims/getAssignedToSelfCases",
    getAssignedToSelfCasesRegReim: "/reclaims/getAssignedToSelfCases",
    getReclaimsAssignedToSelfCasesReg: "/reclaims/getAssignedToSelfCases",
    getNotCompletedCasesReg: "/claims/getAllCompleteCaseNotInvestigated",
    getNotCompletedCasesRegReim: "/reclaims/getAllCompleteCaseNotInvestigated",
    getCompletedCasesReg: "/claims/getAllCompleteInvestigationCases",
    getCompletedCasesRegReim: "/reclaims/getAllCompleteInvestigationCases",
    getAssignedToFOCases: "/claims/getAllAgencyAssignedToFO",
    getReclaimsAssignedToFOCases: "/reclaims/getAllAgencyAssignedToFO",
    getAssignedToAgencyCases: "/claims/getAssignedToAgencyCases",
    getReclaimedAssignedToAgencyCases: "/reclaims/getAssignedToAgencyCases",

    getReworkClaims: "/claims/getAllAgencyReworkCases",
    getReworkReclaims: "/reclaims/getAllAgencyReworkCases",
    getReAssignClaims: "/claims/getAllAgencyReassignedCases",
    getReAssignClaimsReim: "/reclaims/getAllAgencyReassignedCases",
    getReAssignReclaims: "/reclaims/getAllAgencyReassignedCases",
    getReworkClaimsReg: "/claims/getReworkClaims",
    getReworkReclaimsReg: "/reclaims/getReworkClaims",
    getReAssignClaimsReg: "/claims/getReAssignClaims",
    getReAssignClaimsRegReim: "/reclaims/getReAssignClaims",
    getReAssignReclaimsReg: "/reclaims/getReAssignClaims",

    fetchAgencyNewCases: "/claims/getAgencyNewCases",
    fetchReclaimsAgencyNewCases: "/reclaims/getAgencyNewCases",
    fetchAgencySelfDeniedCase: "/claims/getAllAgencySelfDeniedCases",
    fetchReclaimsAgencySelfDeniedCase: "/reclaims/getAllAgencySelfDeniedCases",
    fetchRegionalSelfDeniedCase: "/claims/getAllRegionalDeniedCases",
    fetchReclaimsRegionalSelfDeniedCase: "/reclaims/getAllRegionalDeniedCases",

    fetchAgencyNotInvestigatedCase: "/claims/getAllAgencyCaseNotInvestigated",
    fetchReclaimsAgencyNotInvestigatedCase: "/reclaims/getAllAgencyCaseNotInvestigated",
    fetchAgencyInvestigationCompletedCase: "/claims/getAllAgencyInvestigationCompleted",
    fetchReclaimsAgencyInvestigationCompletedCase: "/reclaims/getAllAgencyInvestigationCompleted",

    fetchAllAssignedToFo: "/claims/getAllFOAssignedTo",
    getAllAssignedToReim: "/reclaims/getAllFOAssignedTo",


    getAllAgencyPendingFromReg: "/claims/getAllAgencyPendingFromReg",
    getAllAgencyPendingFromRegReim: "/reclaims/getAllAgencyPendingFromReg",
    getAllAgencyQCPending: "/claims/getAllAgencyQCPending",
    getAllAgencyQCPendingReim: "/reclaims/getAllAgencyQCPending",

    fetchReports: "/reports/fetchReports",

    forgotPassword: "/user/forgotPassword",
    verifyPassword: "/user/verifyPassword",
    resetPassword: "/user/resetPassword",

    getAllDocumentsByClaimId: "/documents/getDocumentsBySBIGClaimId",
    getPDFFromEO2: "/claims/getPDFDetailsFromEO2",

    sendRemindMail: "/email/sendEmailByUser",

    corporateSearch: "/claims/getCorporateSearch",
    providerSearch: "/claims/getProviderSearch",
    policySearch: "/claims/getPolicySearch",

    qcUpdateDataBuClaimId: "/qcupdate/getQCUpdateDataBySbigClaimNo",
    regqcUpdateDataBuClaimId: "/qcupdate/getReQCUpdateDataBySbigClaimNo",

    fetchDeniedClaimsByClaimNo: "/claims/getDeniedBySbigClaimNo",

    getAllDashboard: "/dashboard/getAllDashboard",

    getReports: "/reports/getReportDetails/",

    deleteAgency: "/agency/deleteAgency/",

    pedEvidences: "/claimsQC/getPEDClaimEvidence",

    getAllCentralInvestigationCompletedByPage: "/claims/getAllCentralInvestigationCompletedByPage",

    getAllCentralInvestigationTotalCompleted: "/claims/getAllCentralInvestigationTotalCompleted",

    getAllCentralInvestigationCompletedBySearch: "/claims/getAllCentralInvestigationCompletedBySearch",

    getAllCentralInvestigationTotalCompletedReClaims: "/reclaims/getAllCentralInvestigationTotalCompleted",

    getAllCentralInvestigationCompletedByPageReClaims: "/reclaims/getAllCentralInvestigationCompletedByPage",

    getAllCentralInvestigationCompletedBySearchReClaims: "/reclaims/getAllCentralInvestigationCompletedBySearch",

    employerVerification: `/reactivecase/addReCaseUpdateEmployeer?investigationId=`,
    hospitalVerification: `/reactivecase/addReCaseUpdate?investigationId=`,
    insuredVerification: `/reactivecase/addReCaseUpdateInsured?investigationId=`,
    reimFinalSubmit: `/api/reim/final-submit`,
    reimDraftSave: `/api/reim/draft-save`,
}



// export const apiurls = {
//   // login: `${BASE_URL}/api/auth/login`,
//   login: `${BASE_URL}/authentication/authenticate`,
//   logout: `${BASE_URL}/api/auth/logout`,
//   changePassword: `${BASE_URL}/api/auth/change-password`,
//   sessionOut: `${BASE_URL}/authentication/logout`,
//   forgotPassword: `${BASE_URL}/api/user/forgot-password`,
//   verifyPassword: `${BASE_URL}/api/user/verify-password`,
//   resetPassword: `${BASE_URL}/api/user/reset-password`,
//   caseInfo: `${BASE_URL}/claims/getCaseInfoDetails`,
//   caseInfoReim: `${BASE_URL}/reclaims/getCaseInfoDetails`,
//   downloadConsentLetter: `${BASE_URL}/api/documents/consent-letter`,
//   downloadHospitalLetter: `${BASE_URL}/api/documents/hospital-letter`,
//   downloadVendorLetter: `${BASE_URL}/api/documents/vendor-letter`,
//   caseUpdatePreview: `${BASE_URL}/api/case-update/preview`,
//   caseUpdatePreviewReim: `${BASE_URL}/api/case-update/preview-reim`, // NEW
//   caseUpdateFinal: `${BASE_URL}/api/case-update/final`,
//   employerVerification: `${BASE_URL}/reactivecase/addReCaseUpdateEmployeer?investigationId=`,
//   hospitalVerification: `${BASE_URL}/reactivecase/addReCaseUpdate?investigationId=`,
//   insuredVerification: `${BASE_URL}/reactivecase/addReCaseUpdateInsured?investigationId=`,
//   reimFinalSubmit: `${BASE_URL}/api/reim/final-submit`,
//   reimDraftSave: `${BASE_URL}/api/reim/draft-save`,
// };