"use client";

import React, { useState, useEffect } from "react";
import { timeLogService, TimeLog } from "@/lib/services/timeLogService";
import { useToast } from "@/contexts/ToastContext";
import {
	Clock,
	Calendar,
	User,
	Briefcase,
	CheckCircle,
	Search,
	ChevronDown,
	ChevronRight,
	Trash2,
	Filter,
	X,
} from "lucide-react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface EmployeeTimeLogs {
	employeeId: number;
	employeeName: string;
	employeeEmail: string;
	logs: TimeLog[];
	totalHours: number;
}

export default function AdminTimeLogsPage() {
	const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedLogId, setSelectedLogId] = useState<number | null>(null);
	const [expandedEmployees, setExpandedEmployees] = useState<Set<number>>(
		new Set()
	);
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [showFilters, setShowFilters] = useState(false);
	const toast = useToast();

	useEffect(() => {
		loadTimeLogs();
	}, []);

	const loadTimeLogs = async () => {
		try {
			setLoading(true);
			const logs = await timeLogService.getAllTimeLogs();
			// Sort by logged date (most recent first)
			const sortedLogs = logs.sort(
				(a, b) =>
					new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime()
			);
			setTimeLogs(sortedLogs);
		} catch (error) {
			console.error("Error loading time logs:", error);
			toast.error("Failed to load time logs");
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteClick = (logId: number) => {
		setSelectedLogId(logId);
		setDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!selectedLogId) return;

		try {
			await timeLogService.deleteTimeLog(selectedLogId);
			toast.success("Time log deleted successfully");
			loadTimeLogs();
		} catch (error) {
			console.error("Error deleting time log:", error);
			toast.error("Failed to delete time log");
		} finally {
			setDeleteDialogOpen(false);
			setSelectedLogId(null);
		}
	};

	const toggleEmployee = (employeeId: number) => {
		const newExpanded = new Set(expandedEmployees);
		if (newExpanded.has(employeeId)) {
			newExpanded.delete(employeeId);
		} else {
			newExpanded.add(employeeId);
		}
		setExpandedEmployees(newExpanded);
	};

	const clearFilters = () => {
		setStartDate("");
		setEndDate("");
		setSearchTerm("");
	};

	// Filter logs by date range and search term
	const filteredLogs = timeLogs.filter((log) => {
		const matchesSearch = log.description
			.toLowerCase()
			.includes(searchTerm.toLowerCase());

		if (!matchesSearch) return false;

		if (startDate || endDate) {
			const logDate = new Date(log.loggedAt);
			if (startDate && logDate < new Date(startDate)) return false;
			if (endDate) {
				const end = new Date(endDate);
				end.setHours(23, 59, 59, 999);
				if (logDate > end) return false;
			}
		}

		return true;
	});

	// Group logs by employee
	const employeeGroups: EmployeeTimeLogs[] = React.useMemo(() => {
		const grouped = filteredLogs.reduce((acc, log) => {
			// Skip logs without employee information
			if (!log.employeeId || !log.employeeName) {
				console.warn('Time log missing employee information:', log);
				return acc;
			}
			
			const employeeId = log.employeeId;
			if (!acc[employeeId]) {
				acc[employeeId] = {
					employeeId,
					employeeName: log.employeeName,
					employeeEmail: log.employeeEmail,
					logs: [],
					totalHours: 0,
				};
			}
			acc[employeeId].logs.push(log);
			acc[employeeId].totalHours += log.hoursWorked;
			return acc;
		}, {} as Record<number, EmployeeTimeLogs>);

		return Object.values(grouped).sort((a, b) =>
			a.employeeName.localeCompare(b.employeeName)
		);
	}, [filteredLogs]);

	const totalHours = filteredLogs.reduce(
		(sum, log) => sum + log.hoursWorked,
		0
	);

	const formatDateTime = (dateString: string) => {
		return new Date(dateString).toLocaleString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const hasActiveFilters = startDate || endDate || searchTerm;

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Time Logs</h1>
					<p className="text-gray-600 mt-1">
						View employee work logs grouped by person
					</p>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">Total Employees</p>
							<p className="text-2xl font-bold text-gray-900 mt-1">
								{employeeGroups.length}
							</p>
						</div>
						<div className="bg-blue-100 p-3 rounded-full">
							<User className="w-6 h-6 text-blue-600" />
						</div>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">Total Hours</p>
							<p className="text-2xl font-bold text-gray-900 mt-1">
								{totalHours.toFixed(2)}
							</p>
						</div>
						<div className="bg-green-100 p-3 rounded-full">
							<CheckCircle className="w-6 h-6 text-green-600" />
						</div>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">Total Logs</p>
							<p className="text-2xl font-bold text-gray-900 mt-1">
								{filteredLogs.length}
							</p>
						</div>
						<div className="bg-purple-100 p-3 rounded-full">
							<Clock className="w-6 h-6 text-purple-600" />
						</div>
					</div>
				</div>
			</div>

			{/* Search and Filters */}
			<div className="bg-white rounded-lg shadow p-4 space-y-4">
				<div className="flex gap-4 items-center">
					<div className="flex-1 relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
						<input
							type="text"
							placeholder="Search by description..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
						/>
					</div>
					<button
						onClick={() => setShowFilters(!showFilters)}
						className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
							showFilters
								? "bg-primary text-white border-primary"
								: "border-gray-300 hover:bg-gray-50"
						}`}
					>
						<Filter className="w-5 h-5" />
						Filters
					</button>
					{hasActiveFilters && (
						<button
							onClick={clearFilters}
							className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
						>
							<X className="w-5 h-5" />
							Clear
						</button>
					)}
				</div>

				{showFilters && (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Start Date
							</label>
							<input
								type="date"
								value={startDate}
								onChange={(e) => setStartDate(e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								End Date
							</label>
							<input
								type="date"
								value={endDate}
								onChange={(e) => setEndDate(e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
							/>
						</div>
					</div>
				)}
			</div>

			{/* Employee Groups */}
			<div className="space-y-4">
				{employeeGroups.length === 0 ? (
					<div className="bg-white rounded-lg shadow p-12 text-center">
						<Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
						<p className="text-lg font-medium text-gray-900">
							No time logs found
						</p>
						<p className="text-sm text-gray-500 mt-1">
							{hasActiveFilters
								? "Try adjusting your filters"
								: "Time logs will appear here once employees start logging work"}
						</p>
					</div>
				) : (
					employeeGroups.map((employee) => (
						<div
							key={employee.employeeId}
							className="bg-white rounded-lg shadow overflow-hidden"
						>
							{/* Employee Header */}
							<div
								className="p-4 bg-gray-50 border-b cursor-pointer hover:bg-gray-100 transition-colors"
								onClick={() => toggleEmployee(employee.employeeId)}
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										{expandedEmployees.has(employee.employeeId) ? (
											<ChevronDown className="w-5 h-5 text-gray-500" />
										) : (
											<ChevronRight className="w-5 h-5 text-gray-500" />
										)}
										<div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold">
											{employee.employeeName.charAt(0).toUpperCase()}
										</div>
										<div>
											<h3 className="font-semibold text-gray-900">
												{employee.employeeName}
											</h3>
											<p className="text-sm text-gray-500">
												{employee.employeeEmail}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-6">
										<div className="text-right">
											<p className="text-sm text-gray-500">Total Hours</p>
											<p className="text-xl font-bold text-primary">
												{employee.totalHours.toFixed(2)}h
											</p>
										</div>
										<div className="text-right">
											<p className="text-sm text-gray-500">Logs</p>
											<p className="text-xl font-bold text-gray-900">
												{employee.logs.length}
											</p>
										</div>
									</div>
								</div>
							</div>

							{/* Employee Logs */}
							{expandedEmployees.has(employee.employeeId) && (
								<div className="overflow-x-auto">
									<table className="min-w-full divide-y divide-gray-200">
										<thead className="bg-gray-50">
											<tr>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Description
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Project/Appointment
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Start Time
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													End Time
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Hours
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
													Actions
												</th>
											</tr>
										</thead>
										<tbody className="bg-white divide-y divide-gray-200">
											{employee.logs.map((log) => (
												<tr
													key={log.logId}
													className="hover:bg-gray-50 transition-colors"
												>
													<td className="px-6 py-4">
														<div className="text-sm font-medium text-gray-900">
															{log.description}
														</div>
													</td>
													<td className="px-6 py-4">
														{log.projectName ? (
															<div className="flex items-center gap-2">
																<Briefcase className="w-4 h-4 text-blue-500" />
																<span className="text-sm text-gray-900">
																	{log.projectName}
																</span>
															</div>
														) : log.appointmentDate ? (
															<div className="flex items-center gap-2">
																<Calendar className="w-4 h-4 text-green-500" />
																<span className="text-sm text-gray-900">
																	Appointment ({log.appointmentDate})
																</span>
															</div>
														) : (
															<span className="text-sm text-gray-400">-</span>
														)}
													</td>
													<td className="px-6 py-4 whitespace-nowrap">
														<div className="text-sm text-gray-900">
															{formatDateTime(log.startTime)}
														</div>
													</td>
													<td className="px-6 py-4 whitespace-nowrap">
														<div className="text-sm text-gray-900">
															{formatDateTime(log.endTime)}
														</div>
													</td>
													<td className="px-6 py-4 whitespace-nowrap">
														<div className="flex items-center">
															<Clock className="w-4 h-4 text-gray-400 mr-2" />
															<span className="text-sm font-semibold text-gray-900">
																{log.hoursWorked.toFixed(2)}h
															</span>
														</div>
													</td>
													<td className="px-6 py-4 whitespace-nowrap">
														<button
															onClick={(e) => {
																e.stopPropagation();
																handleDeleteClick(log.logId);
															}}
															className="text-red-600 hover:text-red-800 transition-colors"
															title="Delete time log"
														>
															<Trash2 className="w-5 h-5" />
														</button>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							)}
						</div>
					))
				)}
			</div>

			{/* Delete Confirmation Dialog */}
			<ConfirmationDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				title="Delete Time Log"
				description="Are you sure you want to delete this time log? This action cannot be undone."
				confirmText="Delete"
				cancelText="Cancel"
				variant="destructive"
				onConfirm={handleDeleteConfirm}
			/>
		</div>
	);
}
