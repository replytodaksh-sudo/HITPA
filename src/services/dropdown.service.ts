// File: src/services/dropdown.service.ts
import { apiService } from './api.service';
import { apiUrls } from '../constants/apiConstants';

// ==================== INTERFACES ====================

/**
 * User Type
 */
export interface UserType {
  userTypeCode: string;
  userTypeName: string;
  [key: string]: any;
}

/**
 * Agency Type
 */
export interface AgencyType {
  agencyTypeCode: string;
  agencyTypeName: string;
  [key: string]: any;
}

/**
 * Zone
 */
export interface Zone {
  zoneCode: string;
  zoneName: string;
  [key: string]: any;
}

/**
 * State
 */
export interface State {
  stateCode: string;
  stateName: string;
  [key: string]: any;
}

/**
 * City
 */
export interface City {
  cityCode: string;
  cityName: string;
  stateCode?: string;
  [key: string]: any;
}

/**
 * Pincode
 */
export interface Pincode {
  pincode: string;
  cityCode?: string;
  [key: string]: any;
}

/**
 * Role
 */
export interface Role {
  roleCode: string;
  roleName: string;
  userTypeCode?: string;
  [key: string]: any;
}

/**
 * Recommendation
 */
export interface Recommendation {
  recommendationCode: string;
  recommendationName: string;
  [key: string]: any;
}

/**
 * Fraud Claim Reason
 */
export interface FraudClaimReason {
  fraudReasonCode: string;
  fraudReasonName: string;
  [key: string]: any;
}

/**
 * Fraud Claim Evidence
 */
export interface FraudClaimEvidence {
  fraudClaimEvidenceCode: string;
  fraudClaimEvidence: string;
  [key: string]: any;
}

/**
 * Repudiation Ground
 */
export interface RepudiationGround {
  repudiationGroundCode: string;
  repudiationGroundName: string;
  [key: string]: any;
}

/**
 * Deny Reason
 */
export interface DenyReason {
  denyReasonCode: string;
  denyReasonName: string;
  [key: string]: any;
}

/**
 * Cities By Zones Request
 */
export interface CitiesByZones {
  stateCodes: string[];
}

/**
 * States By Zones Request
 */
export interface StatesByZones {
  zoneCodes: string[];
}

/**
 * Pins By Cities Request
 */
export interface PinsByCities {
  cityCodes: string[];
}

/**
 * Primary Discrepancy
 */
export interface PrimaryDiscrepancy {
  primaryDiscrepancyCode: string;
  primaryDiscrepancyDesc: string;
  [key: string]: any;
}

/**
 * Secondary Discrepancy
 */
export interface SecondaryDiscrepancy {
  secondaryDiscripencyCode: string;
  secondaryDiscripencyDesc: string;
  primaryDiscrepancyCode?: string;
  [key: string]: any;
}

/**
 * Dropdown Response
 */
export interface DropdownResponse<T = any> {
  statusCode: number;
  message?: string;
  payload?: T;
}

// ==================== SERVICE ====================

export class DropdownService {
  /**
   * Get user types
   * @returns Promise with user types list
   */
  static async getUserType(): Promise<DropdownResponse<UserType[]>> {
    try {
      const response = await apiService.get(apiUrls.userTypeDropdown);
      return response;
    } catch (error) {
      console.error('Error in getUserType:', error);
      throw error;
    }
  }

  /**
   * Get agency types
   * @returns Promise with agency types list
   */
  static async getAgencyType(): Promise<DropdownResponse<AgencyType[]>> {
    try {
      const response = await apiService.get(apiUrls.agencyTypeDropdown);
      return response;
    } catch (error) {
      console.error('Error in getAgencyType:', error);
      throw error;
    }
  }

  /**
   * Get all zones
   * @returns Promise with zones list
   */
  static async getZones(): Promise<DropdownResponse<Zone[]>> {
    try {
      const response = await apiService.get(apiUrls.fetchZones);
      return response;
    } catch (error) {
      console.error('Error in getZones:', error);
      throw error;
    }
  }

