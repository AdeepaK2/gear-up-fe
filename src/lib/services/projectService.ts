import { API_ENDPOINTS } from '../config/api';
import { authService } from './authService';

export interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  customerId?: number;
  customerName?: string;
  vehicleId?: number;
  vehicleName?: string;
  appointmentId?: number;
}

export interface Task {
  id: number;
  name: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  projectId?: number;
  assignedEmployeeId?: number;
  assignedEmployeeName?: string;
}

export interface ProjectResponse {
  projects: Project[];
  tasks?: Task[];
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

class ProjectService {

  // Get all projects for the current employee
  async getEmployeeProjects(): Promise<Project[]> {
    try {
      const response = await authService.authenticatedFetch(
        API_ENDPOINTS.PROJECTS.EMPLOYEE,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.warn('Failed to fetch employee projects:', response.status, errorData);
        
        // Return empty array on error instead of throwing
        if (response.status === 400 || response.status === 404 || response.status === 500) {
          return [];
        }
        
        throw new Error(errorData.message || 'Failed to fetch employee projects');
      }

      const apiResponse: ApiResponse<Project[]> = await response.json();
      return apiResponse.data;
    } catch (error: any) {
      console.error('Error fetching employee projects:', error);
      // Return empty array instead of throwing to prevent page crash
      return [];
    }
  }

  // Get all projects
  async getAllProjects(): Promise<Project[]> {
    try {
      const response = await authService.authenticatedFetch(
        API_ENDPOINTS.PROJECTS.BASE,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch projects');
      }

      const apiResponse: ApiResponse<Project[]> = await response.json();
      return apiResponse.data;
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  // Get all projects for the current customer
  async getAllProjectsForCurrentCustomer(): Promise<Project[]> {
    try {
      console.log('Fetching projects from:', API_ENDPOINTS.PROJECTS.BASE);
      const response = await authService.authenticatedFetch(
        API_ENDPOINTS.PROJECTS.BASE,
        {
          method: 'GET',
        }
      );

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to fetch customer projects:', response.status, errorData);

        // Return empty array on error instead of throwing
        if (response.status === 400 || response.status === 404 || response.status === 500) {
          console.warn('Returning empty array due to error status:', response.status);
          return [];
        }

        throw new Error(errorData.message || 'Failed to fetch customer projects');
      }

      const apiResponse: ApiResponse<Project[]> = await response.json();
      console.log('Projects received:', apiResponse.data?.length || 0);
      console.log('Projects data:', apiResponse.data);
      return apiResponse.data || [];
    } catch (error: any) {
      console.error('CRITICAL Error fetching customer projects:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      // Return empty array instead of throwing to prevent page crash
      return [];
    }
  }

  // Get project by ID
  async getProjectById(id: number): Promise<Project> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_ENDPOINTS.PROJECTS.BASE}/${id}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch project');
      }

      const apiResponse: ApiResponse<Project> = await response.json();
      return apiResponse.data;
    } catch (error: any) {
      console.error('Error fetching project:', error);
      throw error;
    }
  }

  // Create a new project
  async createProject(projectData: {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    appointmentId: number;
    vehicleId: number;
    taskIds: number[];
  }): Promise<Project> {
    try {
      const response = await authService.authenticatedFetch(
        API_ENDPOINTS.PROJECTS.BASE,
        {
          method: 'POST',
          body: JSON.stringify(projectData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create project');
      }

      const apiResponse: ApiResponse<Project> = await response.json();
      return apiResponse.data;
    } catch (error: any) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  // Update project status
  async updateProjectStatus(id: number, status: string): Promise<Project> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_ENDPOINTS.PROJECTS.BASE}/${id}/status`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update project status');
      }

      const apiResponse: ApiResponse<Project> = await response.json();
      return apiResponse.data;
    } catch (error: any) {
      console.error('Error updating project status:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const projectService = new ProjectService();
export default projectService;