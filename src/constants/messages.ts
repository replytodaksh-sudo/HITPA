// File: src/constants/messages.ts

export const message = {
  // Authentication & Session
  authFailure: 'Authentication failed. Please check your credentials.',
  sessionExpired: 'Your session has expired. Please login again.',
  loginSuccess: 'Login successful!',
  logoutSuccess: 'Logged out successfully.',
  
  // General Success Messages
  success: 'Operation completed successfully.',
  saveSuccess: 'Data saved successfully.',
  updateSuccess: 'Updated successfully.',
  deleteSuccess: 'Deleted successfully.',
  submitSuccess: 'Submitted successfully.',
  
  // Form Validation
  mandatoryField: 'Please fill all mandatory fields.',
  invalidEmail: 'Please enter a valid email address.',
  invalidPhone: 'Please enter a valid phone number.',
  invalidFormat: 'Invalid format. Please check your input.',
  passwordMismatch: 'Passwords do not match.',
  
  // Case Assignment
  assignSuccess: 'Case assigned successfully.',
  assignFailure: 'Failed to assign case. Please try again.',
  cannotUseSame: 'Cannot use the same agency for all visits.',
  
  // Questions
  questionAdded: 'Question added successfully.',
  questionDeleted: 'Question deleted successfully.',
  questionUpdateSuccess: 'Question updated successfully.',
  maxQuestionsReached: 'Maximum questions limit reached (15).',
  
  // Documents
  uploadSuccess: 'Document uploaded successfully.',
  uploadFailure: 'Failed to upload document. Please try again.',
  documentDeleted: 'Document deleted successfully.',
  alreadyExistFileName: 'A document with this name already exists.',
  invalidFileFormat: 'Invalid file format. Only PDF, JPEG, GIF and TIFF are supported.',
  fileSizeExceeded: 'File size exceeds maximum limit.',
  
  // Case Updates
  finalSubmit: 'Case update submitted successfully.',
  draftSaved: 'Draft saved successfully.',
  caseUpdateSuccess: 'Case update completed successfully.',
  
  // Network & Server Errors
  networkError: 'Network error. Please check your connection.',
  serverError: 'Server error. Please try again later.',
  unknownError: 'An unknown error occurred. Please try again.',
  
  // Permissions
  noPermission: 'You do not have permission to perform this action.',
  accessDenied: 'Access denied.',
  
  // Data Operations
  dataLoaded: 'Data loaded successfully.',
  dataNotFound: 'No data found.',
  recordNotFound: 'Record not found.',
  
  // Confirmation Messages
  confirmDelete: 'Are you sure you want to delete this?',
  confirmSubmit: 'Are you sure you want to submit?',
  confirmLogout: 'Are you sure you want to logout?',
  confirmCancel: 'Are you sure you want to cancel? Unsaved changes will be lost.',
  
  // Investigation Specific
  investigationAssigned: 'Investigation assigned successfully.',
  investigationCompleted: 'Investigation completed successfully.',
  investigationPending: 'Investigation is pending.',
  investigationApproved: 'Investigation approved successfully.',
  investigationRejected: 'Investigation rejected.',
  
  // Agency Related
  agencyNotFound: 'Agency not found.',
  agencyAssigned: 'Agency assigned successfully.',
  performanceIndexLoaded: 'Performance index loaded successfully.',
  
  // Password Related
  passwordChanged: 'Password changed successfully.',
  passwordResetSent: 'Password reset link sent to your email.',
  passwordResetSuccess: 'Password reset successfully.',
  weakPassword: 'Password is too weak. Please use a stronger password.',
  
  // User Management
  userCreated: 'User created successfully.',
  userUpdated: 'User updated successfully.',
  userDeleted: 'User deleted successfully.',
  userNotFound: 'User not found.',
  
  // Case Status
  caseAccepted: 'Case accepted successfully.',
  caseDenied: 'Case denied successfully.',
  caseReassigned: 'Case reassigned successfully.',
  caseClosed: 'Case closed successfully.',
  
  // QC Related
  qcSubmitted: 'Case submitted to QC successfully.',
  qcApproved: 'QC approved successfully.',
  qcRejected: 'QC rejected. Please review and resubmit.',
  
  // Field Officer
  foUpdatePending: 'Field Officer update is pending.',
  foUpdateReceived: 'Field Officer update received.',
  foAssigned: 'Field Officer assigned successfully.',
  
  // Reports
  reportGenerated: 'Report generated successfully.',
  reportDownloaded: 'Report downloaded successfully.',
  reportNotReady: 'Report is not ready yet. Please try again later.',
  
  // Fraud Detection
  fraudTagged: 'Entity tagged as fraud successfully.',
  cautionTagged: 'Entity tagged as caution successfully.',
  fraudReportSubmitted: 'Fraud report submitted successfully.',
  
  // Hospital/Lab/Chemist
  hospitalVisitCompleted: 'Hospital visit completed successfully.',
  labReportVerified: 'Lab report verified successfully.',
  chemistVerified: 'Chemist verified successfully.',
  
  // Captcha
  invalidCaptcha: 'Invalid captcha. Please try again.',
  captchaExpired: 'Captcha expired. Please refresh.',
  
  // Session Management
  sessionActive: 'A session is already active. Do you want to logout?',
  multipleSessionsDetected: 'Multiple sessions detected. Previous session will be terminated.',
  
  // Loading
  pleaseWait: 'Please wait...',
  loading: 'Loading...',
  processing: 'Processing...',
  
  // Empty States
  noRecordsFound: 'No records found.',
  noDataAvailable: 'No data available.',
  noCasesAssigned: 'No cases assigned yet.',
  
  // Validation
  selectAtLeastOne: 'Please select at least one option.',
  enterValidValue: 'Please enter a valid value.',
  dateInvalid: 'Invalid date. Please check and try again.',
  futureDate: 'Date cannot be in the future.',
  pastDate: 'Date cannot be in the past.',
  
  // Investigation Type
  fullCaseAllocation: 'Full case allocation selected.',
  splitCaseAllocation: 'Split case allocation selected.',
  partVerification: 'Part verification selected.',
  
  // Triggers
  triggerSet: 'Major trigger set successfully.',
  triggerRequired: 'Please select a major trigger.',
  
  // Remarks
  remarksAdded: 'Remarks added successfully.',
  remarksRequired: 'Remarks are required.',
  
  // Consent
  consentRequired: 'Consent is required to proceed.',
  consentGiven: 'Consent given successfully.',
  
  // KYC
  kycCollected: 'KYC documents collected successfully.',
  kycPending: 'KYC documents collection pending.',
  kycVerified: 'KYC documents verified successfully.',
  
  // Withdrawal
  withdrawalCollected: 'Withdrawal confirmation collected.',
  withdrawalPending: 'Withdrawal confirmation pending.',
  
  // Medical
  diagnosisRecorded: 'Diagnosis recorded successfully.',
  treatmentPlanRecorded: 'Treatment plan recorded successfully.',
  medicalRecordsObtained: 'Medical records obtained successfully.',
  
  // Observation
  observationAdded: 'Observation added successfully.',
  findingRecorded: 'Finding recorded successfully.',
  
  // Doctor Visit
  doctorVisitCompleted: 'Doctor visit completed successfully.',
  doctorDetailsAdded: 'Doctor details added successfully.',
  
  // IPD Register
  ipdRegisterChecked: 'IPD register checked successfully.',
  ipdDocumentsCollected: 'IPD documents collected successfully.',
  
  // Lab/Pathologist
  pathologistDetailsAdded: 'Pathologist details added successfully.',
  labDetailsVerified: 'Lab details verified successfully.',
  
  // Feedback
  feedbackSubmitted: 'Feedback submitted successfully.',
  feedbackRequired: 'Feedback is required.',
  
  // Rating
  ratingSubmitted: 'Rating submitted successfully.',
  
  // Notification
  notificationSent: 'Notification sent successfully.',
  alertCreated: 'Alert created successfully.',
  
  // Export/Download
  exportSuccess: 'Data exported successfully.',
  downloadSuccess: 'Download completed successfully.',
  downloadFailed: 'Download failed. Please try again.',
  
  // Search
  searchResults: 'Search completed successfully.',
  noSearchResults: 'No results found for your search.',
  
  // Filter
  filterApplied: 'Filter applied successfully.',
  filterCleared: 'Filter cleared successfully.',
  
  // Pagination
  pageLoaded: 'Page loaded successfully.',
  
  // Time/Date
  invalidDateRange: 'Invalid date range. End date must be after start date.',
  dateRangeExceeded: 'Date range exceeds maximum allowed period.',
  
  // Custom Questions
  customQuestionCreated: 'Custom question created successfully.',
  customQuestionDeleted: 'Custom questions deleted successfully.',
  
  // Template
  templateSaved: 'Template saved successfully.',
  templateLoaded: 'Template loaded successfully.',
  
  // Dashboard
  dashboardRefreshed: 'Dashboard refreshed successfully.',
  statsUpdated: 'Statistics updated successfully.',
  
  // Employer Verification
  employeerVerifyAddSuccess: 'Employer verification saved successfully.',
  finalSubmitDone: 'Final submission completed successfully.',
  
  // General Actions
  actionCompleted: 'Action completed successfully.',
  actionFailed: 'Action failed. Please try again.',
  actionCancelled: 'Action cancelled.',
  
  // Timeout
  requestTimeout: 'Request timed out. Please try again.',
  sessionTimeout: 'Session timed out. Please login again.',

  treatingDocSaved:"Treating doctors list saved",
};

// Export individual message categories if needed
export const authMessages = {
  failure: message.authFailure,
  success: message.loginSuccess,
  expired: message.sessionExpired,
  logout: message.logoutSuccess,
};

export const validationMessages = {
  mandatory: message.mandatoryField,
  email: message.invalidEmail,
  phone: message.invalidPhone,
  format: message.invalidFormat,
};

export const documentMessages = {
  upload: message.uploadSuccess,
  delete: message.documentDeleted,
  duplicate: message.alreadyExistFileName,
  invalid: message.invalidFileFormat,
};

export const caseMessages = {
  assign: message.assignSuccess,
  accept: message.caseAccepted,
  deny: message.caseDenied,
  submit: message.finalSubmit,
  complete: message.caseUpdateSuccess,
};

export default message;