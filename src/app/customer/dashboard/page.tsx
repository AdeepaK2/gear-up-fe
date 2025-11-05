'use client';

import { useState, useMemo, useEffect } from 'react';
import { Calendar, CheckCircle, Wrench, FileText, Clock } from 'lucide-react';
import DashboardHeader from '@/components/customer/dashboard/DashboardHeader';
import SummaryCard from '@/components/customer/dashboard/SummaryCard';
import NotificationsList from '@/components/customer/dashboard/NotificationsList';
import QuickActions from '@/components/customer/dashboard/QuickActions';
import RecentActivity from '@/components/customer/dashboard/RecentActivity';
import VehiclesList from '@/components/customer/dashboard/VehiclesList';
import ChatWidget from '@/components/customer/dashboard/ChatWidget';
import DashboardFooter from '@/components/customer/dashboard/DashboardFooter';
import authService from '@/lib/services/authService';
import { customerService } from '@/lib/services/customerService';
import { dashboardService, type DashboardSummary } from '@/lib/services/dashboardService';
import { vehicleService } from '@/lib/services/vehicleService';

/**
 * Dashboard Data Interface
 * Defines the structure of mock data for type safety and documentation
 */
interface DashboardData {
  customer: {
    name: string;
    email: string;
    membershipLevel: string;
    loyaltyPoints: number;
    profileImage: string;
  };
  summary: {
    upcomingAppointments: { count: number; nextDate: string };
    ongoingProjects: { count: number; status: string };
    completedServices: { count: number };
    pendingRequests: { count: number };
  };
  notifications: Array<{
    id: number;
    message: string;
    type: string;
    time: string;
    urgent: boolean;
  }>;
  recentActivity: Array<{
    id: number;
    action: string;
    description: string;
    time: string;
    icon: React.ElementType;
  }>;
  vehicles: Array<{
    id: number;
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    nextService: string | null;
  }>;
}

const mockData: DashboardData = {
  customer: {
    name: 'John Smith',
    email: 'john.smith@email.com',
    membershipLevel: 'Gold',
    loyaltyPoints: 2340,
    profileImage: '/public/image.jpg',
  },
  summary: {
    upcomingAppointments: { count: 2, nextDate: '2025-10-02' },
    ongoingProjects: { count: 1, status: 'In Progress' },
    completedServices: { count: 15 },
    pendingRequests: { count: 3 },
  },
  notifications: [
    {
      id: 1,
      message: 'Your appointment on Oct 2nd has been confirmed',
      type: 'info',
      time: '2 hours ago',
      urgent: false,
    },
    {
      id: 2,
      message: 'Project #1234 status updated to "In Progress"',
      type: 'success',
      time: '5 hours ago',
      urgent: false,
    },
    {
      id: 3,
      message: 'Payment required for completed service',
      type: 'warning',
      time: '1 day ago',
      urgent: true,
    },
  ],
  recentActivity: [
    {
      id: 1,
      action: 'Appointment booked',
      description: 'General checkup scheduled for Oct 2nd',
      time: '2 days ago',
      icon: Calendar,
    },
    {
      id: 2,
      action: 'Service accepted',
      description: 'Brake pad replacement approved',
      time: '3 days ago',
      icon: CheckCircle,
    },
    {
      id: 3,
      action: 'Status updated',
      description: 'Project #1234 moved to "In Progress"',
      time: '5 days ago',
      icon: Wrench,
    },
    {
      id: 4,
      action: 'File uploaded',
      description: 'Vehicle inspection report submitted',
      time: '1 week ago',
      icon: FileText,
    },
  ],
  vehicles: [
    {
      id: 1,
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      licensePlate: 'ABC-123',
      nextService: '2025-11-15',
    },
    {
      id: 2,
      make: 'Honda',
      model: 'Civic',
      year: 2019,
      licensePlate: 'XYZ-789',
      nextService: null,
    },
  ],
};

/**
 * DashboardPage Component
 *
 * Main customer dashboard page displaying overview of appointments, projects,
 * notifications, recent activity, and vehicles. Composed of smaller, reusable
 * components following the Single Responsibility Principle.
 *
 * @returns {JSX.Element} Rendered customer dashboard page
 */
export default function DashboardPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Summary cards configuration
   * Memoized to prevent unnecessary recalculations on re-renders
   */
  const summaryCards = useMemo(
    () => [
      {
        title: 'Upcoming Appointments',
        count: dashboardData?.upcomingAppointments || 0,
        subtitle: dashboardData?.nextAppointmentDate
          ? `Next: ${new Date(dashboardData.nextAppointmentDate).toLocaleDateString()}`
          : 'No upcoming appointments',
        icon: Calendar,
        href: '/customer/appointments',
      },
      {
        title: 'Ongoing Projects',
        count: dashboardData?.ongoingProjects || 0,
        subtitle: dashboardData?.ongoingProjects ? 'In Progress' : 'No ongoing projects',
        icon: Wrench,
        href: '/customer/projects',
      },
      {
        title: 'Completed Services',
        count: dashboardData?.completedServices || 0,
        subtitle: 'All time',
        icon: CheckCircle,
      },
      {
        title: 'Pending Requests',
        count: dashboardData?.pendingRequests || 0,
        subtitle: 'Awaiting response',
        icon: Clock,
      },
    ],
    [dashboardData]
  );

  const handleToggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch customer name
        const customer = await customerService.getCurrentCustomerProfile();
        setCustomerName(customer.name);

        // Fetch dashboard summary
        const summary = await dashboardService.getDashboardSummary();
        setDashboardData(summary);

        // Fetch vehicles
        try {
          const vehiclesData = await vehicleService.getMyVehicles();
          setVehicles(vehiclesData);
        } catch (err) {
          console.warn('Failed to fetch vehicles:', err);
        }

        // Fetch recent activity
        try {
          const activity = await dashboardService.getRecentActivity();
          setRecentActivity(activity);
        } catch (err) {
          console.warn('Failed to fetch recent activity:', err);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  return (
    <div className="min-h-screen space-y-6">
      <DashboardHeader customerName={customerName} />

      {/* Summary Cards Grid */}
      <section aria-labelledby="summary-heading">
        <h2 id="summary-heading" className="sr-only">
          Dashboard Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {summaryCards.map((card) => (
            <SummaryCard
              key={card.title}
              title={card.title}
              count={card.count}
              subtitle={card.subtitle}
              icon={card.icon}
              href={card.href}
            />
          ))}
        </div>
      </section>

      {/* Main Content Grid */}
      <section aria-labelledby="main-content-heading">
        <h2 id="main-content-heading" className="sr-only">
          Main Dashboard Content
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Notifications and Quick Actions */}
          <div className="space-y-6">
            <NotificationsList notifications={[]} />
            <QuickActions />
          </div>

          {/* Middle Column - Recent Activity */}
          <RecentActivity activities={recentActivity.length > 0 ? recentActivity : []} />

          {/* Right Column - Vehicle Snapshot */}
          <VehiclesList vehicles={vehicles.length > 0 ? vehicles : []} />
        </div>
      </section>

      <DashboardFooter />

      {/* Floating Chat Widget */}
      <ChatWidget isOpen={isChatOpen} onToggle={handleToggleChat} />
    </div>
  );
}
