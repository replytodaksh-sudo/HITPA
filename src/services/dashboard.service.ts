// import { apiService } from './api.service';

// // Types
// export interface DashboardData {
//   dashBoardInvestigationDTO: Array<{
//     subTypeMenu: Array<{
//       label: string;
//       value: number;
//     }>;
//   }>;
//   dashBoardQCDTO: Array<{
//     subTypeMenu: Array<{
//       label: string;
//       value: number;
//     }>;
//   }>;
// }

// export interface DashboardFilters {
//   caseType: string;
//   retailType: number;
//   stateCodes?: string[];
//   cityCodes?: string[];
//   agencyCodes?: string[];
//   maxTat?: string;
//   fromDate?: string;
//   toDate?: string;
// }

// export interface Zone {
//   zoneCode: string;
//   zoneName: string;
// }

// export interface State {
//   stateCode: string;
//   stateName: string;
// }

// export interface City {
//   cityCode: string;
//   cityName: string;
// }

// export interface Agency {
//   agencyCode: string;
//   agencyName: string;
// }

// export interface TeamMember {
//   userCode: string;
//   name: string;
//   email?: string;
// }

// /**
//  * Dashboard Service
//  * Handles all dashboard-related API calls
//  */
// class DashboardService {
//   /**
//    * Get all dashboard details
//    */
//   async getAllDashboardDetails(caseType: string, retailType: number) {
//     return apiService.get<DashboardData>('/dashboard/getAllDashboardDetails', {
//       caseType: caseType,
//       isRetail: retailType,
//     });
//   }

//   /**
//    * Get dashboard details with filters
//    */
//   async getDashboardWithFilters(filters: DashboardFilters) {
//     return apiService.post<DashboardData>('/dashboard/getAllDashboardDetailsWithFilter', filters);
//   }

//   /**
//    * Get all dashboard (without filters)
//    */
//   async getAllDashboard() {
//     return apiService.get<DashboardData>('/dashboard/getAllDashboard');
//   }

//   /**
//    * Get dashboard counts for stat cards
//    */
//   // async getDashboardCounts() {
//   //   return apiService.get<{
//   //     retailCashless: number;
//   //     groupCashless: number;
//   //     retailReimbursement: number;
//   //     groupReimbursement: number;
//   //   }>('/dashboard/counts');
//   // }

//   /**
//    * Get zones for filter
//    */
//   // async getZones() {
//   //   return apiService.get<Zone[]>('/zone/getAllZones');
//   // }

//   /**
//    * Get user zones (role-based)
//    */
//   async getUserZones() {
//     return apiService.get<Zone[]>('/dashboard/getUserZone');
//   }

//   /**
//    * Get states by zones
//    */
//   async getStatesByZones(zoneCodes: string[]) {
//     return apiService.post<State[]>('/state/getStatesByZones', { zoneCodes });
//   }

//   /**
//    * Get user states by zones (role-based)
//    */
//   async getUserStatesByZones(zoneCodes: string[]) {
//     return apiService.post<State[]>('/dashboard/getUserState', { zoneCodes });
//   }

//   /**
//    * Get all states
//    */
//   async getStates() {
//     return apiService.get<State[]>('/state/getAllState');
//   }

//   /**
//    * Get cities by states
//    */
//   async getCitiesByStates(stateCodes: string[]) {
//     return apiService.post<City[]>('/city/getCitiesByStates', { stateCodes });
//   }

//   /**
//    * Get user cities by states (role-based)
//    */
//   async getUserCitiesByStates(stateCodes: string[]) {
//     return apiService.post<City[]>('/dashboard/getUserCity', { stateCodes });
//   }

//   /**
//    * Get pincodes by cities
//    */
//   // async getPinsByCities(cityCodes: string[]) {
//   //   return apiService.post<Array<{ pinCode: string; pinCodeNo: string }>>(
//   //     '/pincode/getPincodesByCities',
//   //     { cityCodes }
//   //   );
//   // }

