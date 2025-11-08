import { API_ENDPOINTS } from '../config/api';
import { authService } from './authService';

export interface ShopSettings {
  id: number;
  openingTime: string; // HH:mm format
  closingTime: string; // HH:mm format
  operatingDays: number[]; // 0=Sunday, 1=Monday, ... 6=Saturday
  isShopOpen: boolean;
  closedDates: string[]; // ISO format dates
}

export interface UpdateShopSettingsRequest {
  openingTime: string;
  closingTime: string;
  operatingDays: number[];
  isShopOpen: boolean;
}

export interface ClosedDateRequest {
  date: string; // ISO format: yyyy-MM-dd
  reason?: string;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

class ShopSettingsService {
  /**
   * Get current shop settings
   */
  async getShopSettings(): Promise<ShopSettings> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_ENDPOINTS.ADMIN.SETTINGS}`,
        { method: 'GET' }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch shop settings');
      }

      const apiResponse: ApiResponse<ShopSettings> = await response.json();
      return apiResponse.data;
    } catch (error: any) {
      console.error('Fetch shop settings error:', error);
      throw error;
    }
  }

  /**
   * Update shop settings
   */
  async updateShopSettings(data: UpdateShopSettingsRequest): Promise<ShopSettings> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_ENDPOINTS.ADMIN.SETTINGS}`,
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update shop settings');
      }

      const apiResponse: ApiResponse<ShopSettings> = await response.json();
      return apiResponse.data;
    } catch (error: any) {
      console.error('Update shop settings error:', error);
      throw error;
    }
  }

  /**
   * Add a closed date
   */
  async addClosedDate(data: ClosedDateRequest): Promise<ShopSettings> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_ENDPOINTS.ADMIN.SETTINGS}/closed-dates`,
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add closed date');
      }

      const apiResponse: ApiResponse<ShopSettings> = await response.json();
      return apiResponse.data;
    } catch (error: any) {
      console.error('Add closed date error:', error);
      throw error;
    }
  }

  /**
   * Remove a closed date
   */
  async removeClosedDate(date: string): Promise<ShopSettings> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_ENDPOINTS.ADMIN.SETTINGS}/closed-dates/remove`,
        {
          method: 'POST',
          body: JSON.stringify(date),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove closed date');
      }

      const apiResponse: ApiResponse<ShopSettings> = await response.json();
      return apiResponse.data;
    } catch (error: any) {
      console.error('Remove closed date error:', error);
      throw error;
    }
  }

  /**
   * Check if shop is open on a specific date (client-side check)
   */
  isShopOpenOnDate(date: Date, settings: ShopSettings): boolean {
    // Check if shop is globally closed
    if (!settings.isShopOpen) {
      return false;
    }

    // Check if date is in closed dates
    const dateStr = date.toISOString().split('T')[0];
    if (settings.closedDates.includes(dateStr)) {
      return false;
    }

    // Check if day of week is in operating days
    const dayOfWeek = date.getDay(); // 0=Sunday, 1=Monday, ... 6=Saturday
    return settings.operatingDays.includes(dayOfWeek);
  }

  /**
   * Get disabled dates for date pickers
   */
  getDisabledDates(settings: ShopSettings): Date[] {
    const disabled: Date[] = [];
    
    // Add all closed dates
    settings.closedDates.forEach(dateStr => {
      disabled.push(new Date(dateStr));
    });

    return disabled;
  }

  /**
   * Check if a date should be disabled in date picker
   */
  shouldDisableDate(date: Date, settings: ShopSettings): boolean {
    return !this.isShopOpenOnDate(date, settings);
  }
}

export const shopSettingsService = new ShopSettingsService();
