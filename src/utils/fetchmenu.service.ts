// src/services/fetchmenu.service.ts

import { apiService } from '../services/api.service';

/**
 * TAT Dropdown Item Interface
 */
export interface TatDropdownItem {
  name: string;
  value: string;
}

/**
 * FetchMenu Service
 * Handles menu access and TAT (Turn Around Time) dropdown items and CSS classes
 */
export class fetchMenuService {
  /**
   * Get accessed menu for current user
   */
  static async accessedMenu() {
    return apiService.get('/api/menu/accessed');
  }

  /**
   * Get Cashless TAT dropdown items
   * Used for filtering cashless claims by TAT range
   * 
   * TAT Ranges:
   * - 0 Days: Same day processing
   * - 1-2 Days: Quick turnaround
   * - 3-7 Days: Normal processing
   * - 7 Days and Above: Delayed cases
   */
  static getCashLessDropDownItems(): TatDropdownItem[] {
    return [
      {
        name: '0 Days',
        value: '0 Days'
      },
      {
        name: '1-2 Days',
        value: '1-2 Days'
      },
      {
        name: '3-7 Days',
        value: '3-7 Days'
      },
      {
        name: '7 Days and Above',
        value: '7 Days and Above'
      }
    ];
  }

  /**
   * Get Reimbursement TAT dropdown items
   * Used for filtering reimbursement claims by TAT range
   * 
   * TAT Ranges:
   * - 0-12 Days: On time
   * - 12-14 Days: Acceptable range
   * - 15 Days: At threshold
   * - >=16 Days: Overdue
   */
  static getReimDropDownItems(): TatDropdownItem[] {
    return [
      {
        name: '0-12 Days',
        value: '0-12 Days'
      },
      {
        name: '12-14 Days',
        value: '12-14 Days'
      },
      {
        name: '15 Days',
        value: '15 Days'
      },
      {
        name: '>=16 Days',
        value: '>=16 Days'
      }
    ];
  }

  /**
   * Get CSS class for Cashless TAT color coding
   * 
   * Color Mapping:
   * - 0 days: Dark Green (tat-dark-green)
   * - 1-2 days: Light Green (tat-light-green)
   * - 3-7 days: Amber (tat-amber)
   * - 8+ days: Red (tat-red)
   * 
   * @param tat - Turn Around Time in days
   * @returns CSS class name
   */
  static getCashlessCssClass(tat: number): string {
    if (tat === 0) {
      return 'tat-dark-green';
    } else if (tat === 1 || tat === 2) {
      return 'tat-light-green';
    } else if (tat >= 3 && tat <= 7) {
      return 'tat-amber';
    } else {
      return 'tat-red';
    }
  }

  /**
   * Get CSS class for Reimbursement TAT color coding
   * 
   * Color Mapping:
   * - 0-11 days: Light Green (tat-light-green)
   * - 12-14 days: Dark Green (tat-dark-green)
   * - 15 days: Amber (tat-amber)
   * - 16+ days: Red (tat-red)
   * 
   * @param tat - Turn Around Time in days
   * @returns CSS class name
   */
  static getReimCssClass(tat: number): string {
    if (tat >= 0 && tat <= 11) {
      return 'tat-light-green';
    } else if (tat >= 12 && tat <= 14) {
      return 'tat-dark-green';
    } else if (tat === 15) {
      return 'tat-amber';
    } else {
      return 'tat-red';
    }
  }

  /**
   * Get MUI theme color for Cashless TAT
   * Used for DataGrid chip colors
   * 
   * @param tat - Turn Around Time in days
   * @returns MUI color: 'success' | 'info' | 'warning' | 'error'
   */
  static getCashlessMuiColor(tat: number): 'success' | 'info' | 'warning' | 'error' {
    if (tat === 0) {
      return 'success'; // Dark Green
    } else if (tat === 1 || tat === 2) {
      return 'info'; // Light Green/Blue
    } else if (tat >= 3 && tat <= 7) {
      return 'warning'; // Amber
    } else {
      return 'error'; // Red
    }
  }

  /**
   * Get MUI theme color for Reimbursement TAT
   * Used for DataGrid chip colors
   * 
   * @param tat - Turn Around Time in days
   * @returns MUI color: 'success' | 'info' | 'warning' | 'error'
   */
  static getReimMuiColor(tat: number): 'success' | 'info' | 'warning' | 'error' {
    if (tat >= 0 && tat <= 11) {
      return 'success'; // Light Green
    } else if (tat >= 12 && tat <= 14) {
      return 'info'; // Dark Green/Blue
    } else if (tat === 15) {
      return 'warning'; // Amber
    } else {
      return 'error'; // Red
    }
  }

  /**
   * Get hex color code for Cashless TAT
   * Used for custom styling
   * 
   * @param tat - Turn Around Time in days
   * @returns Hex color code
   */
  static getCashlessHexColor(tat: number): string {
    if (tat === 0) {
      return '#2e7d32'; // Dark Green
    } else if (tat === 1 || tat === 2) {
      return '#66bb6a'; // Light Green
    } else if (tat >= 3 && tat <= 7) {
      return '#ffa726'; // Amber
    } else {
      return '#f44336'; // Red
    }
  }