//   /**
//    * Get all agencies
//    */
//   async getAllAgencies() {
//     return apiService.get<Agency[]>('/agency/agencies');
//   }

//   /**
//    * Get regional users
//    */
//   async getRegionalUsers() {
//     return apiService.get<TeamMember[]>('/user/getAllRegionalUsers');
//   }

//   /**
//    * Get field officers
//    */
//   async getFieldOfficers() {
//     return apiService.get<TeamMember[]>('/user/getFieldOfficers');
//   }

//   async policySearch(payload: any) {
//     return apiService.get<TeamMember[]>("/claims/getPolicySearch?clientCode=" + payload.clientCode + "&insuredName=" + payload.clientName + "&dob=" + payload.dob + "&aadharNo=" + payload.uid + "&policyGstNo=" + payload.gstno + "&policyMobileNo=" + payload.mobileno + "&policyPincode=" + payload.pincode + "&policyEmailId=" + payload.emailid + "&policyAccountNo=" + payload.accountno + "&diagonosticCenterName=" + payload.chemistname + "&gender=" + payload.gender + "&policyNo=" + payload.policyNo);
//   }
  
//   async providerSearch(payload: any) {
//     return apiService.get<TeamMember[]>("/claims/getProviderSearch?providerGstNo=" + payload.gstno + "&rohiniCode=" + payload.rohinicode + "&providerMobileNo=" + payload.mobileno + "&providerPincode=" + payload.pincode + "&providerEmailId=" + payload.emailid + "&providerAccountNo=" + payload.accountno + "&doctorName=" + payload.doctorname + "&hospitalName=" + payload.hospitalname + "&hospitalRegNo=" + payload.hospitalregno + "&diagonosticCenterName=" + payload.chemistname + "&doctorRegNo=" + payload.regno + "&stateNames=" + payload.state + "&cityNames" + payload.city);
//   }
  
//   async corporateSearch(payload: any) {
//     return apiService.get<TeamMember[]>("/claims/getCorporateSearch?gstNo=" + payload.gstno + "&panNo=" + payload.panno + "&mobileNo=" + payload.mobileno + "&pincode=" + payload.pincode + "&emailId=" + payload.emailid + "&accountNo=" + payload.accountno + "&corporateName=" + payload.corporatename);
//   }



//   // async policySearch(payload: any): Observable<any> {
//   //   console.log(payload.dob);
//   //   if (payload.dob == 'undefined' || payload.dob == "undefined" || payload.dob === undefined) {
//   //     payload.dob = "";
//   //   }
//   //   return this.http.get(apiurls.policySearch + "?clientCode=" + payload.clientCode + "&insuredName=" + payload.clientName + "&dob=" + payload.dob + "&aadharNo=" + payload.uid + "&policyGstNo=" + payload.gstno + "&policyMobileNo=" + payload.mobileno + "&policyPincode=" + payload.pincode + "&policyEmailId=" + payload.emailid + "&policyAccountNo=" + payload.accountno + "&diagonosticCenterName=" + payload.chemistname + "&gender=" + payload.gender + "&policyNo=" + payload.policyNo, { responseType: 'json' });
//   // }

// }

// // Export singleton instance
// export const DashboardService = new DashboardService();

// // Export class
// export default DashboardService;


// File: src/services/dashboard.service.ts
import { apiService } from './api.service';
import { apiUrls } from '../constants/apiConstants';

// ==================== INTERFACES ====================

/**
 * Dashboard Details Response
 */
export interface DashboardDetails {
  totalCases?: number;
  pendingCases?: number;
  completedCases?: number;
  assignedCases?: number;
  rejectedCases?: number;
  averageTAT?: number;
  // Add other dashboard fields as needed
  [key: string]: any;
}

/**
 * Corporate Search Payload
 */
