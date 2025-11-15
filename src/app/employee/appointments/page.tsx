"use client";
import React, { useState, useEffect } from "react";
import { CalendarEvent } from '@/components/ui/calendar-event';
import { Search, ChevronLeft, ChevronRight, Eye, Calendar as CalendarIcon, Clock, User, FileText, AlertCircle, ClipboardList } from "lucide-react";
import { appointmentService } from '@/lib/services/appointmentService';
import { timeLogService } from '@/lib/services/timeLogService';
import type { Appointment } from '@/lib/types/Appointment';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CalendarEvent {
	date: Date;
	title: string;
	description: string;
	color: string;
}

export default function EmployeeAppointments() {
	const [activeTab, setActiveTab] = useState<"confirmed" | "inprogress" | "completed">("confirmed");
	const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
	const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchKeyword, setSearchKeyword] = useState('');
	const [actionLoading, setActionLoading] = useState<number | null>(null);
	const [viewDialogOpen, setViewDialogOpen] = useState(false);
	const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
	const [logWorkDialogOpen, setLogWorkDialogOpen] = useState(false);
	const [logWorkData, setLogWorkData] = useState({
		description: '',
		startTime: '',
		endTime: '',
		hoursWorked: 0
	});
	const [submittingLogWork, setSubmittingLogWork] = useState(false);
	const [appointmentTimeLogs, setAppointmentTimeLogs] = useState<Record<number, any[]>>({});
	const [loadingTimeLogs, setLoadingTimeLogs] = useState<Record<number, boolean>>({});

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
			
			// Load time logs for completed appointments
			const completedAppointments = appointmentsData.filter(apt => apt.status.toUpperCase() === 'COMPLETED');
			for (const appointment of completedAppointments) {
				await loadTimeLogsForAppointment(appointment.id);
			}
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
			case 'confirmed':
				filtered = appointments.filter(apt => apt.status.toUpperCase() === 'CONFIRMED');
				break;
			case 'inprogress':
				filtered = appointments.filter(apt => apt.status.toUpperCase() === 'IN_PROGRESS');
				break;
			case 'completed':
				filtered = appointments.filter(apt => apt.status.toUpperCase() === 'COMPLETED');
				break;
		}

		setFilteredAppointments(filtered);
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

	const handleViewDetails = (appointment: Appointment) => {
		setSelectedAppointment(appointment);
		setViewDialogOpen(true);
	};

	const loadTimeLogsForAppointment = async (appointmentId: number) => {
		try {
			setLoadingTimeLogs(prev => ({ ...prev, [appointmentId]: true }));
			const logs = await timeLogService.getTimeLogsByAppointment(appointmentId);
			setAppointmentTimeLogs(prev => ({ ...prev, [appointmentId]: logs }));
		} catch (err) {
			console.error(`Failed to load time logs for appointment ${appointmentId}:`, err);
		} finally {
			setLoadingTimeLogs(prev => ({ ...prev, [appointmentId]: false }));
		}
	};

	const hasLoggedWork = (appointmentId: number) => {
		return appointmentTimeLogs[appointmentId] && appointmentTimeLogs[appointmentId].length > 0;
	};

	const getLoggedWorkDetails = (appointmentId: number) => {
		return appointmentTimeLogs[appointmentId]?.[0]; // Get first log
	};

	const handleLogWork = (appointment: Appointment) => {
		setSelectedAppointment(appointment);
		setLogWorkData({
			description: '',
			startTime: '',
			endTime: '',
			hoursWorked: 0
		});
		setLogWorkDialogOpen(true);
	};

	const calculateHours = () => {
		if (logWorkData.startTime && logWorkData.endTime) {
			const start = new Date(logWorkData.startTime);
			const end = new Date(logWorkData.endTime);
			const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
			setLogWorkData(prev => ({ ...prev, hoursWorked: Math.max(0, diff) }));
		}
	};

	const handleSubmitLogWork = async () => {
		if (!selectedAppointment || !logWorkData.description.trim() || !logWorkData.startTime || !logWorkData.endTime) {
			alert('Please fill in all required fields');
			return;
		}

		const start = new Date(logWorkData.startTime);
		const end = new Date(logWorkData.endTime);
		if (start >= end) {
			alert('End time must be after start time');
			return;
		}

		setSubmittingLogWork(true);
		try {
			await timeLogService.createTimeLog({
				description: logWorkData.description,
				startTime: logWorkData.startTime,
				endTime: logWorkData.endTime,
				appointmentId: selectedAppointment.id
			});
			alert('Work logged successfully!');
			setLogWorkDialogOpen(false);
			setSelectedAppointment(null);
			// Reload time logs for this appointment
			await loadTimeLogsForAppointment(selectedAppointment.id);
		} catch (err) {
			console.error('Failed to log work:', err);
			alert(err instanceof Error ? err.message : 'Failed to log work. Please try again.');
		} finally {
			setSubmittingLogWork(false);
		}
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

	return (
		<div className="min-h-screen space-y-8 p-6">
			<h1 className="text-3xl font-bold text-primary mb-6">Appointments</h1>
			<div className="flex gap-8">
				{/* Left Sidebar - Fixed width on large screens, full width on mobile */}
				<div className="flex flex-col gap-4 w-full lg:w-[320px] lg:flex-shrink-0">
					{/* Appointment List */}
					<div className="bg-white rounded-xl p-4">
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
												appointment.status.toUpperCase() === 'COMPLETED' ? 'bg-green-500' :
												appointment.status.toUpperCase() === 'IN_PROGRESS' ? 'bg-blue-500' :
												appointment.status.toUpperCase() === 'CONFIRMED' ? 'bg-blue-500' :
												'bg-yellow-500'
											}`}></div>
										</div>
										{appointment.status.toUpperCase() === 'CONFIRMED' && (
											<div className="flex gap-2 mt-2">
												<button
													onClick={() => handleViewDetails(appointment)}
													className="flex-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1"
												>
													<Eye className="w-3 h-3" />
													View
												</button>
												<button
													onClick={() => handleStartAppointment(appointment.id)}
													disabled={actionLoading === appointment.id}
													className="flex-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-medium disabled:opacity-50"
												>
													{actionLoading === appointment.id ? 'Starting...' : 'Start Work'}
												</button>
											</div>
										)}
										{appointment.status.toUpperCase() === 'IN_PROGRESS' && (
											<div className="flex gap-2 mt-2">
												<button
													onClick={() => handleViewDetails(appointment)}
													className="flex-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1"
												>
													<Eye className="w-3 h-3" />
													View
												</button>
												<button
													onClick={() => handleCompleteAppointment(appointment.id)}
													disabled={actionLoading === appointment.id}
													className="flex-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-medium disabled:opacity-50"
												>
													Submit Report
												</button>
											</div>
										)}
										{selectedAppointment.status.toUpperCase() === 'COMPLETED' && (
											<div className="flex gap-2 mt-2">
												<button
													onClick={() => handleViewDetails(appointment)}
													className="flex-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1"
												>
													<Eye className="w-3 h-3" />
													View Report
												</button>
												{!hasLoggedWork(appointment.id) ? (
													<button
														onClick={() => handleLogWork(appointment)}
														className="flex-1 px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1"
													>
														<ClipboardList className="w-3 h-3" />
														Log
													</button>
												) : (
													<div className="flex-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-medium text-center">
														✓ Logged
													</div>
												)}
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
							className={`px-4 py-2 rounded-full font-medium text-sm ${activeTab === "confirmed" ? "bg-blue-200" : "bg-white"}`}
							onClick={() => setActiveTab("confirmed")}
						>
							Confirmed
						</button>
						<button
							className={`px-4 py-2 rounded-full font-medium text-sm ${activeTab === "inprogress" ? "bg-orange-200" : "bg-white"}`}
							onClick={() => setActiveTab("inprogress")}
						>
							In Progress
						</button>
						<button
							className={`px-4 py-2 rounded-full font-medium text-sm ${activeTab === "completed" ? "bg-green-200" : "bg-white"}`}
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

			{/* View Details Dialog */}
			<Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Appointment Details</DialogTitle>
						<DialogDescription>
							Complete information about this appointment
						</DialogDescription>
					</DialogHeader>

					{selectedAppointment && (
						<div className="space-y-4">
							{/* Customer & Vehicle Info */}
							<div className="bg-blue-50 p-4 rounded-lg">
								<h3 className="font-semibold text-lg text-gray-900 mb-3">
									Customer & Vehicle Information
								</h3>
								<div className="grid grid-cols-2 gap-3">
									<div>
										<p className="text-sm text-gray-600">Customer ID</p>
										<p className="font-medium">#{selectedAppointment.customerId}</p>
									</div>
									<div>
										<p className="text-sm text-gray-600">Vehicle</p>
										<p className="font-medium">{selectedAppointment.vehicleName || 'N/A'}</p>
									</div>
									<div className="col-span-2">
										<p className="text-sm text-gray-600">Vehicle Details</p>
										<p className="font-medium">{selectedAppointment.vehicleDetails || 'N/A'}</p>
									</div>
								</div>
							</div>

							{/* Appointment Info */}
							<div className="bg-purple-50 p-4 rounded-lg">
								<h3 className="font-semibold text-lg text-gray-900 mb-3">
									Appointment Information
								</h3>
								<div className="space-y-3">
									<div>
										<p className="text-sm text-gray-600 mb-1">Consultation Type</p>
										<Badge variant="outline" className="text-sm">
											{selectedAppointment.consultationTypeLabel || selectedAppointment.consultationType}
										</Badge>
									</div>
									<div className="grid grid-cols-2 gap-3">
										<div>
											<p className="text-sm text-gray-600 flex items-center gap-1">
												<CalendarIcon className="w-4 h-4" /> Date
											</p>
											<p className="font-medium">
												{new Date(selectedAppointment.appointmentDate).toLocaleDateString('en-US', {
													weekday: 'long',
													year: 'numeric',
													month: 'long',
													day: 'numeric'
												})}
											</p>
										</div>
										<div>
											<p className="text-sm text-gray-600 flex items-center gap-1">
												<Clock className="w-4 h-4" /> Time
											</p>
											<p className="font-medium">
												{selectedAppointment.startTime && selectedAppointment.endTime
													? `${selectedAppointment.startTime} - ${selectedAppointment.endTime}`
													: 'Time TBD'}
											</p>
										</div>
									</div>
									<div>
										<p className="text-sm text-gray-600">Status</p>
										<Badge
											className={`mt-1 ${
												selectedAppointment.status.toUpperCase() === 'COMPLETED'
													? 'bg-green-500'
													: selectedAppointment.status.toUpperCase() === 'IN_PROGRESS'
													? 'bg-blue-500'
													: selectedAppointment.status.toUpperCase() === 'CONFIRMED'
													? 'bg-yellow-500'
													: 'bg-gray-500'
											}`}
										>
											{selectedAppointment.status.toUpperCase() === 'IN_PROGRESS'
												? 'In Progress'
												: selectedAppointment.status.charAt(0) + selectedAppointment.status.slice(1).toLowerCase()}
										</Badge>
									</div>
								</div>
							</div>

							{/* Customer Issue & Notes */}
							{(selectedAppointment.customerIssue || selectedAppointment.notes) && (
								<div className="bg-gray-50 p-4 rounded-lg">
									<h3 className="font-semibold text-lg text-gray-900 mb-3">
										Additional Information
									</h3>
									<div className="space-y-3">
										{selectedAppointment.customerIssue && (
											<div>
												<p className="font-medium text-gray-900 flex items-center gap-1">
													<AlertCircle className="w-4 h-4" /> Customer Issue:
												</p>
												<p className="text-gray-700 mt-1">
													{selectedAppointment.customerIssue}
												</p>
											</div>
										)}
										{selectedAppointment.notes && (
											<div>
												<p className="font-medium text-gray-900 flex items-center gap-1">
													<FileText className="w-4 h-4" /> Notes:
												</p>
												<p className="text-gray-700 mt-1">
													{selectedAppointment.notes}
												</p>
											</div>
										)}
									</div>
								</div>
							)}

							{/* Submitted Report Details */}
							{selectedAppointment.status.toUpperCase() === 'COMPLETED' && selectedAppointment.notes && (
								<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
									<h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center gap-2">
										<FileText className="w-5 h-5 text-blue-600" />
										Submitted Report
									</h3>
									<div className="space-y-3">
										<div className="bg-white p-3 rounded-lg">
											<p className="text-sm text-gray-600 mb-2">Report Details</p>
											<div className="prose prose-sm max-w-none">
												<p className="text-gray-800 whitespace-pre-wrap">{selectedAppointment.notes}</p>
											</div>
										</div>
										<div className="text-xs text-gray-500 flex items-center gap-1">
											<Clock className="w-3 h-3" />
											Submitted on {new Date(selectedAppointment.appointmentDate).toLocaleDateString()}
										</div>
									</div>
								</div>
							)}

							{/* Logged Work Details */}
							{selectedAppointment.status.toUpperCase() === 'COMPLETED' && hasLoggedWork(selectedAppointment.id) && (
								<div className="bg-green-50 p-4 rounded-lg border border-green-200">
									<h3 className="font-semibold text-lg text-gray-900 mb-3 flex items-center gap-2">
										<ClipboardList className="w-5 h-5 text-green-600" />
										Logged Work
									</h3>
									{(() => {
										const logDetails = getLoggedWorkDetails(selectedAppointment.id);
										if (!logDetails) return null;
										return (
											<div className="space-y-2">
												<div>
													<p className="text-sm text-gray-600">Hours Worked</p>
													<p className="text-2xl font-bold text-green-600">
														{logDetails.hoursWorked.toFixed(2)} hours
													</p>
												</div>
												<div className="grid grid-cols-2 gap-3">
													<div>
														<p className="text-sm text-gray-600">Start Time</p>
														<p className="font-medium">
															{new Date(logDetails.startTime).toLocaleString()}
														</p>
													</div>
													<div>
														<p className="text-sm text-gray-600">End Time</p>
														<p className="font-medium">
															{new Date(logDetails.endTime).toLocaleString()}
														</p>
													</div>
												</div>
												<div>
													<p className="text-sm text-gray-600">Work Description</p>
													<p className="font-medium mt-1">{logDetails.description}</p>
												</div>
												<div>
													<p className="text-sm text-gray-600">Logged At</p>
													<p className="text-xs text-gray-500">
														{new Date(logDetails.loggedAt).toLocaleString()}
													</p>
												</div>
											</div>
										);
									})()}
								</div>
							)}

							{/* Action Buttons */}
							<div className="flex gap-3 pt-4 border-t">
								{selectedAppointment.status.toUpperCase() === 'CONFIRMED' && (
									<button
										onClick={() => {
											setViewDialogOpen(false);
											handleStartAppointment(selectedAppointment.id);
										}}
										disabled={actionLoading === selectedAppointment.id}
										className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50"
									>
										{actionLoading === selectedAppointment.id ? 'Starting...' : 'Start Work'}
									</button>
								)}
								{selectedAppointment.status.toUpperCase() === 'IN_PROGRESS' && (
									<button
										onClick={() => {
											setViewDialogOpen(false);
											handleCompleteAppointment(selectedAppointment.id);
										}}
										className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
									>
										Submit Report
									</button>
								)}
								{selectedAppointment.status.toUpperCase() === 'COMPLETED' && (
									<>
										{!hasLoggedWork(selectedAppointment.id) && (
											<button
												onClick={() => {
													setViewDialogOpen(false);
													handleLogWork(selectedAppointment);
												}}
												className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
											>
												<ClipboardList className="w-4 h-4" />
												Log Work
											</button>
										)}
									</>
								)}
								<button
									onClick={() => setViewDialogOpen(false)}
									className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium"
								>
									Close
								</button>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>

			{/* Log Work Dialog */}
			<Dialog open={logWorkDialogOpen} onOpenChange={setLogWorkDialogOpen}>
				<DialogContent className="max-w-lg">
					<DialogHeader>
						<DialogTitle>Log Work for Appointment</DialogTitle>
						<DialogDescription>
							Record the time you worked on this appointment
						</DialogDescription>
					</DialogHeader>

					{selectedAppointment && (
						<div className="space-y-4">
							{/* Appointment Info */}
							<div className="bg-gray-50 p-3 rounded-lg">
								<p className="text-sm text-gray-600">Appointment</p>
								<p className="font-medium">
									{selectedAppointment.consultationTypeLabel || selectedAppointment.consultationType} - Customer #{selectedAppointment.customerId}
								</p>
								<p className="text-sm text-gray-500">{selectedAppointment.appointmentDate}</p>
							</div>

							{/* Start Time */}
							<div className="space-y-2">
								<Label htmlFor="startTime">Start Time *</Label>
								<Input
									id="startTime"
									type="datetime-local"
									value={logWorkData.startTime}
									onChange={(e) => {
										setLogWorkData({ ...logWorkData, startTime: e.target.value });
										setTimeout(calculateHours, 0);
									}}
									required
								/>
							</div>

							{/* End Time */}
							<div className="space-y-2">
								<Label htmlFor="endTime">End Time *</Label>
								<Input
									id="endTime"
									type="datetime-local"
									value={logWorkData.endTime}
									onChange={(e) => {
										setLogWorkData({ ...logWorkData, endTime: e.target.value });
										setTimeout(calculateHours, 0);
									}}
									required
								/>
							</div>

							{/* Hours Calculation */}
							{logWorkData.hoursWorked > 0 && (
								<div className="bg-blue-50 p-3 rounded-lg">
									<p className="text-sm text-gray-600">Total Hours</p>
									<p className="text-xl font-bold text-blue-600">
										{logWorkData.hoursWorked.toFixed(2)} hours
									</p>
								</div>
							)}

							{/* Description */}
							<div className="space-y-2">
								<Label htmlFor="description">Work Description *</Label>
								<Textarea
									id="description"
									placeholder="Describe the work performed..."
									value={logWorkData.description}
									onChange={(e) => setLogWorkData({ ...logWorkData, description: e.target.value })}
									rows={4}
									required
								/>
							</div>
						</div>
					)}

					<DialogFooter>
						<button
							onClick={() => setLogWorkDialogOpen(false)}
							className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium"
							disabled={submittingLogWork}
						>
							Cancel
						</button>
						<button
							onClick={handleSubmitLogWork}
							className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium disabled:opacity-50"
							disabled={submittingLogWork || !logWorkData.description.trim() || !logWorkData.startTime || !logWorkData.endTime}
						>
							{submittingLogWork ? 'Logging...' : 'Log Work'}
						</button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}


