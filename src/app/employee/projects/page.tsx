"use client";
import React, { useState, useEffect } from "react";
import { Edit, ChevronDown, Loader2, RefreshCw } from "lucide-react";
import { projectService, type Project } from '@/lib/services/projectService';
import { Button } from '@/components/ui/button';

const statusOptions = [
	"pending",
	"in_progress", 
	"completed",
	"cancelled",
];

const getStatusBadgeStyle = (status: string) => {
	switch (status.toLowerCase()) {
		case "new":
			return "bg-yellow-50 text-yellow-800 border-yellow-200";
		case "in_progress":
		case "in progress":
			return "bg-blue-50 text-blue-800 border-blue-200";
		case "on hold":
			return "bg-orange-100 text-orange-800 border-orange-200";
		case "completed":
			return "bg-green-50 text-green-800 border-green-200";
		case "cancelled":
			return "bg-red-50 text-red-800 border-red-200";
		default:
			return "bg-gray-50 text-gray-800 border-gray-200";
	}
};

const statusStyles: Record<string, string> = {
	New: "bg-yellow-50 text-yellow-800 border-yellow-200",
	In_Progress: "bg-blue-50 text-blue-800 border-blue-200",
	"On Hold": "bg-orange-100 text-orange-800 border-orange-200",
	Completed: "bg-green-50 text-green-800 border-green-200",
	Cancelled: "bg-red-50 text-red-800 border-red-200",
};

export default function EmployeeProjects() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [editingProject, setEditingProject] = useState<number | null>(null);
	const [newStatus, setNewStatus] = useState<string>('');

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

	const handleStatusUpdate = async (projectId: number, status: string) => {
		try {
			const updatedProject = await projectService.updateProjectStatus(projectId, status);
			setProjects(prev => prev.map(p => p.id === projectId ? updatedProject : p));
			setEditingProject(null);
		} catch (err) {
			console.error('Failed to update project status:', err);
			setError(err instanceof Error ? err.message : 'Failed to update status');
		}
	};

	const startEditing = (projectId: number, currentStatus: string) => {
		setEditingProject(projectId);
		setNewStatus(currentStatus);
	};

	const cancelEditing = () => {
		setEditingProject(null);
		setNewStatus('');
	};

	return (
		<div className="min-h-screen space-y-8 p-6">
			<h1 className="text-3xl font-bold mb-8 text-primary">Assigned Projects</h1>
			<div className="bg-white rounded-xl border overflow-x-auto">
				<table className="min-w-full text-sm">
					<thead>
						<tr className="border-b">
							<th className="px-4 py-3 text-left font-bold">Title</th>
							<th className="px-4 py-3 text-left font-bold">Customer</th>
							<th className="px-4 py-3 text-left font-bold">Vehicle</th>
							<th className="px-4 py-3 text-left font-bold">Due Date</th>
							<th className="px-4 py-3 text-left font-bold">
								Estimated Time
							</th>
							<th className="px-4 py-3 text-left font-bold">Status</th>
							<th className="px-4 py-3 text-left font-bold">Edit</th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr>
								<td colSpan={6} className="px-4 py-8 text-center">
									<Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
									Loading projects...
								</td>
							</tr>
						) : error ? (
							<tr>
								<td colSpan={6} className="px-4 py-8 text-center text-red-600">
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
						) : projects.length === 0 ? (
							<tr>
								<td colSpan={6} className="px-4 py-8 text-center text-gray-500">
									No projects assigned
								</td>
							</tr>
						) : (
							projects.map((project) => (
								<tr key={project.id} className="border-b last:border-0 hover:bg-blue-50 transition-colors duration-200 cursor-pointer">
									<td className="px-4 py-3">{project.name}</td>
									<td className="px-4 py-3">Customer #{project.customerId || 'N/A'}</td>
									<td className="px-4 py-3">{project.vehicleName || 'N/A'}</td>
									<td className="px-4 py-3">{project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'N/A'}</td>
									<td className="px-4 py-3">N/A</td>
									<td className="px-4 py-3">
										{editingProject === project.id ? (
											<div className="flex items-center gap-2">
												<select
													value={newStatus}
													onChange={(e) => setNewStatus(e.target.value)}
													className="px-2 py-1 border rounded text-xs"
												>
													{statusOptions.map(status => (
														<option key={status} value={status}>
															{status.replace('_', ' ').toUpperCase()}
														</option>
													))}
												</select>
												<Button
													onClick={() => handleStatusUpdate(project.id, newStatus)}
													className="px-2 py-1 text-xs bg-green-500 hover:bg-green-600"
												>
													Save
												</Button>
												<Button
													onClick={cancelEditing}
													className="px-2 py-1 text-xs bg-gray-500 hover:bg-gray-600"
												>
													Cancel
												</Button>
											</div>
										) : (
											<span
												className={`inline-block rounded-full px-6 py-1 text-xs font-semibold border w-32 text-center ${
													statusStyles[project.status] ||
													"bg-gray-50 text-gray-800 border-gray-200"
												}`}
											>
												{project.status.replace("_", " ").toUpperCase()}
											</span>
										)}
									</td>
									<td className="px-4 py-3">
										<button
											type="button"
											className="p-2 rounded-lg bg-white border border-blue-200 text-blue-900 hover:bg-blue-100 transition-colors duration-200"
											aria-label="Edit"
											onClick={() => startEditing(project.id, project.status)}
									>
										<Edit className="w-4 h-4" />
									</button>
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

