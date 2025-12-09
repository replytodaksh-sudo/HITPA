// File: src/services/form.service.ts
import { apiService } from './api.service';
import { apiUrls } from '../constants/apiConstants';

// ==================== INTERFACES ====================

/**
 * Form Access Details
 */
export interface FormAccess {
  formCode: string;
  formName: string;
  formRoute: string;
  formIcon?: string;
  formOrder?: number;
  hasAccess: boolean;
  [key: string]: any;
}

/**
 * Form Category
 */
export interface FormCategory {
  categoryCode: string;
  categoryName: string;
  categoryIcon?: string;
  forms: FormAccess[];
  [key: string]: any;
}

/**
 * Form Response
 */
export interface FormResponse {
  statusCode: number;
  message?: string;
  payload?: FormAccess[] | FormCategory[] | any;
}

// ==================== SERVICE ====================

export class FormService {
  /**
   * Get accessed forms for current user
   * Returns list of forms that the user has permission to access
   * @returns Promise with accessible forms list
   */
  static async getAccessedForm(): Promise<FormResponse> {
    try {
      const response = await apiService.get(apiUrls.accessedForms);
      return response;
    } catch (error) {
      console.error('Error in getAccessedForm:', error);
      throw error;
    }
  }

  /**
   * Get all forms (for admin)
   * @returns Promise with all forms list
   */
//   static async getAllForms(): Promise<FormResponse> {
//     try {
//       const response = await apiService.get(apiUrls.allForms || '/api/forms/all');
//       return response;
//     } catch (error) {
//       console.error('Error in getAllForms:', error);
//       throw error;
//     }
//   }

  /**
   * Get forms by category
   * @param categoryCode - Category code
   * @returns Promise with forms in specific category
   */
//   static async getFormsByCategory(
//     categoryCode: string
//   ): Promise<FormResponse> {
//     try {
//       const response = await apiService.get(apiUrls.formsByCategory || '/api/forms/by-category', {
//         categoryCode: categoryCode,
//       });
//       return response;
//     } catch (error) {
//       console.error('Error in getFormsByCategory:', error);
//       throw error;
//     }
//   }

  /**
   * Get form by code
   * @param formCode - Form code
   * @returns Promise with form details
   */
//   static async getFormByCode(
//     formCode: string
//   ): Promise<FormResponse> {
//     try {
//       const response = await apiService.get(`${apiUrls.formDetails || '/api/forms'}/${formCode}`);
//       return response;
//     } catch (error) {
//       console.error('Error in getFormByCode:', error);
//       throw error;
//     }
//   }

  /**
   * Check if user has access to a specific form
   * @param formCode - Form code
   * @returns Promise with access status
   */
//   static async checkFormAccess(
//     formCode: string
//   ): Promise<{ hasAccess: boolean }> {
//     try {
//       const response = await apiService.get(apiUrls.checkFormAccess || '/api/forms/check-access', {
//         formCode: formCode,
//       });
//       return response;
//     } catch (error) {
//       console.error('Error in checkFormAccess:', error);
//       throw error;
//     }
//   }

  /**
   * Get navigation menu structure for current user
   * Returns hierarchical menu based on user's form access
   * @returns Promise with navigation menu structure
   */
//   static async getNavigationMenu(): Promise<FormResponse> {
//     try {
//       const response = await apiService.get(apiUrls.navigationMenu || '/api/forms/navigation');
//       return response;
//     } catch (error) {
//       console.error('Error in getNavigationMenu:', error);
//       throw error;
//     }
//   }

  /**
   * Cache accessed forms in localStorage
   * @param forms - Forms to cache
   */
//   static cacheAccessedForms(forms: FormAccess[]): void {
//     try {
//       localStorage.setItem('accessedForms', JSON.stringify(forms));
//     } catch (error) {
//       console.error('Error caching forms:', error);
//     }
//   }

  /**
   * Get cached accessed forms from localStorage
   * @returns Cached forms or null
   */
  static getCachedAccessedForms(): FormAccess[] | null {
    try {
      const cached = localStorage.getItem('accessedForms');
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Error getting cached forms:', error);
      return null;
    }
  }

  /**
   * Clear cached forms
   */
  static clearCachedForms(): void {
    try {
      localStorage.removeItem('accessedForms');
    } catch (error) {
      console.error('Error clearing cached forms:', error);
    }
  }

  /**
   * Filter forms by access permission
   * @param forms - All forms
   * @returns Only accessible forms
   */
  static filterAccessibleForms(forms: FormAccess[]): FormAccess[] {
    return forms.filter(form => form.hasAccess === true);
  }

  /**
   * Group forms by category
   * @param forms - Forms to group
   * @returns Forms grouped by category
   */
  static groupFormsByCategory(forms: FormAccess[]): Record<string, FormAccess[]> {
    return forms.reduce((groups, form) => {
      const category = form.categoryCode || 'uncategorized';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(form);
      return groups;
    }, {} as Record<string, FormAccess[]>);
  }

  /**
   * Sort forms by order
   * @param forms - Forms to sort
   * @returns Sorted forms
   */
  static sortFormsByOrder(forms: FormAccess[]): FormAccess[] {
    return [...forms].sort((a, b) => (a.formOrder || 0) - (b.formOrder || 0));
  }
}

// Export as default for convenience
export default FormService;