  /**
   * Get zones for current user
   * @returns Promise with user's zones list
   */
  static async getUserZone(): Promise<DropdownResponse<Zone[]>> {
    try {
      const response = await apiService.get(apiUrls.fetchZonesByUser);
      return response;
    } catch (error) {
      console.error('Error in getUserZone:', error);
      throw error;
    }
  }

  /**
   * Get cities by states
   * @param stateCodes - Array of state codes
   * @returns Promise with cities list
   */
  static async getCitiesByStates(
    stateCodes: string[]
  ): Promise<DropdownResponse<City[]>> {
    try {
      const response = await apiService.post(apiUrls.citiesByStates, {
        stateCodes: stateCodes,
      });
      return response;
    } catch (error) {
      console.error('Error in getCitiesByStates:', error);
      throw error;
    }
  }

  /**
   * Get user cities by states
   * @param stateCodes - Array of state codes
   * @returns Promise with user's cities list
   */
  static async getUserCitiesByStates(
    stateCodes: string[]
  ): Promise<DropdownResponse<City[]>> {
    try {
      const response = await apiService.get(apiUrls.userCitiesByStates, {
        stateCode: stateCodes.join(','),
      });
      return response;
    } catch (error) {
      console.error('Error in getUserCitiesByStates:', error);
      throw error;
    }
  }

  /**
   * Get user states by zones
   * @param zoneCodes - Array of zone codes
   * @returns Promise with user's states list
   */
  static async getUserStatesByZones(
    zoneCodes: string[]
  ): Promise<DropdownResponse<State[]>> {
    try {
      const response = await apiService.get(apiUrls.userStatesDropdownByZones, {
        zoneCode: zoneCodes.join(','),
      });
      return response;
    } catch (error) {
      console.error('Error in getUserStatesByZones:', error);
      throw error;
    }
  }

  /**
   * Get states by zones
   * @param zoneCodes - Array of zone codes
   * @returns Promise with states list
   */
  static async getStatesByZones(
    zoneCodes: string[]
  ): Promise<DropdownResponse<State[]>> {
    try {
      const response = await apiService.post(apiUrls.statesDropdownByZones, {
        zoneCodes: zoneCodes,
      });
      return response;
    } catch (error) {
      console.error('Error in getStatesByZones:', error);
      throw error;
    }
  }

  /**
   * Get pincodes by cities
   * @param cityCodes - Array of city codes
   * @returns Promise with pincodes list
   */
  static async getPinsByCities(
    cityCodes: string[]
  ): Promise<DropdownResponse<Pincode[]>> {
    try {
      const response = await apiService.post(apiUrls.pincodesByCities, {
        cityCodes: cityCodes,
      });
      return response;
    } catch (error) {
      console.error('Error in getPinsByCities:', error);
      throw error;
    }
  }

  /**
   * Get all states
   * @returns Promise with states list
   */
  static async getStates(): Promise<DropdownResponse<State[]>> {
    try {
      const response = await apiService.get(apiUrls.statesDropdown);
      return response;
    } catch (error) {
      console.error('Error in getStates:', error);
      throw error;
    }
  }

  /**
   * Get cities by state code
   * @param stateCode - State code
   * @returns Promise with cities list
   */
  static async getCities(
    stateCode: string
  ): Promise<DropdownResponse<City[]>> {
    try {
      const response = await apiService.get(`${apiUrls.cityDropdown}${stateCode}`);
      return response;
    } catch (error) {
      console.error('Error in getCities:', error);
      throw error;
    }
  }

  /**
   * Get cities by multiple state codes
   * @param stateCode - Comma-separated state codes
   * @returns Promise with cities list
   */
  static async getCitiesMul(
    stateCode: string
  ): Promise<DropdownResponse<City[]>> {
    try {
      const response = await apiService.get(`${apiUrls.cityDropdownMul}${stateCode}`);
      return response;
    } catch (error) {
      console.error('Error in getCitiesMul:', error);
      throw error;
    }
  }

