export interface Employee {
  employeeId: number;
  name: string;
  email: string;
  specialization: string;
  hireDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeCreateRequest {
  name: string;
  email: string;
  password: string;
  specialization: string;
  hireDate: string;
}

export interface EmployeeUpdateRequest {
  name?: string;
  specialization?: string;
  hireDate?: string;
}

export interface EmployeeDependencies {
  appointmentCount: number;
  hasAppointments: boolean;
  canDelete: boolean;
  warningMessage?: string;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

// Employee Dashboard Types
export interface EmployeeTaskSummary {
  total?: number;
  assigned?: number;
  inProgress?: number;
  completed?: number;
  pending?: number;
  completedToday?: number;
  [key: string]: number | undefined;
}

export interface EmployeeDashboardData {
  taskSummary: EmployeeTaskSummary;
  recentAppointments: any[];
  upcomingAppointments: any[];
}

// Employee Available Slots DTO
export interface EmployeeAvailableSlot {
  employeeId: number;
  employeeName: string;
  date: string;
  availableSlots: string[];
}
