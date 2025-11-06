"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Loader2, RefreshCw, Users, Crown, Filter, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { projectService, type Project } from '@/lib/services/projectService';
import { Button } from '@/components/ui/button';

type StatusFilter = "all" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

const getStatusBadgeStyle = (status: string) => {
	const normalizedStatus = status.toUpperCase().replace(/\s+/g, "_");
	switch (normalizedStatus) {
		case "CREATED":
		case "NEW":
			return "bg-yellow-50 text-yellow-800 border-yellow-300";
		case "RECOMMENDED":
		case "CONFIRMED":
			return "bg-blue-50 text-blue-800 border-blue-300";
		case "IN_PROGRESS":
		case "IN PROGRESS":
			return "bg-blue-100 text-blue-900 border-blue-400 font-semibold";
		case "ON_HOLD":
		case "ON HOLD":
			return "bg-orange-100 text-orange-800 border-orange-300";
		case "COMPLETED":
			return "bg-green-100 text-green-900 border-green-400 font-semibold";
		case "CANCELLED":
		case "REJECTED":
			return "bg-red-100 text-red-900 border-red-400 font-semibold";
		default:
			return "bg-gray-50 text-gray-800 border-gray-300";
	}
};

const getStatusDisplayName = (status: string) => {
	const normalizedStatus = status.toUpperCase().replace(/\s+/g, "_");
	switch (normalizedStatus) {
		case "CREATED":
			return "Created";
		case "RECOMMENDED":
			return "Recommended";
		case "CONFIRMED":
			return "Confirmed";
		case "IN_PROGRESS":
		case "IN PROGRESS":
			return "In Progress";
		case "ON_HOLD":
		case "ON HOLD":
			return "On Hold";
		case "COMPLETED":
			return "Completed";
		case "CANCELLED":
		case "REJECTED":
			return "Cancelled";
		default:
			return status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
	}
};

