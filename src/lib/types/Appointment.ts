// API Response wrapper
export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

// Frontend types for appointment system
export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

// Consultation types - what customer is seeking help for
export type ConsultationType =
  | "GENERAL_CHECKUP"
  | "SPECIFIC_ISSUE"
  | "MAINTENANCE_ADVICE"
  | "PERFORMANCE_ISSUE"
  | "SAFETY_CONCERN"
  | "OTHER";

// Vehicle interface for frontend
export interface Vehicle {
  id: string;
  name: string;
  details: string;
  make?: string;
  model?: string;
  year?: number;
  licensePlate?: string;
}

// Complete appointment data structure (consultation-based)
export interface AppointmentData {
  id: string;
  vehicleId: string;
  vehicleName: string;
  vehicleDetails: string;
  consultationType: ConsultationType;
  consultationTypeLabel: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  customerIssue?: string; // What the customer describes as the problem
  notes?: string; // Customer's additional notes
  employeeId?: string; // Assigned after confirmation
  employeeName?: string;
  recommendedServices?: string[]; // Services recommended by employee after consultation
  estimatedCost?: number; // Cost estimated by employee
}

// Form data structure (lighter version for form submission)
export interface AppointmentFormData {
  id?: string;
  vehicleId: string;
  consultationType: ConsultationType;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status?: AppointmentStatus;
  customerIssue?: string;
  notes?: string;
}

// Customer interface for frontend
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

// Notification interface
export interface Notification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
  timestamp: Date;
}

// Backend API types (matching backend DTOs)
export interface Appointment {
  id: number;
  appointmentDate: string; // LocalDate as string (matches AppointmentResponseDTO)
  status: string;
  notes: string | null;
  startTime: string | null; // LocalTime as string
  endTime: string | null; // LocalTime as string
  vehicleId: number;
  vehicleName: string;
  vehicleDetails: string;
  customerId: number;
  employeeId: number | null;
  consultationType: string;
  consultationTypeLabel: string;
  customerIssue: string | null;
  taskIds: number[] | null;
}

export interface AppointmentCreateRequest {
  appointmentDate: string; // YYYY-MM-DD format (matches backend DTO)
  notes?: string;
  vehicleId: number;
  startTime: string; // HH:MM:SS format
  endTime: string; // HH:MM:SS format
  consultationType: string;
}

export interface AppointmentUpdateRequest {
  appointmentDate?: string; // YYYY-MM-DD format (matches backend DTO)
  status?: string;
  notes?: string;
  startTime?: string; // HH:MM:SS format
  endTime?: string; // HH:MM:SS format
  taskIds?: number[]; // Task IDs to link to this appointment
}
