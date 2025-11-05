import { API_ENDPOINTS } from '../config/api';
import type { ChangePasswordRequest, PasswordChangeResponse } from '../types/Auth';

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  timestamp: string;
}

class UserService {
  // Check if password change is required
  async checkPasswordStatus(): Promise<PasswordChangeResponse> {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_ENDPOINTS.AUTH.CHANGE_PASSWORD}/status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to check password status');
    }

    const apiResponse: ApiResponse<PasswordChangeResponse> = await response.json();
    return apiResponse.data;
  }

  // Change password
  async changePassword(request: ChangePasswordRequest): Promise<PasswordChangeResponse> {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to change password');
    }

    const apiResponse: ApiResponse<PasswordChangeResponse> = await response.json();
    return apiResponse.data;
  }
}

export const userService = new UserService();
