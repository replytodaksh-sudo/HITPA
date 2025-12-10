// // src/services/setup.service.ts

// import { apiService } from './api.service';

// export const setupService = {
//   /**
//    * Send reminder email
//    * @param emailModel - Email data (to, cc, cc1, subject, body)
//    * @returns Promise with send result
//    */
//   sendRemindMail: (emailModel: {
//     to: string;
//     cc?: string;
//     cc1?: string;
//     subject: string;
//     body: string;
//   }) =>
//     apiService.post('/setup/send-reminder', emailModel),

//   /**
//    * Get system configuration
//    * @returns Promise with configuration data
//    */
//   getSystemConfig: () =>
//     apiService.get('/setup/config'),

//   /**
//    * Update system configuration
//    * @param config - Configuration object
//    * @returns Promise with update result
//    */
//   updateSystemConfig: (config: any) =>
//     apiService.put('/setup/config', config),

//   /**
//    * Get email templates
//    * @returns Promise with email templates
//    */
//   getEmailTemplates: () =>
//     apiService.get('/setup/email-templates'),

//   /**
//    * Get email template by type
//    * @param templateType - Template type (reminder, notification, etc.)
//    * @returns Promise with email template
//    */
//   getEmailTemplate: (templateType: string) =>
//     apiService.get(`/setup/email-templates/${templateType}`),

//   /**
//    * Create or update email template
//    * @param template - Template data
//    * @returns Promise with template result
//    */
//   saveEmailTemplate: (template: any) =>
//     apiService.post('/setup/email-templates', template),

//   /**
//    * Get notification settings
//    * @returns Promise with notification settings
//    */
//   getNotificationSettings: () =>
//     apiService.get('/setup/notifications'),

//   /**
//    * Update notification settings
//    * @param settings - Notification settings
//    * @returns Promise with update result
//    */
//   updateNotificationSettings: (settings: any) =>
//     apiService.put('/setup/notifications', settings),

//   /**
//    * Get user preferences
//    * @param userId - User ID
//    * @returns Promise with user preferences
//    */
//   getUserPreferences: (userId: string) =>
//     apiService.get(`/setup/preferences/${userId}`),

//   /**
//    * Update user preferences
//    * @param userId - User ID
//    * @param preferences - User preferences object
//    * @returns Promise with update result
//    */
//   updateUserPreferences: (userId: string, preferences: any) =>
//     apiService.put(`/setup/preferences/${userId}`, preferences),

//   /**
//    * Get system roles and permissions
//    * @returns Promise with roles data
//    */
//   getRoles: () =>
//     apiService.get('/setup/roles'),

//   /**
//    * Get permissions for a role
//    * @param roleCode - Role code
//    * @returns Promise with permissions
//    */
//   getRolePermissions: (roleCode: string) =>
//     apiService.get(`/setup/roles/${roleCode}/permissions`),

//   /**
//    * Update role permissions
//    * @param roleCode - Role code
//    * @param permissions - Array of permission codes
//    * @returns Promise with update result
//    */
//   updateRolePermissions: (roleCode: string, permissions: string[]) =>
//     apiService.put(`/setup/roles/${roleCode}/permissions`, { permissions }),

//   /**
//    * Send bulk emails
//    * @param emailData - Bulk email data with recipients
//    * @returns Promise with send result
//    */
//   sendBulkEmails: (emailData: {
//     recipients: string[];
//     subject: string;
//     body: string;
//     cc?: string[];
//   }) =>
//     apiService.post('/setup/send-bulk-emails', emailData),

//   /**
//    * Get email logs
//    * @param filters - Filter criteria (dateFrom, dateTo, status)
//    * @returns Promise with email logs
//    */
//   getEmailLogs: (filters?: any) =>
//     apiService.get('/setup/email-logs', { params: filters }),

//   /**
//    * Get audit logs
//    * @param filters - Filter criteria (userId, action, dateFrom, dateTo)
//    * @returns Promise with audit logs
//    */
//   getAuditLogs: (filters?: any) =>
//     apiService.get('/setup/audit-logs', { params: filters }),

//   /**
//    * Get application settings
//    * @param settingKey - Setting key
//    * @returns Promise with setting value
//    */
//   getSetting: (settingKey: string) =>
//     apiService.get(`/setup/settings/${settingKey}`),

