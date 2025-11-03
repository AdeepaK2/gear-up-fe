import API_BASE_URL from '../config/api';
import { authService } from './authService';

export interface CustomerProfile {
  name: string;
  email: string;
  profileImage?: string;
}

export interface CustomerHeader {
  name: string;
  profileImage?: string;
}

export interface CustomerSummary {
  upcomingAppointments: number;
  ongoingProjects: number;
  completedServices: number;
  pendingRequests: number;
}

export interface CustomerActivity {
  id: number;
  action: string;
  description: string;
  time: string;
}

export interface CustomerVehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
}

export interface CustomerDashboard {
  profile: CustomerProfile;
  summary: CustomerSummary;
  recentActivities: CustomerActivity[];
  vehicles: CustomerVehicle[];
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

class CustomerService {
  
  // Try to get customer ID by checking if user is a customer
  // For now, we'll skip the API call and use fallback data
  // TODO: Add backend endpoint `/customers/me` or `/customers/by-email/{email}`
  private async tryGetCustomerIdByEmail(email: string): Promise<number | null> {
    // For now, return null to always use fallback
    // This prevents the "Customer not found with id: 1" error
    console.log('Using fallback customer data for email:', email);
    return null;
  }
  
  // Get customer header info (name & profile image)
  async getCustomerHeader(customerId: number): Promise<CustomerHeader> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_BASE_URL}/customers/${customerId}/header`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch customer header');
      }

      const apiResponse: ApiResponse<CustomerHeader> = await response.json();
      return apiResponse.data;
    } catch (error: any) {
      console.error('Error fetching customer header:', error);
      throw new Error(error.message || 'Failed to fetch customer header');
    }
  }

  // Get full customer dashboard
  async getCustomerDashboard(customerId: number): Promise<CustomerDashboard> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_BASE_URL}/customers/${customerId}/dashboard`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch customer dashboard');
      }

      const apiResponse: ApiResponse<CustomerDashboard> = await response.json();
      return apiResponse.data;
    } catch (error: any) {
      console.error('Error fetching customer dashboard:', error);
      throw new Error(error.message || 'Failed to fetch customer dashboard');
    }
  }

  // Get customer profile from current user context
  async getCurrentCustomerProfile(): Promise<CustomerProfile | null> {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        return null;
      }

      // Try to get detailed profile from backend
      try {
        // First try to get customer ID from user context
        let customerId = this.extractCustomerIdFromUser(currentUser);
        
        // If not found, try to get it by email
        if (!customerId && currentUser.email) {
          customerId = await this.tryGetCustomerIdByEmail(currentUser.email);
        }
        
        if (customerId) {
          const dashboard = await this.getCustomerDashboard(customerId);
          return dashboard.profile;
        }
      } catch (apiError) {
        console.log('Customer API error:', apiError);
      }

      // Fallback to basic info from auth context
      return {
        name: currentUser.name,
        email: currentUser.email,
      };
    } catch (error: any) {
      console.error('Error fetching current customer profile:', error);
      return null;
    }
  }

  // Extract customer ID from user context or JWT - returns null if not found
  private extractCustomerIdFromUser(user: any): number | null {
    // First try to get from user object
    if (user?.customerId) {
      return typeof user.customerId === 'string' ? parseInt(user.customerId) : user.customerId;
    }

    // Try to decode JWT token to get customer ID
    try {
      if (typeof window === 'undefined') return null;
      
      const token = localStorage.getItem('accessToken');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // Check if customer ID is in the JWT payload
        if (payload.customerId) {
          return typeof payload.customerId === 'string' ? parseInt(payload.customerId) : payload.customerId;
        }
        if (payload.userId) {
          return typeof payload.userId === 'string' ? parseInt(payload.userId) : payload.userId;
        }
      }
    } catch (error) {
      console.error('Error decoding JWT:', error);
    }

    // Return null if customer ID cannot be determined
    // This will trigger the fallback to use auth context data
    return null;
  }

  // Get current customer's recent activities (for context display)
  async getCurrentCustomerContext(): Promise<{
    profile: CustomerProfile;
    currentProject?: string;
    currentService?: string;
  } | null> {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) return null;

      // Try to get detailed info from backend
      try {
        // First try to get customer ID from user context
        let customerId = this.extractCustomerIdFromUser(currentUser);
        
        // If not found, try to get it by email
        if (!customerId && currentUser.email) {
          customerId = await this.tryGetCustomerIdByEmail(currentUser.email);
        }
        
        if (customerId) {
          const dashboard = await this.getCustomerDashboard(customerId);
          
          // Get most recent activity for context
          const recentActivity = dashboard.recentActivities?.[0];
          const currentVehicle = dashboard.vehicles?.[0];

          return {
            profile: dashboard.profile,
            currentProject: currentVehicle ? `${currentVehicle.make} ${currentVehicle.model} (${currentVehicle.year})` : 'Vehicle Maintenance',
            currentService: recentActivity?.action || 'General Service',
          };
        }
      } catch (dashboardError) {
        console.log('Dashboard API error:', dashboardError);
      }
      
      // Fallback to basic user info from auth context
      return {
        profile: {
          name: currentUser.name,
          email: currentUser.email,
        },
        currentProject: 'Vehicle Maintenance',
        currentService: 'General Service',
      };
    } catch (error: any) {
      console.error('Error fetching customer context:', error);
      return null;
    }
  }
}

export const customerService = new CustomerService();