  /**
   * Get hex color code for Reimbursement TAT
   * Used for custom styling
   * 
   * @param tat - Turn Around Time in days
   * @returns Hex color code
   */
  static getReimHexColor(tat: number): string {
    if (tat >= 0 && tat <= 11) {
      return '#66bb6a'; // Light Green
    } else if (tat >= 12 && tat <= 14) {
      return '#2e7d32'; // Dark Green
    } else if (tat === 15) {
      return '#ffa726'; // Amber
    } else {
      return '#f44336'; // Red
    }
  }

  /**
   * Get TAT status label
   * Human-readable status based on TAT value
   * 
   * @param tat - Turn Around Time in days
   * @param claimType - 'cashless' or 'reim'
   * @returns Status label
   */
  static getTatStatusLabel(tat: number, claimType: 'cashless' | 'reim'): string {
    if (claimType === 'cashless') {
      if (tat === 0) return 'Excellent';
      if (tat <= 2) return 'Good';
      if (tat <= 7) return 'Acceptable';
      return 'Delayed';
    } else {
      if (tat <= 11) return 'On Time';
      if (tat <= 14) return 'Acceptable';
      if (tat === 15) return 'At Threshold';
      return 'Overdue';
    }
  }

  /**
   * Check if TAT is within acceptable range
   * 
   * @param tat - Turn Around Time in days
   * @param claimType - 'cashless' or 'reim'
   * @returns true if within acceptable range
   */
  static isTatAcceptable(tat: number, claimType: 'cashless' | 'reim'): boolean {
    if (claimType === 'cashless') {
      return tat <= 7;
    } else {
      return tat <= 14;
    }
  }

  /**
   * Check if TAT is critical (requires immediate attention)
   * 
   * @param tat - Turn Around Time in days
   * @param claimType - 'cashless' or 'reim'
   * @returns true if critical
   */
  static isTatCritical(tat: number, claimType: 'cashless' | 'reim'): boolean {
    if (claimType === 'cashless') {
      return tat > 7;
    } else {
      return tat > 15;
    }
  }
}

// Export default for convenience
export default fetchMenuService;



// class FetchMenuService {
//   // Get cashless dropdown items for TAT filter
//   getCashLessDropDownItems() {
//     return [
//       { name: '0-3 Days', value: '0-3' },
//       { name: '4-7 Days', value: '4-7' },
//       { name: '8-11 Days', value: '8-11' },
//       { name: '12-14 Days', value: '12-14' },
//       { name: '15 Days', value: '15' },
//       { name: '>=16 Days', value: '>=16' },
//     ];
//   }

//   // Get reimbursement dropdown items for TAT filter
//   getReimbursementDropDownItems() {
//     return [
//       { name: '0-5 Days', value: '0-5' },
//       { name: '6-10 Days', value: '6-10' },
//       { name: '11-15 Days', value: '11-15' },
//       { name: '16-20 Days', value: '16-20' },
//       { name: '21-25 Days', value: '21-25' },
//       { name: '>=26 Days', value: '>=26' },
//     ];
//   }

//   // Get CSS class based on TAT for cashless claims
//   getCashlessCssClass(tat: number): string {
//     if (tat >= 0 && tat <= 3) {
//       return 'tat-light-green';
//     } else if (tat >= 4 && tat <= 7) {
//       return 'tat-dark-green';
//     } else if (tat >= 8 && tat <= 14) {
//       return 'tat-amber';
//     } else if (tat >= 15) {
//       return 'tat-red';
//     }
//     return '';
//   }

//   // Get CSS class based on TAT for reimbursement claims
//   getReimbursementCssClass(tat: number): string {
//     if (tat >= 0 && tat <= 5) {
//       return 'tat-light-green';
//     } else if (tat >= 6 && tat <= 10) {
//       return 'tat-dark-green';
//     } else if (tat >= 11 && tat <= 20) {
//       return 'tat-amber';
//     } else if (tat >= 21) {
//       return 'tat-red';
//     }
//     return '';
//   }

//   // Get color hex value for TAT
//   getTatColorHex(tat: number, claimType: 'cashless' | 'reimbursement' = 'cashless'): string {
//     const cssClass = claimType === 'cashless' 
//       ? this.getCashlessCssClass(tat) 
//       : this.getReimbursementCssClass(tat);

//     const colorMap: { [key: string]: string } = {
//       'tat-light-green': '#c8e6c9',
//       'tat-dark-green': '#81c784',
//       'tat-amber': '#ffcc80',
//       'tat-red': '#ef5350',
//     };

//     return colorMap[cssClass] || 'transparent';
//   }

//   // Get TAT status label
//   getTatStatusLabel(tat: number, claimType: 'cashless' | 'reimbursement' = 'cashless'): string {
//     const cssClass = claimType === 'cashless' 
//       ? this.getCashlessCssClass(tat) 
//       : this.getReimbursementCssClass(tat);

//     const labelMap: { [key: string]: string } = {
//       'tat-light-green': 'Excellent',
//       'tat-dark-green': 'Good',
//       'tat-amber': 'Warning',
//       'tat-red': 'Critical',
//     };

//     return labelMap[cssClass] || 'Unknown';
//   }
  
// }

// export const fetchMenuService = new FetchMenuService();