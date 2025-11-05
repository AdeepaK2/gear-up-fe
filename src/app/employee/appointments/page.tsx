"use client";
import React, { useState, useEffect } from "react";
import { Calendar } from '@/components/ui/calendar';
import { CalendarEvent } from '@/components/ui/calendar-event';
import { Search, HelpCircle, ChevronLeft, ChevronRight, Filter, Calendar as CalendarIcon } from "lucide-react";
import { appointmentService } from '@/lib/services/appointmentService';
import type { Appointment } from '@/lib/types/Appointment';

interface CalendarEvent {
	date: Date;
	title: string;
	description: string;
	color: string;
}

export default function EmployeeAppointments() {
	const [selectedDay, setSelectedDay] = useState<number | null>(7);
	const [activeTab, setActiveTab] = useState<"pending" | "confirmed" | "inprogress" | "completed">("pending");
	const [miniDate, setMiniDate] = useState<Date | undefined>(new Date());
	const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
	const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchKeyword, setSearchKeyword] = useState('');
	const [actionLoading, setActionLoading] = useState<number | null>(null);

	// Load appointments on component mount and when month changes
	useEffect(() => {
		loadAppointments();
	}, [calendarMonth]);

	// Filter appointments based on active tab
	useEffect(() => {
		filterAppointmentsByStatus();
	}, [appointments, activeTab]);

	// Convert appointments to calendar events
	useEffect(() => {
		convertAppointmentsToCalendarEvents();
	}, [appointments]);

	const loadAppointments = async () => {
		try {
			setLoading(true);
			setError(null);

			// Get appointments for the current month
			const year = calendarMonth.getFullYear();
			const month = calendarMonth.getMonth() + 1; // JavaScript months are 0-indexed

			const appointmentsData = await appointmentService.getEmployeeAppointments();
			setAppointments(appointmentsData);
		} catch (err) {
			console.error('Failed to load appointments:', err);
			setError(err instanceof Error ? err.message : 'Failed to load appointments');
		} finally {
			setLoading(false);
		}
	};

	const filterAppointmentsByStatus = () => {
		let filtered = appointments;

		switch (activeTab) {
			case 'pending':
				filtered = appointments.filter(apt => apt.status.toLowerCase() === 'pending');
				break;
			case 'confirmed':
				filtered = appointments.filter(apt => apt.status.toLowerCase() === 'confirmed');
				break;
			case 'inprogress':
				filtered = appointments.filter(apt => apt.status.toLowerCase() === 'in_progress');
				break;
			case 'completed':
				filtered = appointments.filter(apt => apt.status.toLowerCase() === 'completed');
				break;
		}

		setFilteredAppointments(filtered);
	};

	const handleApproveAppointment = async (appointmentId: number) => {
		try {
			setActionLoading(appointmentId);
			await appointmentService.approveAppointment(appointmentId);
			// Reload appointments after approval
			await loadAppointments();
			alert('Appointment approved successfully!');
		} catch (err) {
			console.error('Failed to approve appointment:', err);
			alert('Failed to approve appointment. Please try again.');
		} finally {
			setActionLoading(null);
		}
	};

	const handleRejectAppointment = async (appointmentId: number) => {
		if (!confirm('Are you sure you want to reject this appointment?')) {
			return;
		}

		try {
			setActionLoading(appointmentId);
			await appointmentService.rejectAppointment(appointmentId);
			// Reload appointments after rejection
			await loadAppointments();
			alert('Appointment rejected successfully!');
		} catch (err) {
			console.error('Failed to reject appointment:', err);
			alert('Failed to reject appointment. Please try again.');
		} finally {
			setActionLoading(null);
		}
	};

	const handleStartAppointment = async (appointmentId: number) => {
		try {
			setActionLoading(appointmentId);
			await appointmentService.startAppointment(appointmentId);
			// Reload appointments after starting
			await loadAppointments();
			alert('Appointment started successfully!');
		} catch (err) {
			console.error('Failed to start appointment:', err);
			alert('Failed to start appointment. Please try again.');
		} finally {
			setActionLoading(null);
		}
	};

	const handleCompleteAppointment = async (appointmentId: number) => {
		// Navigate to report submission page with query param
		window.location.href = `/employee/appointments/report?id=${appointmentId}`;
	};

	const convertAppointmentsToCalendarEvents = () => {
		const events: CalendarEvent[] = appointments.map(appointment => ({
			date: new Date(appointment.appointmentDate),
			title: appointment.consultationTypeLabel || appointment.consultationType,
			description: `${appointment.consultationTypeLabel || appointment.consultationType}\n${appointment.startTime || ''} - ${appointment.endTime || ''}`,
			color: getStatusColor(appointment.status)
		}));

		setCalendarEvents(events);
	};

	const getStatusColor = (status: string): string => {
		switch (status.toLowerCase()) {
			case 'confirmed':
				return '#fbbf24'; // yellow
			case 'in_progress':
				return '#3b82f6'; // blue
			case 'completed':
				return '#10b981'; // green
			case 'cancelled':
				return '#ef4444'; // red
			default:
				return '#6b7280'; // gray
		}
	};

	const handleDateSelect = async (date: Date | undefined) => {
		if (date) {
			setMiniDate(date);
			try {
				const dateString = date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD
				const dayAppointments = await appointmentService.getAppointmentsByDate(dateString);
				setAppointments(dayAppointments);
			} catch (err) {
				console.error('Failed to load appointments for date:', err);
			}
		}
	};

	return (
		<div className="min-h-screen space-y-8 p-6">
			<h1 className="text-3xl font-bold text-primary mb-6">Appointments</h1>
			<div className="flex gap-8">
				{/* Left Sidebar - Fixed width on large screens, full width on mobile */}
				<div className="flex flex-col gap-4 w-full lg:w-[320px] lg:flex-shrink-0">
					{/* Filter and Month */}
					<div className="flex gap-2">
						<button className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border font-medium text-sm">
							<Filter className="w-4 h-4" /> Filter
						</button>
						<button className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border font-medium text-sm">
							<CalendarIcon className="w-4 h-4" /> Monthly
						</button>
					</div>
					{/* Mini Calendar */}
					<div className="bg-white rounded-xl p-4">
						<Calendar
							mode="single"
							selected={miniDate}
							onSelect={handleDateSelect}
							month={miniDate}
							onMonthChange={setMiniDate}
							numberOfMonths={1}
							fixedWeeks
							className="rounded-md border-none shadow-none"
						/>
					</div>
					{/* Appointment List */}
					<div className="bg-white rounded-xl p-4 mt-2">
						<div className="font-semibold mb-2">My Appointment List</div>
						{loading ? (
							<div className="text-center py-4">Loading...</div>
						) : error ? (
							<div className="text-center py-4 text-red-500">Error: {error}</div>
						) : (
							<div className="flex flex-col gap-3">
								{filteredAppointments.slice(0, 5).map((appointment) => (
									<div key={appointment.id} className="py-2 border-b last:border-0">
										<div className="flex items-center justify-between mb-2">
											<div className="flex-1">
												<div className="font-medium text-sm">Customer #{appointment.customerId}</div>
												<div className="text-blue-600 text-xs">{appointment.consultationTypeLabel || appointment.consultationType}</div>
												<div className="text-xs text-gray-600 mt-1">
													{appointment.startTime && appointment.endTime
														? `${appointment.startTime} - ${appointment.endTime}`
														: appointment.startTime || 'Time TBD'
													}
												</div>
											</div>
											<div className={`ml-2 w-3 h-3 rounded-full flex-shrink-0 ${
												appointment.status.toLowerCase() === 'completed' ? 'bg-green-500' :
												appointment.status.toLowerCase() === 'in_progress' ? 'bg-blue-500' :
												appointment.status.toLowerCase() === 'confirmed' ? 'bg-blue-500' :
												'bg-yellow-500'
											}`}></div>
										</div>
										{appointment.status.toLowerCase() === 'pending' && (
											<div className="flex gap-2 mt-2">
												<button
													onClick={() => handleApproveAppointment(appointment.id)}
													disabled={actionLoading === appointment.id}
													className="flex-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-medium disabled:opacity-50"
												>
													{actionLoading === appointment.id ? 'Approving...' : 'Approve'}
												</button>
												<button
													onClick={() => handleRejectAppointment(appointment.id)}
													disabled={actionLoading === appointment.id}
													className="flex-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium disabled:opacity-50"
												>
													{actionLoading === appointment.id ? 'Rejecting...' : 'Reject'}
												</button>
											</div>
										)}
										{appointment.status.toLowerCase() === 'confirmed' && (
											<div className="flex gap-2 mt-2">
												<button
													onClick={() => handleStartAppointment(appointment.id)}
													disabled={actionLoading === appointment.id}
													className="flex-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-medium disabled:opacity-50"
												>
													{actionLoading === appointment.id ? 'Starting...' : 'Start Work'}
												</button>
											</div>
										)}
										{appointment.status.toLowerCase() === 'in_progress' && (
											<div className="flex gap-2 mt-2">
												<button
													onClick={() => handleCompleteAppointment(appointment.id)}
													disabled={actionLoading === appointment.id}
													className="flex-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-medium disabled:opacity-50"
												>
													Submit Report
												</button>
											</div>
										)}
									</div>
								))}
								{filteredAppointments.length === 0 && (
									<div className="text-center py-4 text-gray-500">
										No {activeTab} appointments found
									</div>
								)}
							</div>
						)}
						<button
							onClick={() => window.location.href = '/employee/appointments'}
							className="w-full mt-4 py-2 rounded-full bg-primary hover:bg-secondary text-white font-semibold text-sm"
						>
							See All ({appointments.length})
						</button>
					</div>
				</div>
				{/* Right Calendar Grid */}
				<div className="flex-1">
					{/* Top Controls */}
					<div className="flex justify-between items-center mb-2">
						<div className="flex items-center gap-2">
							{/* Month/Year Picker - only show month/year and navigation, no days */}
							<div className="bg-white rounded-xl px-4 py-2 flex items-center min-w-[220px] justify-between">
								<button
									className="p-1 rounded hover:bg-gray-100"
									onClick={() =>
										setCalendarMonth(prev =>
											new Date(prev.getFullYear(), prev.getMonth() - 1)
										)
									}
									aria-label="Previous Month"
								>
									<ChevronLeft className="w-5 h-5" />
								</button>
								<span className="font-semibold text-lg">
									{calendarMonth.toLocaleString("default", { month: "long", year: "numeric" })}
								</span>
								<button
									className="p-1 rounded hover:bg-gray-100"
									onClick={() =>
										setCalendarMonth(prev =>
											new Date(prev.getFullYear(), prev.getMonth() + 1)
										)
									}
									aria-label="Next Month"
								>
									<ChevronRight className="w-5 h-5" />
								</button>
							</div>
							{/* ...existing code for Today button... */}
							
						</div>
						<div className="flex items-center gap-2">
							<div className="flex items-center bg-white rounded-full px-3 py-1 border">
								<Search className="w-4 h-4 mr-2 text-gray-400" />
								<input 
									className="bg-transparent outline-none text-sm w-24" 
									placeholder="Search" 
									value={searchKeyword}
									onChange={(e) => setSearchKeyword(e.target.value)}
									onKeyPress={async (e) => {
										if (e.key === 'Enter' && searchKeyword.trim()) {
											try {
												const searchResults = await appointmentService.searchAppointments(searchKeyword);
												setAppointments(searchResults);
											} catch (err) {
												console.error('Search failed:', err);
											}
										}
									}}
								/>
							</div>
							<button 
								onClick={loadAppointments}
								className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border font-medium text-sm hover:bg-gray-50"
							>
								Refresh
							</button>
						</div>
					</div>
					{/* Status Tabs */}
					<div className="flex gap-2 mb-2">
						<button
							className={`px-4 py-2 rounded-full font-medium text-sm ${activeTab === "pending" ? "bg-yellow-200" : "bg-white"}`}
							onClick={() => setActiveTab("pending")}
						>
							Pending Approval
						</button>
						<button
							className={`px-4 py-2 rounded-full font-medium text-sm ${activeTab === "confirmed" ? "bg-gray-200" : "bg-white"}`}
							onClick={() => setActiveTab("confirmed")}
						>
							Confirmed
						</button>
						<button
							className={`px-4 py-2 rounded-full font-medium text-sm ${activeTab === "inprogress" ? "bg-gray-200" : "bg-white"}`}
							onClick={() => setActiveTab("inprogress")}
						>
							In progress
						</button>
						<button
							className={`px-4 py-2 rounded-full font-medium text-sm ${activeTab === "completed" ? "bg-gray-200" : "bg-white"}`}
							onClick={() => setActiveTab("completed")}
						>
							Completed
						</button>
					</div>
					{/* Calendar Grid */}
					<div className="bg-white rounded-xl p-4">
						<CalendarEvent
							month={calendarMonth}
							events={calendarEvents}
							onDayClick={date => setCalendarMonth(new Date(date.getFullYear(), date.getMonth()))}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}


