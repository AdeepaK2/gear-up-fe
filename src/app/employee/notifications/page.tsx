"use client";
import React, { useState, useEffect } from "react";
import { Bell, CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";
import { appointmentService } from '@/lib/services/appointmentService';
import { projectService } from '@/lib/services/projectService';
import type { Appointment } from '@/lib/types/Appointment';
import type { Project } from '@/lib/services/projectService';
import { Button } from '@/components/ui/button';

interface Notification {
	id: string;
	message: string;
	date: string;
	time: string;
	read: boolean;
	type: 'appointment' | 'project' | 'system';
	priority: 'low' | 'medium' | 'high';
}

export default function EmployeeNotifications() {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

	useEffect(() => {
		loadNotifications();
	}, []);

	const loadNotifications = async () => {
		try {
			setLoading(true);
			setError(null);

			// Fetch recent appointments and projects to generate notifications
			const [appointments, projects] = await Promise.all([
				appointmentService.getEmployeeUpcomingAppointments(),
				projectService.getEmployeeProjects(),
			]);

			const generatedNotifications: Notification[] = [];

			// Generate notifications from appointments
			appointments.forEach((appointment, index) => {
				const appointmentDate = new Date(appointment.appointmentDate);
				const today = new Date();
				const timeDiff = appointmentDate.getTime() - today.getTime();
				const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

				if (daysDiff <= 3 && daysDiff >= 0) { // Upcoming appointments in next 3 days
					generatedNotifications.push({
						id: `appointment-${appointment.id}`,
						message: `Upcoming appointment: ${appointment.consultationTypeLabel || appointment.consultationType} for Customer #${appointment.customerId} on ${appointmentDate.toLocaleDateString()}`,
						date: new Date().toLocaleDateString(),
						time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
						read: index > 2, // Mark first 3 as unread
						type: 'appointment',
						priority: daysDiff === 0 ? 'high' : daysDiff === 1 ? 'medium' : 'low',
					});
				}
			});

			// Generate notifications from projects
			projects.forEach((project, index) => {
				if (project.status === 'pending') {
					generatedNotifications.push({
						id: `project-${project.id}`,
						message: `New project assigned: "${project.name}" for Customer #${project.customerId}`,
						date: new Date(project.createdAt).toLocaleDateString(),
						time: new Date(project.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
						read: index > 1, // Mark first 2 as unread
						type: 'project',
						priority: 'medium',
					});
				}
			});

			// Add some system notifications
			generatedNotifications.push({
				id: 'system-1',
				message: 'System maintenance scheduled for tonight at 2:00 AM. Expected downtime: 30 minutes.',
				date: new Date().toLocaleDateString(),
				time: '09:00',
				read: true,
				type: 'system',
				priority: 'low',
			});

			// Sort by date and priority
			generatedNotifications.sort((a, b) => {
				if (a.priority === 'high' && b.priority !== 'high') return -1;
				if (b.priority === 'high' && a.priority !== 'high') return 1;
				if (a.priority === 'medium' && b.priority === 'low') return -1;
				if (b.priority === 'medium' && a.priority === 'low') return 1;
				return new Date(`${b.date} ${b.time}`).getTime() - new Date(`${a.date} ${a.time}`).getTime();
			});

			setNotifications(generatedNotifications);
		} catch (err) {
			console.error('Failed to load notifications:', err);
			setError(err instanceof Error ? err.message : 'Failed to load notifications');
		} finally {
			setLoading(false);
		}
	};

	const markAsRead = (id: string) => {
		setNotifications(prev => 
			prev.map(notification => 
				notification.id === id 
					? { ...notification, read: true }
					: notification
			)
		);
	};

	const markAllAsRead = () => {
		setNotifications(prev => 
			prev.map(notification => ({ ...notification, read: true }))
		);
		setSelectedIdx(null);
	};

	const handleDismiss = (idx: number) => {
		setNotifications((prev) => prev.filter((_, i) => i !== idx));
		if (selectedIdx === idx) setSelectedIdx(null);
	};

	// Split notifications into new (unread) and old (read)
	const newNotifications = notifications.filter((n) => !n.read);
	const oldNotifications = notifications.filter((n) => n.read);

	const getPriorityIcon = (priority: string) => {
		switch (priority) {
			case 'high':
				return <AlertCircle className="w-4 h-4 text-red-500" />;
			case 'medium':
				return <Clock className="w-4 h-4 text-yellow-500" />;
			default:
				return <Bell className="w-4 h-4 text-blue-500" />;
		}
	};

	const getPriorityColor = (priority: string, read: boolean) => {
		const baseOpacity = read ? 'opacity-60' : '';
		switch (priority) {
			case 'high':
				return `border-l-red-500 bg-red-50 ${baseOpacity}`;
			case 'medium':
				return `border-l-yellow-500 bg-yellow-50 ${baseOpacity}`;
			default:
				return `border-l-blue-500 bg-blue-50 ${baseOpacity}`;
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen space-y-8 p-6">
				<h1 className="text-3xl font-bold text-primary mb-6">Notifications</h1>
				<div className="flex items-center justify-center py-12">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
					<span className="ml-2 text-lg">Loading notifications...</span>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen space-y-8 p-6">
				<h1 className="text-3xl font-bold text-primary mb-6">Notifications</h1>
				<div className="text-center py-12">
					<p className="text-red-600 mb-4">{error}</p>
					<Button onClick={loadNotifications}>Retry</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen space-y-8 p-6">
			<div className="flex justify-between items-center mb-6">
				<div className="flex items-center gap-3">
					<h1 className="text-3xl font-bold text-primary">Notifications</h1>
					<div className="w-8 h-8 bg-primary text-white text-lg rounded-full flex items-center justify-center font-semibold">
						{notifications.length}
					</div>
				</div>
				<button
					className="text-sm font-medium text-gray-600 hover:underline"
					onClick={markAllAsRead}
				>
					Mark all as read
				</button>
			</div>
			<div className="space-y-2">
				{/* New Notifications Divider */}
				<div className="flex items-center my-6">
					<div className="flex-1 h-px bg-gray-300"></div>
					<div className="flex items-center gap-2 px-4">
						<span className="text-sm font-medium text-gray-600">New</span>
						<div className="w-6 h-6 bg-primary text-white text-xs rounded-full flex items-center justify-center font-semibold">
							{newNotifications.length}
						</div>
					</div>
					<div className="flex-1 h-px bg-gray-300"></div>
				</div>

				{newNotifications.length === 0 ? (
					<div className="flex items-center justify-center py-4">
						<span className="text-gray-500 text-lg">No new notifications</span>
					</div>
				) : (
					newNotifications.map((n, idx) => {
						const originalIdx = notifications.findIndex(
							(notification) => notification === n
						);
						return (
							<div
								key={n.id}
								className={`flex items-center bg-white rounded-lg px-4 py-3 shadow-sm border-l-4 ${getPriorityColor(n.priority, n.read)} hover:bg-blue-50 transition-all duration-200 cursor-pointer ${
									selectedIdx === originalIdx ? "border-2 border-blue-500" : ""
								}`}
								onClick={() => {
									setSelectedIdx(originalIdx);
									if (!n.read) markAsRead(n.id);
								}}
							>
								<div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 mr-4 flex-shrink-0">
									{getPriorityIcon(n.priority)}
								</div>
								<div className="flex-1">
									<div className="text-base font-medium">{n.message}</div>
									<div className="text-xs text-gray-400 mt-1">{n.date}</div>
								</div>
								<div className="flex flex-col items-end ml-4">
									<span className="text-xs text-gray-400">{n.time}</span>
									<button
										className="text-gray-400 hover:text-gray-600 text-lg leading-none mt-2"
										aria-label="Dismiss"
										onClick={(e) => {
											e.stopPropagation();
											handleDismiss(originalIdx);
										}}
									>
										×
									</button>
								</div>
							</div>
						);
					})
				)}

				{/* Old Notifications Divider */}
				<div className="flex items-center my-6">
					<div className="flex-1 h-px bg-gray-300"></div>
					<div className="flex items-center gap-2 px-4">
						<span className="text-sm font-medium text-gray-600">Old</span>
						<div className="w-6 h-6 bg-gray-400 text-white text-xs rounded-full flex items-center justify-center font-semibold">
							{oldNotifications.length}
						</div>
					</div>
					<div className="flex-1 h-px bg-gray-300"></div>
				</div>

				{oldNotifications.map((n, idx) => {
					const originalIdx = notifications.findIndex(
						(notification) => notification === n
					);
					return (
						<div
							key={n.id}
							className={`flex items-center bg-white rounded-lg px-4 py-3 shadow-sm border-l-4 ${getPriorityColor(n.priority, n.read)} hover:bg-blue-50 transition-all duration-200 cursor-pointer ${
								selectedIdx === originalIdx ? "border-2 border-blue-500" : ""
							}`}
							onClick={() => setSelectedIdx(originalIdx)}
						>
							<div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 mr-4 flex-shrink-0">
								{getPriorityIcon(n.priority)}
							</div>
							<div className="flex-1">
								<div className="text-base">{n.message}</div>
								<div className="text-xs text-gray-400 mt-1">{n.date}</div>
							</div>
							<div className="flex flex-col items-end ml-4">
								<span className="text-xs text-gray-400">{n.time}</span>
								<button
									className="text-gray-400 hover:text-gray-600 text-lg leading-none mt-2"
									aria-label="Dismiss"
									onClick={(e) => {
										e.stopPropagation();
										handleDismiss(originalIdx);
									}}
								>
									×
								</button>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
