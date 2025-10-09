import { API_ENDPOINTS } from '../config/api';

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  specialization: string;
  role?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  specialization: string;
  createdAt: string;
  isActive: boolean;
}

export interface CreateEmployeeResponse {
  employee: Employee;
  temporaryPassword: string;
  message: string;
}

class EmployeeService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  // Create new employee account
  async createEmployee(data: CreateEmployeeRequest): Promise<CreateEmployeeResponse> {
    try {
      const response = await fetch(`${API_ENDPOINTS.ADMIN.BASE}/employees`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create employee');
      }

      const result = await response.json();
      return result.data;
    } catch (error: any) {
      console.error('Create employee error:', error);
      throw error;
    }
  }

  // Get all employees
  async getAllEmployees(): Promise<Employee[]> {
    try {
      const response = await fetch(`${API_ENDPOINTS.ADMIN.BASE}/employees`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch employees');
      }

      const result = await response.json();
      return result.data;
    } catch (error: any) {
      console.error('Fetch employees error:', error);
      throw error;
    }
  }

  // Deactivate employee account
  async deactivateEmployee(employeeId: string): Promise<void> {
    try {
      const response = await fetch(`${API_ENDPOINTS.ADMIN.BASE}/employees/${employeeId}/deactivate`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to deactivate employee');
      }
    } catch (error: any) {
      console.error('Deactivate employee error:', error);
      throw error;
    }
  }

  // Reactivate employee account
  async reactivateEmployee(employeeId: string): Promise<void> {
    try {
      const response = await fetch(`${API_ENDPOINTS.ADMIN.BASE}/employees/${employeeId}/reactivate`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reactivate employee');
      }
    } catch (error: any) {
      console.error('Reactivate employee error:', error);
      throw error;
    }
  }

  // Resend temporary password
  async resendTemporaryPassword(employeeId: string): Promise<void> {
    try {
      const response = await fetch(`${API_ENDPOINTS.ADMIN.BASE}/employees/${employeeId}/resend-password`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to resend password');
      }
    } catch (error: any) {
      console.error('Resend password error:', error);
      throw error;
    }
  }
}

export const employeeService = new EmployeeService();
