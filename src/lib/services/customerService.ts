import { authService } from './authService';
import { API_ENDPOINTS } from '../config/api';

export interface Customer {
  customerId: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateCustomerRequest {
  name: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

class CustomerService {
  // Get all customers
  async getAllCustomers(): Promise<Customer[]> {
    try {
      const response = await authService.authenticatedFetch(
        API_ENDPOINTS.CUSTOMER.BASE,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch customers');
      }

      const apiResponse: ApiResponse<Customer[]> = await response.json();
      return apiResponse.data;
    } catch (error: any) {
      console.error('Fetch customers error:', error);
      throw error;
    }
  }

  // Get customer by ID
  async getCustomerById(id: number): Promise<Customer> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_ENDPOINTS.CUSTOMER.BASE}/${id}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch customer');
      }

      const apiResponse: ApiResponse<Customer> = await response.json();
      return apiResponse.data;
    } catch (error: any) {
      console.error('Fetch customer error:', error);
      throw error;
    }
  }

  // Create customer (Admin creates customer with account)
  async createCustomer(data: CreateCustomerRequest): Promise<Customer> {
    try {
      const response = await authService.authenticatedFetch(
        API_ENDPOINTS.CUSTOMER.BASE,
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create customer');
      }

      const apiResponse: ApiResponse<Customer> = await response.json();
      return apiResponse.data;
    } catch (error: any) {
      console.error('Create customer error:', error);
      throw error;
    }
  }

  // Delete customer
  async deleteCustomer(id: number): Promise<void> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_ENDPOINTS.CUSTOMER.BASE}/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete customer');
      }
    } catch (error: any) {
      console.error('Delete customer error:', error);
      throw error;
    }
  }

  // Deactivate customer account
  async deactivateCustomer(id: number, reason: string): Promise<void> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_ENDPOINTS.CUSTOMER.BASE}/${id}/deactivate`,
        {
          method: 'PUT',
          body: JSON.stringify({ reason }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to deactivate customer');
      }
    } catch (error: any) {
      console.error('Deactivate customer error:', error);
      throw error;
    }
  }

  // Reactivate customer account
  async reactivateCustomer(id: number): Promise<void> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_ENDPOINTS.CUSTOMER.BASE}/${id}/reactivate`,
        {
          method: 'PUT',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reactivate customer');
      }
    } catch (error: any) {
      console.error('Reactivate customer error:', error);
      throw error;
    }
  }
}

export const customerService = new CustomerService();
