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
}

// Export singleton instance
export const dashboardService = new DashboardService();

// Export class
export default DashboardService;