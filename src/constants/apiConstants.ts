const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const apiurls = {
  // login: `${BASE_URL}/api/auth/login`,
  login: `${BASE_URL}/authentication/authenticate`,
  logout: `${BASE_URL}/api/auth/logout`,
  changePassword: `${BASE_URL}/api/auth/change-password`,
  sessionOut: `${BASE_URL}/authentication/logout`,
  forgotPassword: `${BASE_URL}/api/user/forgot-password`,
  verifyPassword: `${BASE_URL}/api/user/verify-password`,
  resetPassword: `${BASE_URL}/api/user/reset-password`,
  caseInfo: `${BASE_URL}/claims/getCaseInfoDetails/`,
  caseInfoReim: `${BASE_URL}/reclaims/getCaseInfoDetails/`,
  downloadConsentLetter: `${BASE_URL}/api/documents/consent-letter`,
  downloadHospitalLetter: `${BASE_URL}/api/documents/hospital-letter`,
  downloadVendorLetter: `${BASE_URL}/api/documents/vendor-letter`,
  caseUpdatePreview: `${BASE_URL}/api/case-update/preview`,
  caseUpdatePreviewReim: `${BASE_URL}/api/case-update/preview-reim`, // NEW
  caseUpdateFinal: `${BASE_URL}/api/case-update/final`,
  employerVerification: `${BASE_URL}/reactivecase/addReCaseUpdateEmployeer?investigationId=`,
  hospitalVerification: `${BASE_URL}/reactivecase/addReCaseUpdate?investigationId=`,
  insuredVerification: `${BASE_URL}/reactivecase/addReCaseUpdateInsured?investigationId=`,
  reimFinalSubmit: `${BASE_URL}/api/reim/final-submit`,
  reimDraftSave: `${BASE_URL}/api/reim/draft-save`,
};