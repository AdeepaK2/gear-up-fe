import { API_ENDPOINTS } from '../config/api';
import { authService } from './authService';

export interface TimeLog {
  logId: number;
  description: string;
  startTime: string;
  endTime: string;
  hoursWorked: number;
  loggedAt: string;
  taskId: number;
  
  // Employee details
  employeeId: number;
  employeeName: string;
  employeeEmail: string;
  
  // Project details (optional)
  projectId?: number;
  projectName?: string;
  
  // Appointment details (optional)
  appointmentId?: number;
  appointmentDate?: string;
}

export interface CreateTimeLogDTO {
  description: string;
  startTime: string;
  endTime: string;
  taskId?: number;
  projectId?: number;
  appointmentId?: number;
}

export interface ProjectTimeLogSummary {
  projectId: number;
  projectName: string;
  totalEstimatedHours: number;
  totalLoggedHours: number;
  remainingHours: number;
  percentageUsed: number;
  isOverBudget: boolean;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

class TimeLogService {
  // Create a new time log
  async createTimeLog(timeLogData: CreateTimeLogDTO): Promise<TimeLog> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_ENDPOINTS.TIME_LOGS.BASE}`,
        {
          method: 'POST',
          body: JSON.stringify(timeLogData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create time log');
      }

      const apiResponse: ApiResponse<TimeLog> = await response.json();
      return apiResponse.data;
    } catch (error) {
      console.error('Error creating time log:', error);
      throw error;
    }
  }

  // Get all time logs
  async getAllTimeLogs(): Promise<TimeLog[]> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_ENDPOINTS.TIME_LOGS.BASE}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch time logs');
      }

      const apiResponse: ApiResponse<TimeLog[]> = await response.json();
      return apiResponse.data;
    } catch (error) {
      console.error('Error fetching time logs:', error);
      throw error;
    }
  }

  // Get project time log summary
  async getProjectTimeLogSummary(projectId: number): Promise<ProjectTimeLogSummary> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_ENDPOINTS.TIME_LOGS.BASE}/project/${projectId}/summary`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch project time log summary');
      }

      const apiResponse: ApiResponse<ProjectTimeLogSummary> = await response.json();
      return apiResponse.data;
    } catch (error) {
      console.error('Error fetching project time log summary:', error);
      throw error;
    }
  }

  // Get time logs for an appointment
  async getTimeLogsByAppointment(appointmentId: number): Promise<TimeLog[]> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_ENDPOINTS.TIME_LOGS.BASE}/appointment/${appointmentId}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          return []; // No logs found
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch appointment time logs');
      }

      const apiResponse: ApiResponse<TimeLog[]> = await response.json();
      return apiResponse.data;
    } catch (error) {
      console.error('Error fetching appointment time logs:', error);
      return [];
    }
  }

  // Delete a time log
  async deleteTimeLog(logId: number): Promise<void> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_ENDPOINTS.TIME_LOGS.BASE}/${logId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete time log');
      }
    } catch (error) {
      console.error('Error deleting time log:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const timeLogService = new TimeLogService();
export default timeLogService;
