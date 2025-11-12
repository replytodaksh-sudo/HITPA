import { apiService } from './api.service';

// Types
export interface DashboardData {
  dashBoardInvestigationDTO: Array<{
    subTypeMenu: Array<{
      label: string;
      value: number;
    }>;
  }>;
  dashBoardQCDTO: Array<{
    subTypeMenu: Array<{
      label: string;
      value: number;
    }>;
  }>;
}

export interface DashboardFilters {
  caseType: string;
  retailType: number;
  stateCodes?: string[];
  cityCodes?: string[];
  agencyCodes?: string[];
  maxTat?: string;
  fromDate?: string;
  toDate?: string;
}

export interface Zone {
  zoneCode: string;
  zoneName: string;
}

export interface State {
  stateCode: string;
  stateName: string;
}

export interface City {
  cityCode: string;
  cityName: string;
}

export interface Agency {
  agencyCode: string;
  agencyName: string;
}

export interface TeamMember {
  userCode: string;
  name: string;
  email?: string;
}

/**
 * Dashboard Service
 * Handles all dashboard-related API calls
 */
class DashboardService {
  /**
   * Get all dashboard details
   */
  async getAllDashboardDetails(caseType: string, retailType: number) {
    return apiService.get<DashboardData>('/dashboard', {
      type: caseType,
      retail: retailType,
    });
  }

  /**
   * Get dashboard details with filters
   */
  async getDashboardWithFilters(filters: DashboardFilters) {
    return apiService.post<DashboardData>('/dashboard/filter', filters);
  }

  /**
   * Get all dashboard (without filters)
   */
  async getAllDashboard() {
    return apiService.get<DashboardData>('/dashboard/all');
  }

  /**
   * Get dashboard counts for stat cards
   */
  async getDashboardCounts() {
    return apiService.get<{
      retailCashless: number;
      groupCashless: number;
      retailReimbursement: number;
      groupReimbursement: number;
    }>('/dashboard/counts');
  }

  /**
   * Get zones for filter
   */
  async getZones() {
    return apiService.get<Zone[]>('/zones');
  }

  /**
   * Get user zones (role-based)
   */
  async getUserZones() {
    return apiService.get<Zone[]>('/zones/user');
  }

  /**
   * Get states by zones
   */
  async getStatesByZones(zoneCodes: string[]) {
    return apiService.post<State[]>('/states/by-zones', { zoneCodes });
  }

  /**
   * Get user states by zones (role-based)
   */
  async getUserStatesByZones(zoneCodes: string[]) {
    return apiService.post<State[]>('/states/user/by-zones', { zoneCodes });
  }

  /**
   * Get all states
   */
  async getStates() {
    return apiService.get<State[]>('/states');
  }

  /**
   * Get cities by states
   */
  async getCitiesByStates(stateCodes: string[]) {
    return apiService.post<City[]>('/cities/by-states', { stateCodes });
  }

  /**
   * Get user cities by states (role-based)
   */
  async getUserCitiesByStates(stateCodes: string[]) {
    return apiService.post<City[]>('/cities/user/by-states', { stateCodes });
  }

  /**
   * Get pincodes by cities
   */
  async getPinsByCities(cityCodes: string[]) {
    return apiService.post<Array<{ pinCode: string; pinCodeNo: string }>>(
      '/pins/by-cities',
      { cityCodes }
    );
  }

  /**
   * Get all agencies
   */
  async getAllAgencies() {
    return apiService.get<Agency[]>('/agencies');
  }

  /**
   * Get regional users
   */
  async getRegionalUsers() {
    return apiService.get<TeamMember[]>('/users/regional');
  }

  /**
   * Get field officers
   */
  async getFieldOfficers() {
    return apiService.get<TeamMember[]>('/users/field-officers');
  }

  async policySearch(payload: any) {
    return apiService.get<TeamMember[]>("/claims/getPolicySearch?clientCode=" + payload.clientCode + "&insuredName=" + payload.clientName + "&dob=" + payload.dob + "&aadharNo=" + payload.uid + "&policyGstNo=" + payload.gstno + "&policyMobileNo=" + payload.mobileno + "&policyPincode=" + payload.pincode + "&policyEmailId=" + payload.emailid + "&policyAccountNo=" + payload.accountno + "&diagonosticCenterName=" + payload.chemistname + "&gender=" + payload.gender + "&policyNo=" + payload.policyNo);
  }
  
  async providerSearch(payload: any) {
    return apiService.get<TeamMember[]>("/claims/getProviderSearch?providerGstNo=" + payload.gstno + "&rohiniCode=" + payload.rohinicode + "&providerMobileNo=" + payload.mobileno + "&providerPincode=" + payload.pincode + "&providerEmailId=" + payload.emailid + "&providerAccountNo=" + payload.accountno + "&doctorName=" + payload.doctorname + "&hospitalName=" + payload.hospitalname + "&hospitalRegNo=" + payload.hospitalregno + "&diagonosticCenterName=" + payload.chemistname + "&doctorRegNo=" + payload.regno + "&stateNames=" + payload.state + "&cityNames" + payload.city);
  }
  
  async corporateSearch(payload: any) {
    return apiService.get<TeamMember[]>("/claims/getCorporateSearch?gstNo=" + payload.gstno + "&panNo=" + payload.panno + "&mobileNo=" + payload.mobileno + "&pincode=" + payload.pincode + "&emailId=" + payload.emailid + "&accountNo=" + payload.accountno + "&corporateName=" + payload.corporatename);
  }



  // async policySearch(payload: any): Observable<any> {
  //   console.log(payload.dob);
  //   if (payload.dob == 'undefined' || payload.dob == "undefined" || payload.dob === undefined) {
  //     payload.dob = "";
  //   }
  //   return this.http.get(apiurls.policySearch + "?clientCode=" + payload.clientCode + "&insuredName=" + payload.clientName + "&dob=" + payload.dob + "&aadharNo=" + payload.uid + "&policyGstNo=" + payload.gstno + "&policyMobileNo=" + payload.mobileno + "&policyPincode=" + payload.pincode + "&policyEmailId=" + payload.emailid + "&policyAccountNo=" + payload.accountno + "&diagonosticCenterName=" + payload.chemistname + "&gender=" + payload.gender + "&policyNo=" + payload.policyNo, { responseType: 'json' });
  // }

}

// Export singleton instance
export const dashboardService = new DashboardService();

// Export class
export default DashboardService;