export interface Vehicle {
  id: number;
  vin: string;
  licensePlate: string;
  year: number;
  model: string;
  make: string;
}

export interface VehicleCreateRequest {
  vin: string;
  licensePlate: string;
  year: number;
  model: string;
  make: string;
}

export interface VehicleUpdateRequest {
  vin?: string;
  licensePlate?: string;
  year?: number;
  model?: string;
  make?: string;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}
