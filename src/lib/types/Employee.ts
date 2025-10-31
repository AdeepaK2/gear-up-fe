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
