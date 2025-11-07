import { authService } from './authService';
import { appointmentService } from './appointmentService';
import { vehicleService } from './vehicleService';
import { projectService } from './projectService';

export interface DashboardSummary {
  upcomingAppointments: number;
  ongoingProjects: number;
  completedServices: number;
  pendingRequests: number;
  nextAppointmentDate: string | null;
}

class DashboardService {
  /**
   * Get dashboard summary data for the current customer
   */
  async getDashboardSummary(): Promise<DashboardSummary> {
    try {
      // Fetch all appointments for the current customer
      const appointments = await appointmentService.getAllAppointmentsForCurrentCustomer();

      // Fetch all projects for the current customer
      let projects: any[] = [];
      try {
        projects = await projectService.getAllProjectsForCurrentCustomer();
      } catch (err) {
        console.warn('Failed to fetch projects:', err);
      }

      // Calculate upcoming appointments (PENDING or CONFIRMED status, future dates)
      const now = new Date();
      const upcomingAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.appointmentDate);
        const status = apt.status?.toUpperCase();
        return aptDate >= now && (status === 'PENDING' || status === 'CONFIRMED');
      });

      // Calculate ongoing projects (IN_PROGRESS status)
      const ongoingProjects = projects.filter(project =>
        project.status?.toUpperCase() === 'IN_PROGRESS'
      );

      // Calculate completed services (COMPLETED appointments)
      const completedServices = appointments.filter(apt =>
        apt.status?.toUpperCase() === 'COMPLETED'
      );

      // Calculate pending requests (PENDING appointments)
      const pendingRequests = appointments.filter(apt =>
        apt.status?.toUpperCase() === 'PENDING'
      );

      // Find next appointment date
      const sortedUpcoming = upcomingAppointments.sort((a, b) =>
        new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()
      );
      const nextAppointmentDate = sortedUpcoming.length > 0
        ? sortedUpcoming[0].appointmentDate
        : null;

      return {
        upcomingAppointments: upcomingAppointments.length,
        ongoingProjects: ongoingProjects.length,
        completedServices: completedServices.length,
        pendingRequests: pendingRequests.length,
        nextAppointmentDate,
      };
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      // Return zero values on error
      return {
        upcomingAppointments: 0,
        ongoingProjects: 0,
        completedServices: 0,
        pendingRequests: 0,
        nextAppointmentDate: null,
      };
    }
  }

  /**
   * Get recent activity for dashboard
   */
  async getRecentActivity(): Promise<any[]> {
    try {
      const appointments = await appointmentService.getAllAppointmentsForCurrentCustomer();

      // Sort by date and get the most recent 5
      const recentAppointments = appointments
        .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime())
        .slice(0, 5);

      // Convert to activity format
      return recentAppointments.map(apt => ({
        id: apt.id,
        action: `Appointment ${apt.status?.toLowerCase()}`,
        description: `${apt.consultationTypeLabel || apt.consultationType} - ${apt.appointmentDate}`,
        time: this.getRelativeTime(new Date(apt.appointmentDate)),
        icon: 'Calendar',
      }));
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  }

  /**
   * Helper function to get relative time
   */
  private getRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;
