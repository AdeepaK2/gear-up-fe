import { API_ENDPOINTS } from '../config/api';
import { authService } from './authService';
import type { AdminDashboardResponse } from '../types/Admin';
import type { ApiResponse } from '../types/Auth';

class AdminService {
  async getDashboard(): Promise<AdminDashboardResponse> {
    const response = await authService.authenticatedFetch(API_ENDPOINTS.ADMIN.DASHBOARD, {
      method: 'GET',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to fetch admin dashboard');
    }

    const data: ApiResponse<AdminDashboardResponse> = await response.json();
    return data.data;
  }
}

export const adminService = new AdminService();