//   /**
//    * Update application setting
//    * @param settingKey - Setting key
//    * @param settingValue - Setting value
//    * @returns Promise with update result
//    */
//   updateSetting: (settingKey: string, settingValue: any) =>
//     apiService.put(`/setup/settings/${settingKey}`, { value: settingValue }),

//   /**
//    * Get all application settings
//    * @returns Promise with all settings
//    */
//   getAllSettings: () =>
//     apiService.get('/setup/settings'),

//   /**
//    * Update multiple settings at once
//    * @param settings - Object with setting key-value pairs
//    * @returns Promise with update result
//    */
//   updateSettings: (settings: Record<string, any>) =>
//     apiService.put('/setup/settings', settings),

//   /**
//    * Send test email
//    * @param emailModel - Test email data
//    * @returns Promise with send result
//    */
//   sendTestEmail: (emailModel: {
//     to: string;
//     subject: string;
//     body: string;
//   }) =>
//     apiService.post('/setup/send-test-email', emailModel),

//   /**
//    * Validate email configuration
//    * @returns Promise with validation result
//    */
//   validateEmailConfig: () =>
//     apiService.get('/setup/validate-email-config'),

//   /**
//    * Get SMTP settings
//    * @returns Promise with SMTP settings
//    */
//   getSMTPSettings: () =>
//     apiService.get('/setup/smtp'),

//   /**
//    * Update SMTP settings
//    * @param smtpConfig - SMTP configuration
//    * @returns Promise with update result
//    */
//   updateSMTPSettings: (smtpConfig: any) =>
//     apiService.put('/setup/smtp', smtpConfig),
// };

// export default setupService;




// File: src/services/setupService.ts
import { apiService } from './api.service';
import { apiUrls } from '../constants/apiConstants';

// ==================== INTERFACES ====================
export interface Setup {
  organizationName?: string;
  organizationEmail?: string;
  organizationPhone?: string;
  organizationAddress?: string;
  organizationCity?: string;
  organizationState?: string;
  organizationPinCode?: string;
  organizationLogo?: string;
  contactPersonName?: string;
  contactPersonEmail?: string;
  contactPersonPhone?: string;
  [key: string]: any;
}

export interface EmailDto {
  to?: string;
  subject?: string;
  body?: string;
  cc?: string[];
  bcc?: string[];
  [key: string]: any;
}

export interface SetupResponse {
  statusCode: number;
  message?: string;
  payload?: any;
}

// ==================== SERVICE ====================
export const setupService = {
  /**
   * Setup organization with file upload
   * @param setupForm - Organization setup details
   * @param uploadFile - Organization logo file
   * @returns Promise with API response
   */
  setupOrganization: async (
    setupForm: Setup,
    uploadFile: File
  ): Promise<SetupResponse> => {
    try {
      const formData = new FormData();
      formData.append('organizationDetails', JSON.stringify(setupForm));
      formData.append('file', uploadFile);
      
      console.log('Setup Form:', JSON.stringify(setupForm));
      
      // Note: Using apiService.post with custom headers
      const response = await apiService.post(
        apiUrls.setupOrganization,
        formData,
        {
          headers: {
            'skip': 'true',
            // FormData will set Content-Type automatically with boundary
          },
        }
      );
      return response;
    } catch (error) {
      console.error('Error in setupOrganization:', error);
      throw error;
    }
  },

  /**
   * Check if account setup is done
   * @returns Promise with setup status
   */
  checkAccountSetupDone: async (): Promise<SetupResponse> => {
    try {
      const response = await apiService.get(apiUrls.checkAccountSetup);
      return response;
    } catch (error) {
      console.error('Error in checkAccountSetupDone:', error);
      throw error;
    }
  },

  /**
   * Send reminder email
   * @param emailModel - Email details
   * @returns Promise with API response
   */
  sendRemindMail: async (emailModel: EmailDto): Promise<SetupResponse> => {
    try {
      const response = await apiService.post(
        apiUrls.sendRemindMail,
        emailModel
      );
      return response;
    } catch (error) {
      console.error('Error in sendRemindMail:', error);
      throw error;
    }
  },
};

export default setupService;