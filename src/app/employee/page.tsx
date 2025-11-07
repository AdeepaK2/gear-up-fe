"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { User, Edit, Calendar, Wrench, CheckCircle, Clock, X } from 'lucide-react';
import Link from 'next/link';
import { employeeService } from '@/lib/services/employeeService';
import { appointmentService } from '@/lib/services/appointmentService';
import { projectService } from '@/lib/services/projectService';
import type { Appointment } from '@/lib/types/Appointment';
import type { Project } from '@/lib/services/projectService';

interface DashboardStats {
	assignedServices: number;
	inProgress: number;
	completedToday: number;
	total?: number;
}

interface DashboardData {
	stats: DashboardStats;
	appointments: Appointment[];
	dailyProgress: {
		completed: number;
		total: number;
	};
	projectsStatusData: Array<{
		status: string;
		value: number;
	}>;
}

const getStatusBadgeStyle = (status: string) => {
	switch (status.toLowerCase()) {
		case "scheduled":
		case "pending":
			return "bg-yellow-50 text-yellow-800 border-yellow-200";
		case "confirmed":
			return "bg-green-50 text-green-800 border-green-200";
		case "in_progress":
		case "in-progress":
			return "bg-blue-50 text-blue-800 border-blue-200";
		case "completed":
			return "bg-green-50 text-green-800 border-green-200";
		case "cancelled":
			return "bg-red-50 text-red-800 border-red-200";
		default:
			return "bg-gray-50 text-gray-800 border-gray-200";
	}
};

