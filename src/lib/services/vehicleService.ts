import { API_ENDPOINTS } from '../config/api';
import { authService } from './authService';
import type {
  Vehicle,
  VehicleCreateRequest,
  VehicleUpdateRequest,
  ApiResponse
} from '../types/Vehicle';

class VehicleService {

  // Get all vehicles for the current user
  async getAllVehicles(): Promise<Vehicle[]> {
    try {
      const response = await authService.authenticatedFetch(
        API_ENDPOINTS.VEHICLES.BASE,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch vehicles');
      }

      const apiResponse: ApiResponse<Vehicle[]> = await response.json();
      return apiResponse.data;
    } catch (error: any) {
      console.error('Error fetching vehicles:', error);
      throw error;
    }
  }

  // Get a vehicle by ID
  async getVehicleById(id: number): Promise<Vehicle> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_ENDPOINTS.VEHICLES.BASE}/${id}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch vehicle');
      }

      const apiResponse: ApiResponse<Vehicle> = await response.json();
      return apiResponse.data;
    } catch (error: any) {
      console.error('Error fetching vehicle:', error);
      throw error;
    }
  }

  // Get current customer vehicles
  async getCurrentCustomerVehicles(): Promise<Vehicle[]> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_ENDPOINTS.VEHICLES.BASE}/my-vehicles`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch vehicle');
      }

      const apiResponse: ApiResponse<Vehicle[]> = await response.json();
      return apiResponse.data;
    } catch (error: any) {
      console.error('Error fetching vehicle:', error);
      throw error;
    }
  }

  // Alias for getCurrentCustomerVehicles
  async getMyVehicles(): Promise<Vehicle[]> {
    return this.getCurrentCustomerVehicles();
  }

  // Create a new vehicle
  async createVehicle(vehicleData: VehicleCreateRequest): Promise<Vehicle> {
    try {
      const response = await authService.authenticatedFetch(
        API_ENDPOINTS.VEHICLES.BASE,
        {
          method: 'POST',
          body: JSON.stringify(vehicleData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create vehicle');
      }

      const apiResponse: ApiResponse<Vehicle> = await response.json();
      return apiResponse.data;
    } catch (error: any) {
      console.error('Error creating vehicle:', error);
      throw error;
    }
  }

  // Update a vehicle
  async updateVehicle(id: number, vehicleData: VehicleUpdateRequest): Promise<Vehicle> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_ENDPOINTS.VEHICLES.BASE}/${id}`,
        {
          method: 'PATCH',
          body: JSON.stringify(vehicleData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update vehicle');
      }

      const apiResponse: ApiResponse<Vehicle> = await response.json();
      return apiResponse.data;
    } catch (error: any) {
      console.error('Error updating vehicle:', error);
      throw error;
    }
  }

  // Delete a vehicle
  async deleteVehicle(id: number): Promise<void> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_ENDPOINTS.VEHICLES.BASE}/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete vehicle');
      }
    } catch (error: any) {
      console.error('Error deleting vehicle:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const vehicleService = new VehicleService();
export default vehicleService;
