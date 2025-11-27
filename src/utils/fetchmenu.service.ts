// src/utils/fetchmenu.service.ts

class FetchMenuService {
  // Get cashless dropdown items for TAT filter
  getCashLessDropDownItems() {
    return [
      { name: '0-3 Days', value: '0-3' },
      { name: '4-7 Days', value: '4-7' },
      { name: '8-11 Days', value: '8-11' },
      { name: '12-14 Days', value: '12-14' },
      { name: '15 Days', value: '15' },
      { name: '>=16 Days', value: '>=16' },
    ];
  }

  // Get reimbursement dropdown items for TAT filter
  getReimbursementDropDownItems() {
    return [
      { name: '0-5 Days', value: '0-5' },
      { name: '6-10 Days', value: '6-10' },
      { name: '11-15 Days', value: '11-15' },
      { name: '16-20 Days', value: '16-20' },
      { name: '21-25 Days', value: '21-25' },
      { name: '>=26 Days', value: '>=26' },
    ];
  }

  // Get CSS class based on TAT for cashless claims
  getCashlessCssClass(tat: number): string {
    if (tat >= 0 && tat <= 3) {
      return 'tat-light-green';
    } else if (tat >= 4 && tat <= 7) {
      return 'tat-dark-green';
    } else if (tat >= 8 && tat <= 14) {
      return 'tat-amber';
    } else if (tat >= 15) {
      return 'tat-red';
    }
    return '';
  }

  // Get CSS class based on TAT for reimbursement claims
  getReimbursementCssClass(tat: number): string {
    if (tat >= 0 && tat <= 5) {
      return 'tat-light-green';
    } else if (tat >= 6 && tat <= 10) {
      return 'tat-dark-green';
    } else if (tat >= 11 && tat <= 20) {
      return 'tat-amber';
    } else if (tat >= 21) {
      return 'tat-red';
    }
    return '';
  }

  // Get color hex value for TAT
  getTatColorHex(tat: number, claimType: 'cashless' | 'reimbursement' = 'cashless'): string {
    const cssClass = claimType === 'cashless' 
      ? this.getCashlessCssClass(tat) 
      : this.getReimbursementCssClass(tat);

    const colorMap: { [key: string]: string } = {
      'tat-light-green': '#c8e6c9',
      'tat-dark-green': '#81c784',
      'tat-amber': '#ffcc80',
      'tat-red': '#ef5350',
    };

    return colorMap[cssClass] || 'transparent';
  }

  // Get TAT status label
  getTatStatusLabel(tat: number, claimType: 'cashless' | 'reimbursement' = 'cashless'): string {
    const cssClass = claimType === 'cashless' 
      ? this.getCashlessCssClass(tat) 
      : this.getReimbursementCssClass(tat);

    const labelMap: { [key: string]: string } = {
      'tat-light-green': 'Excellent',
      'tat-dark-green': 'Good',
      'tat-amber': 'Warning',
      'tat-red': 'Critical',
    };

    return labelMap[cssClass] || 'Unknown';
  }
}

export const fetchMenuService = new FetchMenuService();