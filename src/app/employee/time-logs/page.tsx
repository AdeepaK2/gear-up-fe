"use client";

import React, { useState, useEffect } from "react";
import { timeLogService, TimeLog } from "@/lib/services/timeLogService";
import { useToast } from "@/contexts/ToastContext";
import {
	Clock,
	Calendar,
	Briefcase,
	TrendingUp,
	Search,
	Filter,
	X,
	BarChart3,
} from "lucide-react";

export default function EmployeeTimeLogsPage() {
	const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
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

	// Calculate statistics
	const totalHours = filteredLogs.reduce(
		(sum, log) => sum + log.hoursWorked,
		0
	);

	const projectLogs = filteredLogs.filter((log) => log.projectId);
	const appointmentLogs = filteredLogs.filter((log) => log.appointmentId);

	const projectHours = projectLogs.reduce(
		(sum, log) => sum + log.hoursWorked,
		0
	);
	const appointmentHours = appointmentLogs.reduce(
		(sum, log) => sum + log.hoursWorked,
		0
	);

	// Group logs by project/appointment
	const groupedLogs = React.useMemo(() => {
		const groups: Record<
			string,
			{ name: string; type: string; logs: TimeLog[]; totalHours: number }
		> = {};

		filteredLogs.forEach((log) => {
			let key: string;
			let name: string;
			let type: string;

			if (log.projectName) {
				key = `project-${log.projectId}`;
				name = log.projectName;
				type = "Project";
			} else if (log.appointmentDate) {
				key = `appointment-${log.appointmentId}`;
				name = `Appointment (${log.appointmentDate})`;
				type = "Appointment";
			} else {
				return;
			}

			if (!groups[key]) {
				groups[key] = { name, type, logs: [], totalHours: 0 };
			}

			groups[key].logs.push(log);
			groups[key].totalHours += log.hoursWorked;
		});

		return Object.values(groups).sort((a, b) => b.totalHours - a.totalHours);
	}, [filteredLogs]);

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
					<h1 className="text-3xl font-bold text-gray-900">My Time Logs</h1>
					<p className="text-gray-600 mt-1">
						Track your work hours and contributions
					</p>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">Total Hours</p>
							<p className="text-2xl font-bold text-gray-900 mt-1">
								{totalHours.toFixed(2)}
							</p>
						</div>
						<div className="bg-blue-100 p-3 rounded-full">
							<Clock className="w-6 h-6 text-blue-600" />
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
						<div className="bg-green-100 p-3 rounded-full">
							<BarChart3 className="w-6 h-6 text-green-600" />
						</div>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">
								Project Hours
							</p>
							<p className="text-2xl font-bold text-gray-900 mt-1">
								{projectHours.toFixed(2)}
							</p>
						</div>
						<div className="bg-purple-100 p-3 rounded-full">
							<Briefcase className="w-6 h-6 text-purple-600" />
						</div>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">
								Appointment Hours
							</p>
							<p className="text-2xl font-bold text-gray-900 mt-1">
								{appointmentHours.toFixed(2)}
							</p>
						</div>
						<div className="bg-orange-100 p-3 rounded-full">
							<Calendar className="w-6 h-6 text-orange-600" />
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

			{/* Work Summary by Project/Appointment */}
			{groupedLogs.length > 0 && (
				<div className="bg-white rounded-lg shadow p-6">
					<h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
						<TrendingUp className="w-5 h-5 text-primary" />
						Work Distribution
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{groupedLogs.map((group, index) => (
							<div
								key={index}
								className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors"
							>
								<div className="flex items-start justify-between mb-2">
									<div className="flex-1">
										<p className="font-semibold text-gray-900">{group.name}</p>
										<p className="text-xs text-gray-500">{group.type}</p>
									</div>
									<div className="text-right">
										<p className="text-2xl font-bold text-primary">
											{group.totalHours.toFixed(1)}
										</p>
										<p className="text-xs text-gray-500">hours</p>
									</div>
								</div>
								<div className="text-sm text-gray-600">
									{group.logs.length} log{group.logs.length !== 1 ? "s" : ""}
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Time Logs Table */}
			<div className="bg-white rounded-lg shadow overflow-hidden">
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
									Logged At
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{filteredLogs.length === 0 ? (
								<tr>
									<td
										colSpan={6}
										className="px-6 py-12 text-center text-gray-500"
									>
										<Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
										<p className="text-lg font-medium">No time logs found</p>
										<p className="text-sm mt-1">
											{hasActiveFilters
												? "Try adjusting your filters"
												: "Your time logs will appear here once you start logging work"}
										</p>
									</td>
								</tr>
							) : (
								filteredLogs.map((log) => (
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
											<div className="text-sm text-gray-500">
												{formatDateTime(log.loggedAt)}
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
