import { API_ENDPOINTS } from '../config/api';
import { authService } from './authService';
import type { EmployeeTaskSummary } from '../types/Employee';

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  specialization: string;
  role?: string;
  password?: string; // Optional - will be auto-generated if not provided
}

export interface CreateEmployeeResponse {
  email: string;
  name: string;
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

  // Generate a temporary password
  private generateTemporaryPassword(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
    let password = '';
    // Ensure at least one of each required type
    password += 'ABCDEFGHJKLMNPQRSTUVWXYZ'[Math.floor(Math.random() * 23)]; // Uppercase
    password += 'abcdefghijkmnpqrstuvwxyz'[Math.floor(Math.random() * 23)]; // Lowercase
    password += '23456789'[Math.floor(Math.random() * 8)]; // Number
    password += '!@#$%&*'[Math.floor(Math.random() * 7)]; // Special
    
    // Fill the rest randomly
    for (let i = 4; i < 12; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  // Create new employee (Admin only)
  async createEmployee(data: CreateEmployeeRequest): Promise<CreateEmployeeResponse> {
    try {
      // Generate temporary password if not provided
      const temporaryPassword = data.password || this.generateTemporaryPassword();
      
      // Prepare request data with password
      const requestData = {
        name: data.name,
        email: data.email,
        password: temporaryPassword,
      };

      const response = await authService.authenticatedFetch(
        API_ENDPOINTS.ADMIN.EMPLOYEES,
        {
          method: 'POST',
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create employee');
      }

      const apiResponse: ApiResponse<{
        email: string;
        name: string;
      }> = await response.json();

      // Return the response with the temporary password we generated
      return {
        email: apiResponse.data.email,
        name: apiResponse.data.name,
        temporaryPassword: temporaryPassword,
        message: apiResponse.message || 'Employee created successfully!'
      };
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

  // Get current employee info
  async getCurrentEmployee(): Promise<Employee> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_ENDPOINTS.EMPLOYEE.BASE}/me`,
        { method: 'GET' }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.warn('Failed to fetch current employee:', response.status, errorData);
        
        // If employee record doesn't exist, return a default/empty employee object
        if (response.status === 400 || response.status === 404 || response.status === 500) {
          console.warn('Employee record not found or invalid - returning default employee object');
          return {
            employeeId: 0,
            name: '',
            email: '',
            specialization: '',
            phone: '',
            hireDate: new Date().toISOString(),
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as Employee;
        }
        
        throw new Error(errorData.message || 'Failed to fetch current employee');
      }

      const apiResponse: ApiResponse<Employee> = await response.json();
      return apiResponse.data;
    } catch (error: any) {
      console.error('Get current employee error:', error);
      // Return default empty employee instead of throwing
      // This allows the profile page to load with empty fields
      return {
        employeeId: 0,
        name: '',
        email: '',
        specialization: '',
        phone: '',
        hireDate: new Date().toISOString(),
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Employee;
    }
  }

  // Get employee task summary for dashboard
  async getEmployeeTaskSummary(): Promise<{ [key: string]: number }> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_ENDPOINTS.TASKS.EMPLOYEE_SUMMARY}`,
        { method: 'GET' }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.warn('Task summary fetch returned non-OK status:', response.status, errorData);
        
        // Return empty summary if there's any error (missing employee record, etc)
        // This prevents the dashboard from crashing
        return {
          assigned: 0,
          inProgress: 0,
          completedToday: 0,
          total: 0,
        };
      }

      const apiResponse: ApiResponse<{ [key: string]: number }> = await response.json();
      return apiResponse.data;
    } catch (error: any) {
      console.error('Get task summary error:', error);
      // Return empty summary on error to prevent dashboard from breaking
      // This handles cases like missing employee records in the database
      return {
        assigned: 0,
        inProgress: 0,
        completedToday: 0,
        total: 0,
      };
    }
  }
}

export const employeeService = new EmployeeService();