export interface CorporateSearchPayload {
  gstno?: string;
  panno?: string;
  mobileno?: string;
  pincode?: string;
  emailid?: string;
  accountno?: string;
  corporatename?: string;
}

/**
 * Provider Search Payload
 */
export interface ProviderSearchPayload {
  gstno?: string;
  rohinicode?: string;
  mobileno?: string;
  pincode?: string;
  emailid?: string;
  accountno?: string;
  doctorname?: string;
  hospitalname?: string;
  hospitalregno?: string;
  chemistname?: string;
  regno?: string;
  state?: string;
  city?: string;
}

/**
 * Policy Search Payload
 */
export interface PolicySearchPayload {
  clientCode?: string;
  clientName?: string;
  dob?: string;
  uid?: string;
  gstno?: string;
  mobileno?: string;
  pincode?: string;
  emailid?: string;
  accountno?: string;
  chemistname?: string;
  gender?: string;
  policyNo?: string;
}

/**
 * Dashboard Response
 */
export interface DashboardResponse {
  statusCode: number;
  message?: string;
  payload?: DashboardDetails | any;
}

// ==================== SERVICE ====================

export class DashboardService {
  /**
   * Get all dashboard details
   * @param caseType - Type of case (cashless/reim)
   * @param isRetail - Retail flag (0 or 1)
   * @returns Promise with dashboard details
   */
  static async getAllDashboardDetails(
    caseType: string,
    isRetail: number
  ): Promise<DashboardResponse> {
    try {
      const response = await apiService.get(apiUrls.getAllDashboardDetails, {
        caseType,
        isRetail,
      });
      return response;
    } catch (error) {
      console.error('Error in getAllDashboardDetails:', error);
      throw error;
    }
  }

  /**
   * Get dashboard details with filters
   * @param caseType - Type of case (cashless/reim)
   * @param isRetail - Retail flag (0 or 1)
   * @param states - Array of state names
   * @param cityNames - Array of city names
   * @param agencyNames - Array of agency names
   * @param tatFilter - TAT filter string
   * @returns Promise with filtered dashboard details
   */
  static async getAllDashboardDetailsWithFilter(
    caseType: string,
    isRetail: number,
    states: string[],
    cityNames: string[],
    agencyNames: string[],
    tatFilter: string
  ): Promise<DashboardResponse> {
    try {
      // Convert arrays to comma-separated strings
      const stateNamesStr = states.join(',');
      const cityNamesStr = cityNames.join(',');
      const agencyNamesStr = agencyNames.join(',');

      const response = await apiService.get(apiUrls.getAllDashboardDetailsWithFilter, {
        caseType,
        isRetail,
        stateNames: stateNamesStr,
        cityNames: cityNamesStr,
        agencyNames: agencyNamesStr,
        tatFilter,
      });
      return response;
    } catch (error) {
      console.error('Error in getAllDashboardDetailsWithFilter:', error);
      throw error;
    }
  }

  /**
   * Corporate search
   * @param payload - Corporate search parameters
   * @returns Promise with search results
   */
  static async corporateSearch(
    payload: CorporateSearchPayload
  ): Promise<DashboardResponse> {
    try {
      const response = await apiService.get(apiUrls.corporateSearch, {
        gstNo: payload.gstno || '',
        panNo: payload.panno || '',
        mobileNo: payload.mobileno || '',
        pincode: payload.pincode || '',
        emailId: payload.emailid || '',
        accountNo: payload.accountno || '',
        corporateName: payload.corporatename || '',
      });
      return response;
    } catch (error) {
      console.error('Error in corporateSearch:', error);
      throw error;
    }
  }

