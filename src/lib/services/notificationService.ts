import { authService } from './authService';
import { API_ENDPOINTS } from '@/lib/config/api';
import type { ApiResponse, BackendNotification, NotificationPage, Notification, ConnectionStatus } from '@/lib/types/Notification';

// Helper to format time ago
function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// Convert backend notification to frontend format
function adaptNotification(backend: BackendNotification): Notification {
  const createdAt = new Date(backend.createdAt);
  return {
    id: backend.id.toString(),
    title: backend.title,
    message: backend.message,
    type: backend.type,
    read: backend.read,
    createdAt,
    timeAgo: getTimeAgo(createdAt),
  };
}

class NotificationService {
  private eventSource: EventSource | null = null;
  private connectionStatus: ConnectionStatus = 'DISCONNECTED';
  private listeners: Set<(notification: Notification) => void> = new Set();
  private statusListeners: Set<(status: ConnectionStatus) => void> = new Set();

  // REST API Methods
  async getNotifications(page: number = 0, size: number = 20): Promise<{ notifications: Notification[]; total: number }> {
    const response = await authService.authenticatedFetch(
      `${API_ENDPOINTS.NOTIFICATIONS.BASE}?page=${page}&size=${size}`,
      { method: 'GET' }
    );
    
    if (!response.ok) throw new Error('Failed to fetch notifications');
    
    const data: ApiResponse<NotificationPage> = await response.json();
    return {
      notifications: data.data.content.map(adaptNotification),
      total: data.data.totalElements,
    };
  }

  async getUnreadCount(): Promise<number> {
    try {
      const response = await authService.authenticatedFetch(
        API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT,
        { method: 'GET' }
      );
      
      if (!response.ok) return 0;
      
      const data: ApiResponse<number> = await response.json();
      return data.data;
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
      return 0;
    }
  }

  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_ENDPOINTS.NOTIFICATIONS.BASE}/${notificationId}/read`,
        { method: 'PATCH' }
      );
      return response.ok;
    } catch (error) {
      console.error('Failed to mark as read:', error);
      return false;
    }
  }

  async markAllAsRead(): Promise<boolean> {
    try {
      const response = await authService.authenticatedFetch(
        API_ENDPOINTS.NOTIFICATIONS.READ_ALL,
        { method: 'PATCH' }
      );
      return response.ok;
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      return false;
    }
  }

  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_ENDPOINTS.NOTIFICATIONS.BASE}/${notificationId}`,
        { method: 'DELETE' }
      );
      return response.ok;
    } catch (error) {
      console.error('Failed to delete notification:', error);
      return false;
    }
  }

  // SSE Methods
  connectSSE(token: string): void {
    if (this.eventSource) {
      console.log('Already connected to SSE');
      return;
    }

    this.updateStatus('CONNECTING');
    
    // EventSource doesn't support headers, so pass token as query param
    const url = `${API_ENDPOINTS.NOTIFICATIONS.STREAM}?token=${encodeURIComponent(token)}`;
    this.eventSource = new EventSource(url);

    this.eventSource.onopen = () => {
      console.log('SSE connected');
      this.updateStatus('CONNECTED');
    };

    this.eventSource.onmessage = (event) => {
      try {
        const notification: BackendNotification = JSON.parse(event.data);
        this.notifyListeners(adaptNotification(notification));
      } catch (error) {
        console.error('Failed to parse SSE message:', error);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      this.updateStatus('ERROR');
      this.disconnectSSE();
      
      // Auto reconnect after 5 seconds
      setTimeout(() => {
        if (token) this.connectSSE(token);
      }, 5000);
    };
  }

  disconnectSSE(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      this.updateStatus('DISCONNECTED');
      console.log('SSE disconnected');
    }
  }

  // Event listeners
  onNotification(callback: (notification: Notification) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  onStatusChange(callback: (status: ConnectionStatus) => void): () => void {
    this.statusListeners.add(callback);
    callback(this.connectionStatus); // Call immediately with current status
    return () => this.statusListeners.delete(callback);
  }

  getStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  private notifyListeners(notification: Notification): void {
    this.listeners.forEach(callback => callback(notification));
  }

  private updateStatus(status: ConnectionStatus): void {
    this.connectionStatus = status;
    this.statusListeners.forEach(callback => callback(status));
  }
}

export const notificationService = new NotificationService();