export default function EmployeeDashboard() {
	const [dashboardData, setDashboardData] = useState<DashboardData>({
		stats: {
			assignedServices: 0,
			inProgress: 0,
			completedToday: 0,
			total: 0,
		},
		appointments: [],
		dailyProgress: {
			completed: 0,
			total: 0,
		},
		projectsStatusData: [],
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Load dashboard data
	useEffect(() => {
		loadDashboardData();
	}, []);

	const loadDashboardData = async () => {
		try {
			setLoading(true);
			setError(null);

			// Fetch task summary, appointments, and projects in parallel
			const [taskSummary, appointments, projects] = await Promise.all([
				employeeService.getEmployeeTaskSummary(),
				appointmentService.getEmployeeUpcomingAppointments(),
				projectService.getEmployeeProjects().catch(() => [] as Project[]), // Return empty array on error
			]);

			// Process task summary
			const stats: DashboardStats = {
				assignedServices: taskSummary.assigned || taskSummary.total || 0,
				inProgress: taskSummary.inProgress || taskSummary.pending || 0,
				completedToday: taskSummary.completedToday || 0,
				total: taskSummary.total || 0,
			};

			// Calculate daily progress
			const dailyProgress = {
				completed: stats.completedToday,
				total: stats.total || stats.assignedServices,
			};

			// Calculate projects by status
			const statusCounts: Record<string, number> = {};
			projects.forEach((project) => {
				const status = project.status || 'unknown';
				statusCounts[status] = (statusCounts[status] || 0) + 1;
			});

			const totalProjects = projects.length || 1; // Avoid division by zero
			const projectsStatusData = Object.entries(statusCounts).map(([status, count]) => ({
				status: status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' '),
				value: Math.round((count / totalProjects) * 100),
			}));

			// If no projects, show empty state
			if (projectsStatusData.length === 0) {
				projectsStatusData.push({
					status: 'No Projects',
					value: 0,
				});
			}

			setDashboardData({
				stats,
				appointments: appointments.slice(0, 3), // Show only first 3 appointments
				dailyProgress,
				projectsStatusData,
			});
		} catch (err) {
			console.error('Failed to load dashboard data:', err);
			setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="space-y-8 p-6">
				<div className="space-y-2">
					<h1 className="text-3xl font-bold tracking-tight text-primary">
						Employee Dashboard
					</h1>
					<p className="text-lg text-gray-600">Loading your dashboard...</p>
				</div>
				<div className="animate-pulse space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{[1, 2, 3].map((i) => (
							<div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
						))}
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="space-y-8 p-6">
				<div className="space-y-2">
					<h1 className="text-3xl font-bold tracking-tight text-primary">
						Employee Dashboard
					</h1>
					<p className="text-lg text-red-600">Error: {error}</p>
				</div>
				<Button onClick={loadDashboardData} className="mt-4">
					Retry
				</Button>
			</div>
		);
	}

	const { stats, appointments, dailyProgress, projectsStatusData } = dashboardData;

	// projectsStatusData is already calculated in the useEffect above from actual project data
	// No need to recalculate here

	return (
		<div className="space-y-8 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Employee Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Here's what's happening with your work today.
        </p>
      </div>

			{/* Stat Cards */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
				<Card className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 hover:shadow-lg transition-all duration-300">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-700 text-base font-semibold mb-1">
									Assigned Services
								</p>
								<div className="text-4xl font-extrabold text-primary">
									{stats.assignedServices}
								</div>
							</div>
							<div className="p-3 bg-primary rounded-lg shadow-sm">
								<Calendar className="h-8 w-8 text-white" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 hover:shadow-lg transition-all duration-300">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-700 text-base font-semibold mb-1">
									In progress
								</p>
								<div className="text-4xl font-extrabold text-primary">
									{stats.inProgress}
								</div>
							</div>
							<div className="p-3 bg-primary rounded-lg shadow-sm">
								<Wrench className="h-8 w-8 text-white" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 hover:shadow-lg transition-all duration-300">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-700 text-base font-semibold mb-1">
									Completed Today
								</p>
								<div className="text-4xl font-extrabold text-primary">
									{stats.completedToday}
								</div>
							</div>
							<div className="p-3 bg-primary rounded-lg shadow-sm">
								<CheckCircle className="h-8 w-8 text-white" />
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Daily Progress Card */}
				<Card className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 hover:shadow-lg transition-all duration-300">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-700 text-base font-semibold mb-1">
									Daily Progress
								</p>
								<div className="text-4xl font-extrabold text-primary">
									{Math.round((dailyProgress.completed / dailyProgress.total) * 100)}%
								</div>
							</div>
							<div className="p-3 bg-primary rounded-lg shadow-sm">
								<Clock className="h-8 w-8 text-white" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Upcoming Appointments */}
			<Card className="mb-8 shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
				<CardHeader className="bg-[#2c3e82] border-b border-gray-100 py-4 px-6">
					<CardTitle className="text-2xl font-bold text-white">Upcoming Appointments</CardTitle>
				</CardHeader>
				<CardContent className="overflow-x-auto px-4 pb-6">
					<table className="min-w-full text-sm">
						<thead>
							<tr className="border-b">
								<th className="px-4 py-3 text-left font-bold">Customer</th>
								<th className="px-4 py-3 text-left font-bold">Service</th>
								<th className="px-4 py-3 text-left font-bold">Date</th>
								<th className="px-4 py-3 text-left font-bold">Time</th>
								<th className="px-4 py-3 text-left font-bold">Status</th>
							</tr>
						</thead>
						<tbody>
							{appointments.map((appointment, i) => (
								<tr key={appointment.id || i} className="border-b last:border-0 hover:bg-blue-50 hover:backdrop-blur-sm hover:shadow-md transition-all duration-200 cursor-pointer">
									<td className="px-4 py-3">Customer #{appointment.customerId}</td>
									<td className="px-4 py-3">{appointment.consultationTypeLabel || appointment.consultationType}</td>
									<td className="px-4 py-3">{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
									<td className="px-4 py-3">{appointment.startTime || 'N/A'}</td>
									<td className="px-4 py-3">
										<span className={`inline-block rounded-full px-4 py-1 text-xs font-semibold border w-28 text-center ${getStatusBadgeStyle(appointment.status)}`}>
											{appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1).toLowerCase()}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</CardContent>
			</Card>

			{/* Projects by Status */}
			<Card className="mb-8 shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
				<CardHeader className="bg-[#2c3e82] border-b border-gray-100 py-4 px-6">
					<CardTitle className="text-2xl font-bold text-white">Projects by Status</CardTitle>
				</CardHeader>
				<CardContent className="">
					<div className="space-y-4">
						{projectsStatusData.map((item) => (
							<div key={item.status}>
								<div className="flex justify-between mb-1">
									<span className="text-sm font-medium">{item.status}</span>
								</div>
								<Progress value={item.value} className="h-2 bg-gray-200 [&>div]:bg-primary" />
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Quick Actions */}
			<Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
				<CardHeader className="bg-[#2c3e82] border-b border-gray-100 py-4 px-6">
					<CardTitle className="text-2xl font-bold text-white">Quick Actions</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<Link href="/employee/appointments">
							<Button className="w-full bg-primary hover:bg-secondary text-white">
								<Calendar className="mr-2 h-4 w-4" />
								View All Appointments
							</Button>
						</Link>
						<Link href="/employee/projects">
							<Button className="w-full bg-primary hover:bg-secondary text-white">
								<Wrench className="mr-2 h-4 w-4" />
								Manage Projects
							</Button>
						</Link>
						<Link href="/employee/profile">
							<Button className="w-full bg-primary hover:bg-secondary text-white">
								<User className="mr-2 h-4 w-4" />
								Update Profile
							</Button>
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}