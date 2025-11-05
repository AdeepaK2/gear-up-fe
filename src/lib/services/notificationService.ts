import { authService } from './authService';
import { API_ENDPOINTS } from '@/lib/config/api';
import { appointmentService } from './appointmentService';
import { projectService } from './projectService';

export interface Notification {
  id: string;
  message: string;
  date: string;
  time: string;
  read: boolean;
  type: 'appointment' | 'project' | 'system';
  priority: 'low' | 'medium' | 'high';
}

class NotificationService {
  // Get unread notification count
  async getUnreadCount(): Promise<number> {
    try {
      const notifications = await this.getNotifications();
      return notifications.filter(n => !n.read).length;
    } catch (error) {
      console.error('Failed to get unread count:', error);
      return 0;
    }
  }

  // Get all notifications
  async getNotifications(): Promise<Notification[]> {
    try {
      // First try to fetch from backend
      const backendNotifications = await this.fetchFromBackend();
      if (backendNotifications.length > 0) {
        return backendNotifications;
      }

      // If backend doesn't have notifications endpoint, generate from appointments and projects
      return await this.generateNotificationsFromData();
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      // Fallback to generating from data
      return await this.generateNotificationsFromData();
    }
  }

  // Fetch notifications from backend API
  private async fetchFromBackend(): Promise<Notification[]> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_ENDPOINTS.BASE_URL}/notifications`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data?.data || data || [];
    } catch (error) {
      return [];
    }
  }

  // Generate notifications from appointments and projects data
  private async generateNotificationsFromData(): Promise<Notification[]> {
    try {
      const [appointments, projects] = await Promise.all([
        appointmentService.getEmployeeUpcomingAppointments(),
        projectService.getEmployeeProjects(),
      ]);

      const generatedNotifications: Notification[] = [];

      // Generate notifications from upcoming appointments
      appointments.slice(0, 3).forEach((appointment, index) => {
        const appointmentDate = new Date(appointment.appointmentDate);
        const today = new Date();
        const timeDiff = appointmentDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (daysDiff <= 3 && daysDiff >= 0) {
          generatedNotifications.push({
            id: `appointment-${appointment.id}`,
            message: `Upcoming appointment: ${appointment.consultationTypeLabel || appointment.consultationType} for Customer #${appointment.customerId}`,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: index > 1, // Mark first 2 as unread
            type: 'appointment',
            priority: daysDiff === 0 ? 'high' : daysDiff === 1 ? 'medium' : 'low',
          });
        }
      });

      // Generate notifications from pending projects
      projects.slice(0, 2).forEach((project, index) => {
        if (project.status === 'pending') {
          generatedNotifications.push({
            id: `project-${project.id}`,
            message: `New project assigned: "${project.name}" for Customer #${project.customerId}`,
            date: new Date(project.createdAt || new Date()).toLocaleDateString(),
            time: new Date(project.createdAt || new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: index > 0, // Mark first as unread
            type: 'project',
            priority: 'medium',
          });
        }
      });

      return generatedNotifications;
    } catch (error) {
      console.error('Failed to generate notifications from data:', error);
      return [];
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_ENDPOINTS.BASE_URL}/notifications/${notificationId}/read`,
        {
          method: 'PUT',
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      return false;
    }
  }

  // Mark all notifications as read
  async markAllAsRead(): Promise<boolean> {
    try {
      const response = await authService.authenticatedFetch(
        `${API_ENDPOINTS.BASE_URL}/notifications/read-all`,
        {
          method: 'PUT',
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      return false;
    }
  }
}

export const notificationService = new NotificationService();