  /**
   * Get roles by user type
   * @param userTypeCode - User type code
   * @returns Promise with roles list
   */
  static async getRoles(
    userTypeCode: string
  ): Promise<DropdownResponse<Role[]>> {
    try {
      const response = await apiService.get(`${apiUrls.getRoles}${userTypeCode}`);
      return response;
    } catch (error) {
      console.error('Error in getRoles:', error);
      throw error;
    }
  }

  /**
   * Get recommendations
   * @returns Promise with recommendations list
   */
  static async getRecommendation(): Promise<DropdownResponse<Recommendation[]>> {
    try {
      const response = await apiService.get(apiUrls.recomendationDropdown);
      return response;
    } catch (error) {
      console.error('Error in getRecommendation:', error);
      throw error;
    }
  }

  /**
   * Get fraud claim reasons
   * @returns Promise with fraud claim reasons list
   */
  static async getFraudClaimReason(): Promise<DropdownResponse<FraudClaimReason[]>> {
    try {
      const response = await apiService.get(apiUrls.frodClaimReason);
      return response;
    } catch (error) {
      console.error('Error in getFraudClaimReason:', error);
      throw error;
    }
  }

  /**
   * Get fraud claim evidences
   * @returns Promise with fraud claim evidences list
   */
  static async getFraudClaimEvidence(): Promise<DropdownResponse<FraudClaimEvidence[]>> {
    try {
      const response = await apiService.get(apiUrls.froudClaimEvidences);
      return response;
    } catch (error) {
      console.error('Error in getFraudClaimEvidence:', error);
      throw error;
    }
  }

  /**
   * Get all evidence supporting (alias for getFraudClaimEvidence)
   * @returns Promise with fraud claim evidences list
   */
  static async getAllEvidenceSupporting(): Promise<DropdownResponse<FraudClaimEvidence[]>> {
    return this.getFraudClaimEvidence();
  }

  /**
   * Get repudiation grounds
   * @returns Promise with repudiation grounds list
   */
  static async getRepudiationGrounds(): Promise<DropdownResponse<RepudiationGround[]>> {
    try {
      const response = await apiService.get(apiUrls.repudiationGroundDropdown);
      return response;
    } catch (error) {
      console.error('Error in getRepudiationGrounds:', error);
      throw error;
    }
  }

  /**
   * Get all deny reasons
   * @returns Promise with deny reasons list
   */
  static async getAllDenyReasons(): Promise<DropdownResponse<DenyReason[]>> {
    try {
      const response = await apiService.get(apiUrls.denyReasons);
      return response;
    } catch (error) {
      console.error('Error in getAllDenyReasons:', error);
      throw error;
    }
  }

  /**
   * Get deny reasons by investigation/claim ID
   * @param invClaimId - Investigation/Claim ID (will be cleaned)
   * @returns Promise with deny reasons for specific claim
   */
  static async getDenyReasons(
    invClaimId: string
  ): Promise<DropdownResponse<DenyReason[]>> {
    try {
      // Clean investigation ID (remove suffix after space)
      const cleanInvClaimId = invClaimId.split(' ')[0];
      
      const response = await apiService.get(`${apiUrls.fetchDenyClaim}${cleanInvClaimId}`);
      return response;
    } catch (error) {
      console.error('Error in getDenyReasons:', error);
      throw error;
    }
  }

  /**
   * Get deny reasons by claim number
   * @param claimNo - Claim number
   * @returns Promise with deny reasons for specific claim
   */
  static async getDenyReasonsByClaimNo(
    claimNo: string
  ): Promise<DropdownResponse<DenyReason[]>> {
    try {
      const response = await apiService.get(apiUrls.fetchDeniedClaimsByClaimNo, {
        sbigClaimNo: claimNo,
      });
      return response;
    } catch (error) {
      console.error('Error in getDenyReasonsByClaimNo:', error);
      throw error;
    }
  }

  /**
   * Get all primary discrepancies
   * @returns Promise with primary discrepancies list
   */
  static async getAllPrimaryDiscrepancy(): Promise<DropdownResponse<PrimaryDiscrepancy[]>> {
    try {
      const response = await apiService.get(apiUrls.fetchDenyClaim);
      return response;
    } catch (error) {
      console.error('Error in getAllPrimaryDiscrepancy:', error);
      throw error;
    }
  }

