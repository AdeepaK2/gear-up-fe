// Frontend types for appointment system
export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "in-progress"
  | "completed"
  | "cancelled";

// Consultation types - what customer is seeking help for
export type ConsultationType =
  | "general-checkup"
  | "specific-issue"
  | "maintenance-advice"
  | "performance-issue"
  | "safety-concern"
  | "other";

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
