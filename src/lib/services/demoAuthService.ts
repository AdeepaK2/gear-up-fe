import { UserRole } from '../types/Auth';

export interface DemoAccount {
  role: string;
  email: string;
  password: string;
  roleEnum: UserRole;
  name: string;
  description: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: "customer",
    email: "customer@gearup.com",
    password: "customer123",
    roleEnum: UserRole.CUSTOMER,
    name: "Customer Demo",
    description: "Access customer dashboard, book appointments, manage vehicles"
  },
  {
    role: "employee",
    email: "employee@gearup.com",
    password: "employee123",
    roleEnum: UserRole.EMPLOYEE,
    name: "Employee Demo",
    description: "Manage tasks, view appointments, update service status"
  },
  {
    role: "admin",
    email: "admin@gearup.com",
    password: "Admin@123", // Real backend password
    roleEnum: UserRole.ADMIN,
    name: "System Administrator",
    description: "Full system access (Uses real backend credentials)"
  }
];

/**
 * Performs a demo login without backend authentication
 * Creates a mock JWT token and stores it in localStorage
 */
export function performDemoLogin(demoAccount: DemoAccount): string {
  // Create a mock JWT payload
  const mockPayload = {
    sub: demoAccount.email,
    role: demoAccount.roleEnum,
    name: demoAccount.name,
    exp: Math.floor(Date.now() / 1000) + (12 * 60 * 60), // 12 hours expiry
    iat: Math.floor(Date.now() / 1000),
    isDemoAccount: true, // Flag to identify demo accounts
  };

  // Create a fake JWT token (header.payload.signature)
  // Format: base64(header).base64(payload).signature
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify(mockPayload));
  const mockToken = `${header}.${payload}.demo_signature`;

  // Store the token in localStorage
  localStorage.setItem('accessToken', mockToken);
  localStorage.setItem('isDemoMode', 'true');

  console.log('🎭 Demo login successful:', {
    email: demoAccount.email,
    role: demoAccount.roleEnum,
    name: demoAccount.name
  });

  return mockToken;
}

/**
 * Get the redirect path based on user role
 */
export function getRedirectPath(role: UserRole): string {
  switch (role) {
    case UserRole.CUSTOMER:
      return "/customer";
    case UserRole.EMPLOYEE:
      return "/employee";
    case UserRole.ADMIN:
      return "/admin";
    default:
      return "/";
  }
}

/**
 * Check if currently in demo mode
 */
export function isDemoMode(): boolean {
  if (typeof window === 'undefined') return false;

  // Check localStorage flag first
  const demoFlag = localStorage.getItem('isDemoMode') === 'true';

  // Also check if the token has isDemoAccount flag
  const token = localStorage.getItem('accessToken');
  if (token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);

      // If token has isDemoAccount flag, return true
      if (payload.isDemoAccount === true) {
        return true;
      }
    } catch (error) {
      // If token parsing fails, fall back to localStorage flag
    }
  }

  return demoFlag;
}

/**
 * Clear demo mode
 */
export function clearDemoMode(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('isDemoMode');
}
