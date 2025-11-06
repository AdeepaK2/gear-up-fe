// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// API Endpoints
export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    VERIFY_EMAIL: `${API_BASE_URL}/auth/verify-email`,
    RESEND_EMAIL: `${API_BASE_URL}/auth/resend-email`,
    CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  },
  CUSTOMER: {
    BASE: `${API_BASE_URL}/customers`,
  },
  EMPLOYEE: {
    BASE: `${API_BASE_URL}/employees`,
  },
  ADMIN: {
    BASE: `${API_BASE_URL}/admin`,
    EMPLOYEES: `${API_BASE_URL}/admin/employees`,
    CUSTOMERS: `${API_BASE_URL}/admin/customers`,
  },
  APPOINTMENTS: {
    BASE: `${API_BASE_URL}/appointments`,
    EMPLOYEE: `${API_BASE_URL}/appointments/employee`,
    EMPLOYEE_UPCOMING: `${API_BASE_URL}/appointments/employee/upcoming`,
    BY_MONTH: `${API_BASE_URL}/appointments/by-month`,
    FILTER_BY_DATE: `${API_BASE_URL}/appointments/filter-by-date`,
    SEARCH: `${API_BASE_URL}/appointments/search`,
    AVAILABLE_SLOTS: `${API_BASE_URL}/appointments/employee/available-slots`,
  },
  VEHICLES: {
    BASE: `${API_BASE_URL}/vehicles`,
  },
  PROJECTS: {
    BASE: `${API_BASE_URL}/projects`,
    EMPLOYEE: `${API_BASE_URL}/projects/employee`,
    MY_ASSIGNED: `${API_BASE_URL}/projects/my-assigned`,
    REPORTS: `${API_BASE_URL}/projects/reports`,
  },
  TASKS: {
    BASE: `${API_BASE_URL}/tasks`,
    EMPLOYEE: `${API_BASE_URL}/tasks/employee`,
    EMPLOYEE_SUMMARY: `${API_BASE_URL}/employees/task-summary`,
  },
  CHAT: {
    BASE: `${API_BASE_URL}/rag-chat`,
    SEND: `${API_BASE_URL}/rag-chat`,
    STREAM: `${API_BASE_URL}/rag-chat/stream`,
    HISTORY: `${API_BASE_URL}/rag-chat/history`,
  },
};

export default API_BASE_URL;