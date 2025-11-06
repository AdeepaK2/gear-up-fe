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
  private sseReader: ReadableStreamDefaultReader<Uint8Array> | null = null;
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
    if (this.sseReader) {
      console.log('Already connected to SSE');
      return;
    }

    this.updateStatus('CONNECTING');
    
    const url = `${API_ENDPOINTS.NOTIFICATIONS.STREAM}`;
    
    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'text/event-stream',
      },
      credentials: 'include',
    }).then(response => {
      if (!response.ok) {
        throw new Error('SSE connection failed');
      }

      console.log('SSE connected');
      this.updateStatus('CONNECTED');

      this.sseReader = response.body?.getReader() || null;
      const decoder = new TextDecoder();

      const readStream = () => {
        this.sseReader?.read().then(({ done, value }) => {
          if (done) {
            console.log('SSE stream ended');
            this.handleSSEError();
            return;
          }

          const chunk = decoder.decode(value);
          console.log('SSE Raw chunk received:', chunk);
          
          // Split by double newlines for SSE events
          const events = chunk.split('\n\n');

          events.forEach(event => {
            if (!event.trim()) return;
            
            console.log('SSE Event:', event);
            
            // Parse SSE event format
            const lines = event.split('\n');
            let eventType = '';
            let data = '';
            
            lines.forEach(line => {
              if (line.startsWith('event:')) {
                eventType = line.substring(6).trim();
              } else if (line.startsWith('data:')) {
                // Handle both "data:" and "data: " formats
                data = line.startsWith('data: ') ? line.substring(6) : line.substring(5);
              }
            });
            
            // Ignore connection messages
            if (eventType === 'connected' || data === 'Connected to notification stream') {
              console.log('SSE connection established');
              return;
            }
            
            // Only process if we have data and it looks like JSON
            if (data && data.trim().startsWith('{')) {
              try {
                console.log('Parsing SSE data:', data);
                const notification: BackendNotification = JSON.parse(data);
                console.log('Received notification:', notification);
                this.notifyListeners(adaptNotification(notification));
              } catch (error) {
                console.error('Failed to parse SSE message:', error, 'Data:', data);
              }
            }
          });

          readStream();
        }).catch(error => {
          console.error('SSE read error:', error);
          this.handleSSEError();
        });
      };

      readStream();
    }).catch(error => {
      console.error('SSE connection error:', error);
      this.handleSSEError();
    });
  }

  private handleSSEError(): void {
    this.updateStatus('ERROR');
    this.disconnectSSE();
    
    setTimeout(() => {
      const token = authService.getAccessToken();
      if (token && this.connectionStatus === 'ERROR') {
        this.connectSSE(token);
      }
    }, 5000);
  }

  disconnectSSE(): void {
    if (this.sseReader) {
      this.sseReader.cancel();
      this.sseReader = null;
    }
    this.updateStatus('DISCONNECTED');
    console.log('SSE disconnected');
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
