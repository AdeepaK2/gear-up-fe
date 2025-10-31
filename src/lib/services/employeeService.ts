import { API_ENDPOINTS } from '../config/api';
import { authService } from './authService';

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  specialization: string;
  role?: string;
}

export interface CreateEmployeeResponse {
  employee: Employee;
  temporaryPassword: string;
  message: string;
}

export interface UpdateEmployeeRequest {
  name?: string;
  specialization?: string;
  hireDate?: string;
}

export interface Employee {
  employeeId: number;
  name: string;
  email: string;
  specialization: string;
  hireDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeDependencies {
  appointmentCount: number;
  hasAppointments: boolean;
  canDelete: boolean;
  warningMessage?: string;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

class EmployeeService {

  // Get all employees
  async getAllEmployees(): Promise<Employee[]> {
    try {
      const response = await authService.authenticatedFetch(
        API_ENDPOINTS.EMPLOYEE.BASE,
        { method: 'GET' }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch employees');
      }

      const apiResponse: ApiResponse<Employee[]> = await response.json();
      return apiResponse.data;
    } catch (error: any) {
      console.error('Fetch employees error:', error);
      throw error;
    }
  }

  // Get employee by ID
  async getEmployeeById(id: number): Promise<Employee> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_ENDPOINTS.EMPLOYEE.BASE}/${id}`,
        { method: 'GET' }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch employee');
      }

      const apiResponse: ApiResponse<Employee> = await response.json();
      return apiResponse.data;
    } catch (error: any) {
      console.error('Fetch employee error:', error);
      throw error;
    }
  }

  // Create new employee (Admin only)
  async createEmployee(data: CreateEmployeeRequest): Promise<CreateEmployeeResponse> {
    try {
      const response = await authService.authenticatedFetch(
        API_ENDPOINTS.ADMIN.EMPLOYEES,
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create employee');
      }

      const apiResponse: ApiResponse<CreateEmployeeResponse> = await response.json();
      return apiResponse.data;
    } catch (error: any) {
      console.error('Create employee error:', error);
      throw error;
    }
  }

  // Update employee
  async updateEmployee(id: number, data: UpdateEmployeeRequest): Promise<Employee> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_ENDPOINTS.EMPLOYEE.BASE}/${id}`,
        {
          method: 'PATCH',
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update employee');
      }

      const apiResponse: ApiResponse<Employee> = await response.json();
      return apiResponse.data;
    } catch (error: any) {
      console.error('Update employee error:', error);
      throw error;
    }
  }

  // Check employee dependencies before deletion
  async checkDependencies(id: number): Promise<EmployeeDependencies> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_ENDPOINTS.EMPLOYEE.BASE}/${id}/dependencies`,
        { method: 'GET' }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to check dependencies');
      }

      const apiResponse: ApiResponse<EmployeeDependencies> = await response.json();
      return apiResponse.data;
    } catch (error: any) {
      console.error('Check dependencies error:', error);
      throw error;
    }
  }

  // Delete employee
  async deleteEmployee(id: number): Promise<void> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_ENDPOINTS.EMPLOYEE.BASE}/${id}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete employee');
      }
    } catch (error: any) {
      console.error('Delete employee error:', error);
      throw error;
    }
  }
}

export const employeeService = new EmployeeService();