  /**
   * Get secondary discrepancies by primary code
   * @param primaryCode - Primary discrepancy code
   * @returns Promise with secondary discrepancies list
   */
  static async getSecondaryDiscrepancy(
    primaryCode: string
  ): Promise<DropdownResponse<SecondaryDiscrepancy[]>> {
    try {
      const response = await apiService.get(apiUrls.fetchDenyClaim, {
        primaryCode: primaryCode,
      });
      return response;
    } catch (error) {
      console.error('Error in getSecondaryDiscrepancy:', error);
      throw error;
    }
  }

  /**
   * Get ground of rejection (main grounds)
   * @returns Promise with ground of rejection list
   */
  static async getGroundOfRejection(): Promise<DropdownResponse<any[]>> {
    try {
      const response = await apiService.get(apiUrls.fetchDenyClaim);
      return response;
    } catch (error) {
      console.error('Error in getGroundOfRejection:', error);
      throw error;
    }
  }

  /**
   * Get ground of rejection - Fraud
   * @returns Promise with fraud grounds list
   */
  static async getGroundOfRejectionFraud(): Promise<DropdownResponse<any[]>> {
    try {
      const response = await apiService.get(apiUrls.fetchDenyClaim);
      return response;
    } catch (error) {
      console.error('Error in getGroundOfRejectionFraud:', error);
      throw error;
    }
  }

  /**
   * Get ground of rejection - Exclusion
   * @returns Promise with exclusion grounds list
   */
//   static async getGroundOfRejectionExclusion(): Promise<DropdownResponse<any[]>> {
//     try {
//       const response = await apiService.get(apiUrls.getGroundOfRejectionExclusion);
//       return response;
//     } catch (error) {
//       console.error('Error in getGroundOfRejectionExclusion:', error);
//       throw error;
//     }
//   }

  /**
   * Get ground of rejection - Misrepresentation
   * @returns Promise with misrepresentation grounds list
   */
//   static async getGroundOfRejectionMisrepresentation(): Promise<DropdownResponse<any[]>> {
//     try {
//       const response = await apiService.get(apiUrls.getGroundOfRejectionMisrepresentation);
//       return response;
//     } catch (error) {
//       console.error('Error in getGroundOfRejectionMisrepresentation:', error);
//       throw error;
//     }
//   }

static async getRecomendation(): Promise<DropdownResponse<PrimaryDiscrepancy[]>> {
    try {
      const response = await apiService.get(apiUrls.recomendationDropdown);
      return response;
    } catch (error) {
      console.error('Error in getAllPrimaryDiscrepancy:', error);
      throw error;
    }
  }
  static async getFraudClaimEvedance(): Promise<DropdownResponse<PrimaryDiscrepancy[]>> {
    try {
      const response = await apiService.get(apiUrls.froudClaimEvidences);
      return response;
    } catch (error) {
      console.error('Error in getAllPrimaryDiscrepancy:', error);
      throw error;
    }
  }

  static async getUserZones(): Promise<any> {
    try {
      const response = await apiService.get(apiUrls.fetchZonesByUser);
      return response;
    } catch (error) {
      console.error('Error in allDashboard:', error);
      throw error;
    }
  }
  
  static async getAllAgencies(): Promise<any> {
    try {
      const response = await apiService.get(apiUrls.fetchAllAgencies);
      return response;
    } catch (error) {
      console.error('Error in allDashboard:', error);
      throw error;
    }
  }
  static async getRegionalUsers(): Promise<any> {
    try {
      const response = await apiService.get(apiUrls.allRegionalUsers);
      return response;
    } catch (error) {
      console.error('Error in allDashboard:', error);
      throw error;
    }
  }
  static async getFieldOfficers(): Promise<any> {
    try {
      const response = await apiService.get(apiUrls.allFieldOfficers);
      return response;
    } catch (error) {
      console.error('Error in allDashboard:', error);
      throw error;
    }
  }

}

// Export as default for convenience
export default DropdownService;