import { API_ENDPOINTS } from '../config/api';
import { authService } from './authService';
import { type Task } from './taskService';

export interface AssignedEmployee {
  employeeId: number;
  name: string;
  specialization: string;
}

export interface Project {
  id: number;
  projectId?: number;
  name: string;
  projectName?: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  startDate?: string;
  endDate?: string;
  customerId?: number;
  customerName?: string;
  vehicleId?: number;
  vehicleName?: string;
  appointmentId?: number;
  assignedEmployees?: AssignedEmployee[];
  mainRepresentativeEmployeeId?: number;
  mainRepresentativeEmployeeName?: string;
  isMainRepresentative?: boolean;
}

export interface TaskCompletion {
  taskId: number;
  taskName: string;
  isCompleted: boolean;
  completionPercentage: number;
}

export interface ProjectUpdate {
  id: number;
  projectId: number;
  projectName: string;
  employeeId: number;
  employeeName: string;
  message: string;
  completedTasks?: number;
  totalTasks?: number;
  additionalCost?: number;
  additionalCostReason?: string;
  estimatedCompletionDate?: string;
  updateType: 'PROGRESS' | 'COST_CHANGE' | 'DELAY' | 'COMPLETION' | 'GENERAL';
  taskCompletions?: TaskCompletion[];
  overallCompletionPercentage?: number;
  createdAt: string;
  updatedAt: string;
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
        API_ENDPOINTS.PROJECTS.MY_ASSIGNED,
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
      return apiResponse.data.map((p: any) => ({
        ...p,
        id: p.projectId || p.id,
        name: p.projectName || p.name,
      }));
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

  // Get projects with reports for current customer
  async getProjectsWithReports(): Promise<Project[]> {
    try {
      const response = await authService.authenticatedFetch(
        API_ENDPOINTS.PROJECTS.REPORTS,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to fetch projects with reports:', response.status, errorData);
        if (response.status === 400 || response.status === 404 || response.status === 500) {
          return [];
        }
        throw new Error(errorData.message || 'Failed to fetch projects with reports');
      }

      const apiResponse: ApiResponse<Project[]> = await response.json();
      const projects = apiResponse.data || [];
      console.log('Projects with reports fetched:', projects.length, projects);
      
      // Map projectId to id for consistency
      return projects.map((p: any) => ({
        ...p,
        id: p.projectId || p.id,
        name: p.projectName || p.name,
      }));
    } catch (error: any) {
      console.error('Error fetching projects with reports:', error);
      return [];
    }
  }

  // Create a project update (Employee only - Main Representative)
  async createProjectUpdate(
    projectId: number,
    updateData: {
      message: string;
      completedTasks?: number;
      totalTasks?: number;
      additionalCost?: number;
      additionalCostReason?: string;
      estimatedCompletionDate?: string;
      updateType: 'PROGRESS' | 'COST_CHANGE' | 'DELAY' | 'COMPLETION' | 'GENERAL';
      taskCompletions?: TaskCompletion[];
      overallCompletionPercentage?: number;
    }
  ): Promise<ProjectUpdate> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_ENDPOINTS.PROJECTS.BASE}/${projectId}/updates`,
        {
          method: 'POST',
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create project update');
      }

      const apiResponse: ApiResponse<ProjectUpdate> = await response.json();
      return apiResponse.data;
    } catch (error: any) {
      console.error('Error creating project update:', error);
      throw error;
    }
  }

  // Get all updates for a project
  async getProjectUpdates(projectId: number): Promise<ProjectUpdate[]> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_ENDPOINTS.PROJECTS.BASE}/${projectId}/updates`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to fetch project updates:', response.status, errorData);
        if (response.status === 400 || response.status === 404 || response.status === 500) {
          return [];
        }
        throw new Error(errorData.message || 'Failed to fetch project updates');
      }

      const apiResponse: ApiResponse<ProjectUpdate[]> = await response.json();
      return apiResponse.data || [];
    } catch (error: any) {
      console.error('Error fetching project updates:', error);
      return [];
    }
  }

  // Get tasks for a project
  async getProjectTasks(projectId: number): Promise<Task[]> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_ENDPOINTS.PROJECTS.BASE}/${projectId}/tasks`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to fetch project tasks:', response.status, errorData);
        if (response.status === 400 || response.status === 404 || response.status === 500) {
          return [];
        }
        throw new Error(errorData.message || 'Failed to fetch project tasks');
      }

      const apiResponse: ApiResponse<Task[]> = await response.json();
      return apiResponse.data || [];
    } catch (error: any) {
      console.error('Error fetching project tasks:', error);
      return [];
    }
  }
}

// Export singleton instance
export const projectService = new ProjectService();
export default projectService;