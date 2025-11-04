// Backend response types
export interface BackendNotification {
  id: number;
  userId: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
  read: boolean;
}

export interface NotificationPage {
  content: BackendNotification[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  timestamp: string;
  path: string;
  data: T;
}

// Frontend types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: Date;
  timeAgo: string;
}

export type ConnectionStatus = 'CONNECTED' | 'CONNECTING' | 'DISCONNECTED' | 'ERROR';
