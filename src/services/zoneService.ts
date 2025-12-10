// File: src/services/zoneService.ts
import { apiService } from './api.service';
import { apiUrls } from '../constants/apiConstants';

// ==================== INTERFACES ====================
export interface Zone {
  zoneId?: string;
  zoneName?: string;
  zoneCode?: string;
  description?: string;
  isActive?: boolean;
  [key: string]: any;
}

export interface ZoneResponse {
  statusCode: number;
  message?: string;
  payload?: Zone[] | any;
}

// ==================== SERVICE ====================
export const zoneService = {
  /**
   * Fetch all zones
   * @returns Promise with array of zones
   */
  fetchZone: async (): Promise<ZoneResponse> => {
    try {
      const response = await apiService.get(apiUrls.fetchZones);
      return response;
    } catch (error) {
      console.error('Error in fetchZone:', error);
      throw error;
    }
  },
};

export default zoneService;