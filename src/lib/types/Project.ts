// Project and Service types for customer project interface
export type ServiceStatus =
  | "recommended"
  | "accepted"
  | "rejected"
  | "requested"
  | "cancelled"
  | "in-progress"
  | "completed";

export type ProjectStatus =
  | "waiting-confirmation"
  | "confirmed"
  | "in-progress"
  | "completed"
  | "cancelled";

export interface Service {
  id: string;
  name: string;
  description: string;
  estimatedDuration: string;
  estimatedCost: number;
  status: ServiceStatus;
  category?: string;
  priority?: "low" | "medium" | "high";
  notes?: string;
  requestedBy?: "employee" | "customer";
  createdAt: string;
}

export interface AdditionalServiceRequest {
  id?: string;
  customRequest: string;
  referenceFile?: File;
  referenceFileUrl?: string;
  status: ServiceStatus;
  estimatedCost?: number;
  estimatedDuration?: string;
  employeeNotes?: string;
}

export interface ProjectData {
  id: string;
  appointmentId: string;
  customerId: string;
  vehicleId: string;
  vehicleName: string;
  vehicleDetails: string;
  consultationType: string;
  consultationDate: string;
  employeeId: string;
  employeeName: string;
  status: ProjectStatus;
  services: Service[];
  additionalRequests?: AdditionalServiceRequest[];
  customerNotes?: string;
  totalEstimatedCost: number;
  totalAcceptedCost: number;
  acceptedServicesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectSummary {
  acceptedServices: Service[];
  totalCost: number;
  totalDuration: string;
  serviceCount: number;
}
