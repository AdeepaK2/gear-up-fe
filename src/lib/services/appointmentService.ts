import { API_ENDPOINTS } from '../config/api';
import { authService } from './authService';
import type {
  Appointment,
  AppointmentCreateRequest,
  AppointmentUpdateRequest,
  ApiResponse
} from '../types/Appointment';

class AppointmentService {

  // Get all appointments for the current customer
  async getAllAppointments(): Promise<Appointment[]> {
    try {
      const response = await authService.authenticatedFetch(
        API_ENDPOINTS.APPOINTMENTS.BASE,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch appointments');
      }

      const apiResponse: ApiResponse<Appointment[]> = await response.json();
      return apiResponse.data;
    } catch (error: any) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  }

  // Get an appointment by ID
  async getAppointmentById(id: number): Promise<Appointment> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_ENDPOINTS.APPOINTMENTS.BASE}/${id}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch appointment');
      }

      const apiResponse: ApiResponse<Appointment> = await response.json();
      return apiResponse.data;
    } catch (error: any) {
      console.error('Error fetching appointment:', error);
      throw error;
    }
  }

  // Create a new appointment
  async createAppointment(appointmentData: AppointmentCreateRequest): Promise<Appointment> {
    try {
      const response = await authService.authenticatedFetch(
        API_ENDPOINTS.APPOINTMENTS.BASE,
        {
          method: 'POST',
          body: JSON.stringify(appointmentData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create appointment');
      }

      const apiResponse: ApiResponse<Appointment> = await response.json();
      return apiResponse.data;
    } catch (error: any) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  }

  // Update an appointment
  async updateAppointment(id: number, appointmentData: AppointmentUpdateRequest): Promise<Appointment> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_ENDPOINTS.APPOINTMENTS.BASE}/${id}`,
        {
          method: 'PATCH',
          body: JSON.stringify(appointmentData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update appointment');
      }

      const apiResponse: ApiResponse<Appointment> = await response.json();
      return apiResponse.data;
    } catch (error: any) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  }

  // Delete an appointment
  async deleteAppointment(id: number): Promise<void> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_ENDPOINTS.APPOINTMENTS.BASE}/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete appointment');
      }
    } catch (error: any) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const appointmentService = new AppointmentService();
export default appointmentService;
