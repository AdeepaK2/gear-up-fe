// Frontend customer types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
}

export interface CustomerProfile extends Customer {
  dateOfBirth?: string;
  emergencyContact?: string;
  preferredContactMethod?: 'email' | 'phone' | 'sms';
}