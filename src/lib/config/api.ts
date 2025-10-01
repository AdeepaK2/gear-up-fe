// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    VERIFY_EMAIL: `${API_BASE_URL}/auth/verify-email`,
    RESEND_EMAIL: `${API_BASE_URL}/auth/resend-email`,
  },
  CUSTOMER: {
    BASE: `${API_BASE_URL}/customers`,
  },
  EMPLOYEE: {
    BASE: `${API_BASE_URL}/employees`,
  },
  ADMIN: {
    BASE: `${API_BASE_URL}/admin`,
  },
  APPOINTMENTS: {
    BASE: `${API_BASE_URL}/appointments`,
  },
  VEHICLES: {
    BASE: `${API_BASE_URL}/vehicles`,
  },
};

export default API_BASE_URL;