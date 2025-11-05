import { API_ENDPOINTS } from '../config/api';
import { authService } from './authService';

export interface Task {
  taskId: number;
  name: string;
  description: string;
  estimatedHours: number;
  estimatedCost: number;
  category: string;
  priority: string;
  notes: string;
  requestedBy: string;
  status: string;
  createdAt: string;
  appointmentId?: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

class TaskService {
  // Get all tasks/services
  async getAllTasks(): Promise<Task[]> {
    try {
      const response = await authService.authenticatedFetch(
        'http://localhost:8080/api/v1/tasks',
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch tasks');
      }

      const apiResponse: ApiResponse<Task[]> = await response.json();
      return apiResponse.data;
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  // Get task by ID
  async getTaskById(taskId: number): Promise<Task> {
    try {
      const response = await authService.authenticatedFetch(
        `http://localhost:8080/api/v1/tasks/${taskId}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch task');
      }

      const apiResponse: ApiResponse<Task> = await response.json();
      return apiResponse.data;
    } catch (error: any) {
      console.error('Error fetching task:', error);
      throw error;
    }
  }
}

export const taskService = new TaskService();
export default taskService;
