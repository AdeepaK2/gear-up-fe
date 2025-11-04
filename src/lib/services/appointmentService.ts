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

  // Employee-specific methods

  // Get all appointments for the current employee
  async getEmployeeAppointments(): Promise<Appointment[]> {
    try {
      const response = await authService.authenticatedFetch(
        API_ENDPOINTS.APPOINTMENTS.EMPLOYEE,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.warn('Employee appointments fetch returned non-OK status:', response.status, errorData);
        // Return empty array on error to prevent page crash
        return [];
      }

      const apiResponse: ApiResponse<Appointment[]> = await response.json();
      return apiResponse.data;
    } catch (error: any) {
      console.error('Error fetching employee appointments:', error);
      // Return empty array instead of throwing to prevent page crash
      return [];
    }
  }

  // Get upcoming appointments for the current employee
  async getEmployeeUpcomingAppointments(): Promise<Appointment[]> {
    try {
      const response = await authService.authenticatedFetch(
        API_ENDPOINTS.APPOINTMENTS.EMPLOYEE_UPCOMING,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.warn('Upcoming appointments fetch returned non-OK status:', response.status, errorData);
        // Return empty array on error to prevent page crash
        return [];
      }

      const apiResponse: ApiResponse<Appointment[]> = await response.json();
      return apiResponse.data;
    } catch (error: any) {
      console.error('Error fetching upcoming appointments:', error);
      // Return empty array instead of throwing to prevent page crash
      return [];
    }
  }

  // Get appointments by month and statuses
  async getAppointmentsByMonth(year: number, month: number, statuses?: string[]): Promise<Appointment[]> {
    try {
      const params = new URLSearchParams({
        year: year.toString(),
        month: month.toString(),
      });

      if (statuses && statuses.length > 0) {
        statuses.forEach(status => params.append('statuses', status));
      }

      const response = await authService.authenticatedFetch(
        `${API_ENDPOINTS.APPOINTMENTS.BY_MONTH}?${params.toString()}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch appointments by month');
      }

      const apiResponse: ApiResponse<Appointment[]> = await response.json();
      return apiResponse.data;
    } catch (error: any) {
      console.error('Error fetching appointments by month:', error);
      throw error;
    }
  }

  // Filter appointments by date
  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_ENDPOINTS.APPOINTMENTS.FILTER_BY_DATE}?date=${date}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch appointments by date');
      }

      const apiResponse: ApiResponse<Appointment[]> = await response.json();
      return apiResponse.data;
    } catch (error: any) {
      console.error('Error fetching appointments by date:', error);
      throw error;
    }
  }

  // Search appointments
  async searchAppointments(keyword: string): Promise<Appointment[]> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_ENDPOINTS.APPOINTMENTS.SEARCH}?keyword=${encodeURIComponent(keyword)}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to search appointments');
      }

      const apiResponse: ApiResponse<Appointment[]> = await response.json();
      return apiResponse.data;
    } catch (error: any) {
      console.error('Error searching appointments:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const appointmentService = new AppointmentService();
export default appointmentService;