  /**
   * Provider search (Hospital/Doctor/Diagnostic Center)
   * @param payload - Provider search parameters
   * @returns Promise with search results
   */
  static async providerSearch(
    payload: ProviderSearchPayload
  ): Promise<DashboardResponse> {
    try {
      const response = await apiService.get(apiUrls.providerSearch, {
        providerGstNo: payload.gstno || '',
        rohiniCode: payload.rohinicode || '',
        providerMobileNo: payload.mobileno || '',
        providerPincode: payload.pincode || '',
        providerEmailId: payload.emailid || '',
        providerAccountNo: payload.accountno || '',
        doctorName: payload.doctorname || '',
        hospitalName: payload.hospitalname || '',
        hospitalRegNo: payload.hospitalregno || '',
        diagonosticCenterName: payload.chemistname || '',
        doctorRegNo: payload.regno || '',
        stateNames: payload.state || '',
        cityNames: payload.city || '',
      });
      return response;
    } catch (error) {
      console.error('Error in providerSearch:', error);
      throw error;
    }
  }

  /**
   * Policy search
   * @param payload - Policy search parameters
   * @returns Promise with search results
   */
  static async policySearch(
    payload: PolicySearchPayload
  ): Promise<DashboardResponse> {
    try {
      // Clean DOB - handle undefined values
      let dob = payload.dob || '';
      if (dob === 'undefined' || dob === undefined || !dob) {
        dob = '';
      }

      const response = await apiService.get(apiUrls.policySearch, {
        clientCode: payload.clientCode || '',
        insuredName: payload.clientName || '',
        dob: dob,
        aadharNo: payload.uid || '',
        policyGstNo: payload.gstno || '',
        policyMobileNo: payload.mobileno || '',
        policyPincode: payload.pincode || '',
        policyEmailId: payload.emailid || '',
        policyAccountNo: payload.accountno || '',
        diagonosticCenterName: payload.chemistname || '',
        gender: payload.gender || '',
        policyNo: payload.policyNo || '',
      });
      return response;
    } catch (error) {
      console.error('Error in policySearch:', error);
      throw error;
    }
  }

  /**
   * Get all dashboard data (summary)
   * @returns Promise with all dashboard data
   */
  static async allDashboard(): Promise<DashboardResponse> {
    try {
      const response = await apiService.get(apiUrls.getAllDashboard);
      return response;
    } catch (error) {
      console.error('Error in allDashboard:', error);
      throw error;
    }
  }
  
  // static async getZones(): Promise<DashboardResponse> {
  //   try {
  //     const response = await apiService.get(apiUrls.fetchZones);
  //     return response;
  //   } catch (error) {
  //     console.error('Error in allDashboard:', error);
  //     throw error;
  //   }
  // }
  // static async getUserZones(): Promise<DashboardResponse> {
  //   try {
  //     const response = await apiService.get(apiUrls.fetchZonesByUser);
  //     return response;
  //   } catch (error) {
  //     console.error('Error in allDashboard:', error);
  //     throw error;
  //   }
  // }
  // static async getStates(): Promise<DashboardResponse> {
  //   try {
  //     const response = await apiService.get(apiUrls.statesDropdown);
  //     return response;
  //   } catch (error) {
  //     console.error('Error in allDashboard:', error);
  //     throw error;
  //   }
  // }
  // static async getAllAgencies(): Promise<DashboardResponse> {
  //   try {
  //     const response = await apiService.get(apiUrls.fetchAllAgencies);
  //     return response;
  //   } catch (error) {
  //     console.error('Error in allDashboard:', error);
  //     throw error;
  //   }
  // }
  // static async getRegionalUsers(): Promise<DashboardResponse> {
  //   try {
  //     const response = await apiService.get(apiUrls.allRegionalUsers);
  //     return response;
  //   } catch (error) {
  //     console.error('Error in allDashboard:', error);
  //     throw error;
  //   }
  // }
  // static async getFieldOfficers(): Promise<DashboardResponse> {
  //   try {
  //     const response = await apiService.get(apiUrls.allFieldOfficers);
  //     return response;
  //   } catch (error) {
  //     console.error('Error in allDashboard:', error);
  //     throw error;
  //   }
  // }
}

// Export as default for convenience
export default DashboardService;