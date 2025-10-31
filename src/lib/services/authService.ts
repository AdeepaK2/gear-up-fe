import { API_ENDPOINTS } from '../config/api';
import type { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  UserResponse, 
  ApiResponse,
  User,
  UserRole,
  JwtPayload
} from '../types/Auth';

// Decode JWT token to get user info
export function decodeToken(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

// Check if token is expired
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded) return true;
  
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
}

// Get user from token
export function getUserFromToken(token: string): Partial<User> | null {
  const decoded = decodeToken(token);
  if (!decoded) return null;
  
  return {
    email: decoded.sub,
    role: decoded.role,
    isAuthenticated: true,
  };
}

class AuthService {
  private accessToken: string | null = null;

  constructor() {
    // Load token from localStorage on initialization (client-side only)
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('accessToken');
    }
  }

  // Login
  async login(credentials: LoginRequest): Promise<{ user: User; token: string }> {
    try {
      console.log('🚀 Attempting login with:', { 
        email: credentials.email,
        url: API_ENDPOINTS.AUTH.LOGIN 
      });

      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important: Include cookies for refresh token
        body: JSON.stringify(credentials),
      });

      console.log('📡 Login response status:', response.status);

      if (!response.ok) {
        let errorMessage = 'Login failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || `Login failed with status ${response.status}`;
          console.error('❌ Login error data:', errorData);
        } catch (parseError) {
          console.error('❌ Failed to parse error response:', parseError);
          errorMessage = `Login failed with status ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const apiResponse: ApiResponse<LoginResponse> = await response.json();
      const { accessToken } = apiResponse.data;

      // Store access token
      this.accessToken = accessToken;
      localStorage.setItem('accessToken', accessToken);

      // Decode token to get user info
      const userInfo = getUserFromToken(accessToken);
      
      if (!userInfo) {
        throw new Error('Invalid token received');
      }

      // Fetch full user details (name) - you might need an endpoint for this
      // For now, we'll use the decoded token info
      const user: User = {
        email: userInfo.email!,
        name: userInfo.email!.split('@')[0], // Temporary: extract name from email
        role: userInfo.role!,
        isAuthenticated: true,
      };

      // Store user info
      localStorage.setItem('user', JSON.stringify(user));

      console.log('✅ Login successful for user:', user.email);
      return { user, token: accessToken };
    } catch (error: any) {
      console.error('❌ Login error:', error);
      
      // Provide user-friendly error messages
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please ensure the backend is running on http://localhost:8080');
      }
      
      throw error;
    }
  }

  // Register
  async register(data: RegisterRequest): Promise<UserResponse> {
    try {
      console.log('🚀 Attempting registration with:', { 
        email: data.email, 
        name: data.name,
        url: API_ENDPOINTS.AUTH.REGISTER 
      });

      // Backend only expects: email, name, password (no role field)
      const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies if backend sets any
        body: JSON.stringify({
          email: data.email,
          name: data.name,
          password: data.password,
        }),
      });

      console.log('📡 Registration response status:', response.status);

      if (!response.ok) {
        let errorMessage = 'Registration failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || `Registration failed with status ${response.status}`;
          console.error('❌ Registration error data:', errorData);
        } catch (parseError) {
          console.error('❌ Failed to parse error response:', parseError);
          errorMessage = `Registration failed with status ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const apiResponse: ApiResponse<UserResponse> = await response.json();
      console.log('✅ Registration successful:', apiResponse);
      return apiResponse.data;
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      
      // Provide user-friendly error messages
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please ensure the backend is running on http://localhost:8080');
      }
      
      throw error;
    }
  }

  // Refresh access token
  async refreshToken(): Promise<string> {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.REFRESH, {
        method: 'POST',
        credentials: 'include', // Include refresh token cookie
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const apiResponse: ApiResponse<LoginResponse> = await response.json();
      const { accessToken } = apiResponse.data;

      // Update stored token
      this.accessToken = accessToken;
      localStorage.setItem('accessToken', accessToken);

      // Update user info with new token
      const userInfo = getUserFromToken(accessToken);
      if (userInfo) {
        const currentUser = this.getCurrentUser();
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userInfo };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      }

      return accessToken;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.logout();
      throw error;
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      this.accessToken = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  }

  // Get current user from localStorage
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      const user = JSON.parse(userStr);
      
      // Validate token is still valid
      const token = this.getAccessToken();
      if (!token || isTokenExpired(token)) {
        this.logout();
        return null;
      }

      return user;
    } catch (error) {
      return null;
    }
  }

  // Get access token
  getAccessToken(): string | null {
    return this.accessToken || localStorage.getItem('accessToken');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return token !== null && !isTokenExpired(token);
  }

  // Get user role
  getUserRole(): UserRole | null {
    const user = this.getCurrentUser();
    return user?.role || null;
  }

  // Check if user has specific role
  hasRole(role: UserRole): boolean {
    const userRole = this.getUserRole();
    return userRole === role;
  }

  // Check if user has any of the specified roles
  hasAnyRole(roles: UserRole[]): boolean {
    const userRole = this.getUserRole();
    return userRole ? roles.includes(userRole) : false;
  }

  // Check if password change is required (from JWT token)
  requiresPasswordChange(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;
    
    const decoded = decodeToken(token);
    return decoded?.requiresPasswordChange === true;
  }

  // Make authenticated request
  async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    let token = this.getAccessToken();

    // Check if token is expired and try to refresh
    if (token && isTokenExpired(token)) {
      try {
        token = await this.refreshToken();
      } catch (error) {
        throw new Error('Session expired. Please login again.');
      }
    }

    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    // If 401, try to refresh token once
    if (response.status === 401) {
      try {
        token = await this.refreshToken();
        const retryResponse = await fetch(url, {
          ...options,
          headers: {
            ...headers,
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });
        return retryResponse;
      } catch (error) {
        this.logout();
        throw new Error('Session expired. Please login again.');
      }
    }

    return response;
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;