export default function EmployeeProjects() {
	const router = useRouter();
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

	// Load projects on component mount
	useEffect(() => {
		loadProjects();
	}, []);

	const loadProjects = async () => {
		try {
			setLoading(true);
			setError(null);
			const projectsData = await projectService.getEmployeeProjects();
			setProjects(projectsData);
		} catch (err) {
			console.error('Failed to load projects:', err);
			setError(err instanceof Error ? err.message : 'Failed to load projects');
		} finally {
			setLoading(false);
		}
	};

	const handleMarkAsCompleted = async (projectId: number) => {
		try {
			const updatedProject = await projectService.updateProjectStatus(projectId, "COMPLETED");
			setProjects(prev => prev.map(p => p.id === projectId ? updatedProject : p));
		} catch (err) {
			console.error('Failed to update project status:', err);
			setError(err instanceof Error ? err.message : 'Failed to update status');
		}
	};

	const isInProgress = (status: string): boolean => {
		const normalizedStatus = status.toUpperCase().replace(/\s+/g, "_");
		return normalizedStatus === "IN_PROGRESS";
	};

	const isCompleted = (status: string): boolean => {
		const normalizedStatus = status.toUpperCase().replace(/\s+/g, "_");
		return normalizedStatus === "COMPLETED";
	};

	const handleSendReport = (projectId: number) => {
		router.push(`/employee/projects/${projectId}/report`);
	};

	const filteredProjects = useMemo(() => {
		if (statusFilter === "all") {
			return projects;
		}
		return projects.filter(project => {
			const normalizedStatus = project.status.toUpperCase().replace(/\s+/g, "_");
			return normalizedStatus === statusFilter;
		});
	}, [projects, statusFilter]);

	const filterOptions: { value: StatusFilter; label: string; count: number }[] = [
		{ value: "all", label: "All Projects", count: projects.length },
		{ value: "IN_PROGRESS", label: "In Progress", count: projects.filter(p => p.status.toUpperCase().replace(/\s+/g, "_") === "IN_PROGRESS").length },
		{ value: "COMPLETED", label: "Completed", count: projects.filter(p => p.status.toUpperCase().replace(/\s+/g, "_") === "COMPLETED").length },
		{ value: "CANCELLED", label: "Cancelled", count: projects.filter(p => p.status.toUpperCase().replace(/\s+/g, "_") === "CANCELLED").length },
	];

	return (
		<div className="min-h-screen space-y-8 p-6">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-3xl font-bold text-primary">Assigned Projects</h1>
				<div className="flex items-center gap-2">
					<Filter className="w-5 h-5 text-gray-600" />
					<select
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
						className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
					>
						{filterOptions.map(option => (
							<option key={option.value} value={option.value}>
								{option.label} ({option.count})
							</option>
						))}
					</select>
				</div>
			</div>
			<div className="bg-white rounded-xl border overflow-x-auto">
				<table className="min-w-full text-sm">
					<thead>
						<tr className="border-b">
							<th className="px-4 py-3 text-left font-bold">Title</th>
							<th className="px-4 py-3 text-left font-bold">Customer</th>
							<th className="px-4 py-3 text-left font-bold">Vehicle</th>
							<th className="px-4 py-3 text-left font-bold">Due Date</th>
							<th className="px-4 py-3 text-left font-bold">Assigned Employees</th>
							<th className="px-4 py-3 text-left font-bold">Status</th>
							<th className="px-4 py-3 text-left font-bold">Actions</th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr>
								<td colSpan={7} className="px-4 py-8 text-center">
									<Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
									Loading projects...
								</td>
							</tr>
						) : error ? (
							<tr>
								<td colSpan={7} className="px-4 py-8 text-center text-red-600">
									Error: {error}
									<Button 
										onClick={loadProjects} 
										className="ml-4 px-3 py-1 text-sm"
									>
										<RefreshCw className="h-4 w-4 mr-1" />
										Retry
									</Button>
								</td>
							</tr>
						) : filteredProjects.length === 0 ? (
							<tr>
								<td colSpan={7} className="px-4 py-8 text-center text-gray-500">
									{projects.length === 0 ? "No projects assigned" : `No ${statusFilter === "all" ? "" : filterOptions.find(o => o.value === statusFilter)?.label.toLowerCase() + " "}projects found`}
								</td>
							</tr>
						) : (
							filteredProjects.map((project) => (
								<tr key={project.id} className="border-b last:border-0 hover:bg-blue-50 transition-colors duration-200 cursor-pointer">
									<td className="px-4 py-3">
										<div className="flex items-center gap-2">
											{project.name}
											{project.isMainRepresentative && (
												<span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-full">
													<Crown className="w-3 h-3" />
													Main Rep
												</span>
											)}
										</div>
									</td>
									<td className="px-4 py-3">{project.customerName || `Customer #${project.customerId || 'N/A'}`}</td>
									<td className="px-4 py-3">{project.vehicleName || 'N/A'}</td>
									<td className="px-4 py-3">{project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'N/A'}</td>
									<td className="px-4 py-3">
										{project.assignedEmployees && project.assignedEmployees.length > 0 ? (
											<div className="flex flex-col gap-1">
												{project.assignedEmployees.map((emp) => (
													<div key={emp.employeeId} className="flex items-center gap-2 text-xs">
														<Users className="w-3 h-3 text-gray-500" />
														<span className={emp.employeeId === project.mainRepresentativeEmployeeId ? "font-semibold text-yellow-700" : ""}>
															{emp.name}
															{emp.employeeId === project.mainRepresentativeEmployeeId && (
																<Crown className="w-3 h-3 inline ml-1 text-yellow-600" />
															)}
														</span>
														<span className="text-gray-500">({emp.specialization})</span>
													</div>
												))}
											</div>
										) : (
											<span className="text-gray-400">No employees assigned</span>
										)}
									</td>
									<td className="px-4 py-3">
										<span
											className={`inline-block rounded-full px-4 py-1.5 text-xs font-semibold border text-center min-w-[100px] ${getStatusBadgeStyle(project.status)}`}
										>
											{getStatusDisplayName(project.status)}
										</span>
									</td>
									<td className="px-4 py-3">
										<div className="flex items-center gap-2">
											{isInProgress(project.status) && (
												<Button
													type="button"
													onClick={() => handleMarkAsCompleted(project.id)}
													className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
												>
													Mark as Completed
												</Button>
											)}
											{isCompleted(project.status) && (
												<Button
													type="button"
													onClick={() => handleSendReport(project.id)}
													className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
												>
													<FileText className="w-4 h-4" />
													Send Report
												</Button>
											)}
										</div>
									</td>
							</tr>
						))
						)}
					</tbody>
				</table>
			</div>

		</div>
	);
}

