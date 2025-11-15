"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Loader2, RefreshCw, Users, Crown, Filter, FileText, MessageSquarePlus, MessageSquare, CheckCircle2, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { projectService, type Project, type TaskCompletion } from '@/lib/services/projectService';
import { type Task } from '@/lib/services/taskService';
import { timeLogService, type CreateTimeLogDTO } from '@/lib/services/timeLogService';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/contexts/ToastContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import ProjectTimeLogSummaryCard from '@/components/admin/ProjectTimeLogSummary';

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
	const { showToast } = useToast();
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
	
	// Update dialog state
	const [showUpdateDialog, setShowUpdateDialog] = useState(false);
	const [selectedProject, setSelectedProject] = useState<Project | null>(null);
	const [projectTasks, setProjectTasks] = useState<Task[]>([]);
	const [taskCompletions, setTaskCompletions] = useState<Record<number, TaskCompletion>>({});
	const [loadingTasks, setLoadingTasks] = useState(false);
	const [updateFormData, setUpdateFormData] = useState({
		message: '',
		completedTasks: '',
		totalTasks: '',
		additionalCost: '',
		additionalCostReason: '',
		estimatedCompletionDate: '',
		updateType: 'PROGRESS' as 'PROGRESS' | 'COST_CHANGE' | 'DELAY' | 'COMPLETION' | 'GENERAL',
	});
	const [submittingUpdate, setSubmittingUpdate] = useState(false);

	// Completion dialog state
	const [showCompletionDialog, setShowCompletionDialog] = useState(false);
	const [completionMessage, setCompletionMessage] = useState('');
	const [projectToComplete, setProjectToComplete] = useState<Project | null>(null);
	const [submittingCompletion, setSubmittingCompletion] = useState(false);

	// Log work dialog state
	const [showLogWorkDialog, setShowLogWorkDialog] = useState(false);
	const [selectedProjectForLog, setSelectedProjectForLog] = useState<Project | null>(null);
	const [projectTasksForLog, setProjectTasksForLog] = useState<Task[]>([]);
	const [logWorkData, setLogWorkData] = useState({
		description: '',
		startTime: '',
		endTime: '',
		taskId: '',
	});
	const [submittingLogWork, setSubmittingLogWork] = useState(false);

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

	const handleMarkAsCompleted = async (project: Project) => {
		setProjectToComplete(project);
		setCompletionMessage('');
		setShowCompletionDialog(true);
	};

	const handleConfirmCompletion = async () => {
		if (!projectToComplete || !completionMessage.trim()) {
			showToast('Please provide a completion message for the customer', 'error');
			return;
		}

		setSubmittingCompletion(true);
		try {
			// First, post a completion update with the message
			await projectService.createProjectUpdate(projectToComplete.id, {
				message: completionMessage,
				updateType: 'COMPLETION',
				estimatedCompletionDate: new Date().toISOString().split('T')[0],
				taskCompletions: [],
				completedTasks: 0,
				totalTasks: 0,
				overallCompletionPercentage: 100,
			});

			// Then update the project status to COMPLETED
			const updatedProject = await projectService.updateProjectStatus(projectToComplete.id, "COMPLETED");
			setProjects(prev => prev.map(p => p.id === projectToComplete.id ? updatedProject : p));
			
			showToast('Project marked as completed and customer notified', 'success');
			setShowCompletionDialog(false);
			setProjectToComplete(null);
			setCompletionMessage('');
		} catch (err) {
			console.error('Failed to complete project:', err);
			showToast(err instanceof Error ? err.message : 'Failed to complete project', 'error');
		} finally {
			setSubmittingCompletion(false);
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

	const handlePostUpdate = async (project: Project) => {
		setSelectedProject(project);
		setUpdateFormData({
			message: '',
			completedTasks: '',
			totalTasks: '',
			additionalCost: '',
			additionalCostReason: '',
			estimatedCompletionDate: '',
			updateType: 'PROGRESS',
		});
		
		// Load tasks for the project
		setLoadingTasks(true);
		try {
			const tasks = await projectService.getProjectTasks(project.id);
			console.log('📋 Loaded tasks:', tasks);
			setProjectTasks(tasks);
			
			// Initialize task completions
			const initialCompletions: Record<number, TaskCompletion> = {};
			tasks.forEach((task, index) => {
				const taskId = task.taskId ?? index;
				console.log(`🔧 Initializing task ${taskId}: ${task.name}`);
				initialCompletions[taskId] = {
					taskId: taskId,
					taskName: task.name,
					isCompleted: task.status === 'COMPLETED',
					completionPercentage: task.status === 'COMPLETED' ? 100 : 0,
				};
			});
			console.log('✅ Initial completions:', initialCompletions);
			setTaskCompletions(initialCompletions);
		} catch (err) {
			console.error('Failed to load tasks:', err);
			showToast('Failed to load project tasks', 'error');
		} finally {
			setLoadingTasks(false);
		}
		
		setShowUpdateDialog(true);
	};

	const handleViewUpdates = (projectId: number) => {
		router.push(`/employee/projects/${projectId}/updates`);
	};

	const handleLogWork = async (project: Project) => {
		setSelectedProjectForLog(project);
		setLogWorkData({
			description: '',
			startTime: '',
			endTime: '',
			taskId: '',
		});

		// Load tasks for the project
		setLoadingTasks(true);
		try {
			const tasks = await projectService.getProjectTasks(project.id);
			setProjectTasksForLog(tasks);
		} catch (err) {
			console.error('Failed to load tasks:', err);
			showToast('Failed to load project tasks', 'error');
		} finally {
			setLoadingTasks(false);
		}

		setShowLogWorkDialog(true);
	};

	const handleSubmitLogWork = async () => {
		if (!selectedProjectForLog || !logWorkData.description.trim() || !logWorkData.startTime || !logWorkData.endTime || !logWorkData.taskId) {
			showToast('Please fill all required fields', 'error');
			return;
		}

		// Validate that end time is after start time
		const start = new Date(logWorkData.startTime);
		const end = new Date(logWorkData.endTime);
		if (end <= start) {
			showToast('End time must be after start time', 'error');
			return;
		}

		setSubmittingLogWork(true);
		try {
			const timeLogDTO: CreateTimeLogDTO = {
				description: logWorkData.description,
				startTime: logWorkData.startTime,
				endTime: logWorkData.endTime,
				taskId: parseInt(logWorkData.taskId),
				projectId: selectedProjectForLog.id,
			};

			await timeLogService.createTimeLog(timeLogDTO);
			showToast('Work logged successfully', 'success');
			setShowLogWorkDialog(false);
			setSelectedProjectForLog(null);
			setProjectTasksForLog([]);
			setLogWorkData({
				description: '',
				startTime: '',
				endTime: '',
				taskId: '',
			});
		} catch (err) {
			console.error('Failed to log work:', err);
			showToast(err instanceof Error ? err.message : 'Failed to log work', 'error');
		} finally {
			setSubmittingLogWork(false);
		}
	};

	const handleSubmitUpdate = async () => {
		if (!selectedProject || !updateFormData.message.trim()) {
			showToast('Please provide a message for the update', 'error');
			return;
		}

		setSubmittingUpdate(true);
		try {
			// Calculate overall completion percentage
			const completions = Object.values(taskCompletions);
			const overallPercentage = completions.length > 0
				? Math.round(completions.reduce((sum, t) => sum + t.completionPercentage, 0) / completions.length)
				: 0;

			const completedCount = completions.filter(t => t.isCompleted).length;

			await projectService.createProjectUpdate(selectedProject.id, {
				message: updateFormData.message,
				completedTasks: completedCount,
				totalTasks: completions.length,
				additionalCost: updateFormData.additionalCost ? parseFloat(updateFormData.additionalCost) : undefined,
				additionalCostReason: updateFormData.additionalCostReason || undefined,
				estimatedCompletionDate: updateFormData.estimatedCompletionDate || undefined,
				updateType: updateFormData.updateType,
				taskCompletions: completions,
				overallCompletionPercentage: overallPercentage,
			});

			showToast('Project update posted successfully', 'success');
			setShowUpdateDialog(false);
			setSelectedProject(null);
			setProjectTasks([]);
			setTaskCompletions({});
		} catch (err) {
			console.error('Failed to post update:', err);
			showToast(err instanceof Error ? err.message : 'Failed to post update', 'error');
		} finally {
			setSubmittingUpdate(false);
		}
	};

	const handleTaskCompletionToggle = (taskId: number) => {
		setTaskCompletions(prev => ({
			...prev,
			[taskId]: {
				...prev[taskId],
				isCompleted: !prev[taskId].isCompleted,
				completionPercentage: !prev[taskId].isCompleted ? 100 : prev[taskId].completionPercentage,
			},
		}));
	};

	const handleTaskPercentageChange = (taskId: number, percentage: number) => {
		console.log(`🎚️ Slider changed - TaskID: ${taskId}, New percentage: ${percentage}`);
		setTaskCompletions(prev => {
			console.log('📊 Previous state:', prev);
			const newState = {
				...prev,
				[taskId]: {
					...prev[taskId],
					completionPercentage: percentage,
					isCompleted: percentage === 100,
				},
			};
			console.log('📊 New state:', newState);
			return newState;
		});
	};

	const calculateOverallProgress = () => {
		const completions = Object.values(taskCompletions);
		if (completions.length === 0) return 0;
		const total = completions.reduce((sum, t) => sum + t.completionPercentage, 0);
		return Math.round(total / completions.length);
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
												<>
													<Button
														type="button"
														onClick={() => handleLogWork(project)}
														className="px-3 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
													>
														<Clock className="w-4 h-4" />
														Log Work
													</Button>
													{project.isMainRepresentative && (
														<Button
															type="button"
															onClick={() => handlePostUpdate(project)}
															className="px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
														>
															<MessageSquarePlus className="w-4 h-4" />
															Post Update
														</Button>
													)}
													<Button
														type="button"
														onClick={() => handleMarkAsCompleted(project)}
														className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
													>
														Mark as Completed
													</Button>
													<Button
														type="button"
														onClick={() => handleViewUpdates(project.id)}
														className="px-3 py-2 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
													>
														<MessageSquare className="w-4 h-4" />
														View Updates
													</Button>
												</>
											)}
											{isCompleted(project.status) && (
												<>
													<Button
														type="button"
														onClick={() => handleSendReport(project.id)}
														className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
													>
														<FileText className="w-4 h-4" />
														Send Report
													</Button>
													<Button
														type="button"
														onClick={() => handleViewUpdates(project.id)}
														className="px-3 py-2 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
													>
														<MessageSquare className="w-4 h-4" />
														View Updates
													</Button>
												</>
											)}
										</div>
									</td>
							</tr>
						))
						)}
					</tbody>
				</table>
			</div>

			{/* Post Update Dialog */}
			<Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="text-2xl font-bold">Post Project Update</DialogTitle>
						<DialogDescription>
							Send an update to the customer about project progress, costs, or any changes.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="updateType">Update Type *</Label>
							<Select
								value={updateFormData.updateType}
								onValueChange={(value: any) => setUpdateFormData({ ...updateFormData, updateType: value })}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select update type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="PROGRESS">Progress Update</SelectItem>
									<SelectItem value="COST_CHANGE">Cost Change</SelectItem>
									<SelectItem value="DELAY">Delay Notice</SelectItem>
									<SelectItem value="COMPLETION">Completion Notice</SelectItem>
									<SelectItem value="GENERAL">General Update</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Services/Tasks Section */}
						{loadingTasks ? (
							<div className="flex items-center justify-center py-8">
								<Loader2 className="h-6 w-6 animate-spin text-primary" />
								<span className="ml-2 text-gray-600">Loading services...</span>
							</div>
						) : projectTasks.length > 0 && (
							<div className="space-y-3 border rounded-lg p-4 bg-gray-50">
								<div className="flex items-center justify-between mb-3">
									<Label className="text-base font-semibold">Services/Tasks Progress</Label>
									<div className="text-sm font-medium text-primary">
										Overall: {calculateOverallProgress()}%
									</div>
								</div>
								<div className="space-y-4 max-h-[300px] overflow-y-auto">
									{projectTasks.map((task, index) => {
										console.log(`🔍 Task data:`, task);
										const taskId = task.taskId ?? index;
										const completion = taskCompletions[taskId];
										if (!completion) {
											console.warn(`⚠️ No completion found for taskId: ${taskId}`, task);
											return null;
										}
										
										console.log(`🔍 Rendering task ${taskId}: ${task.name}, completion: ${completion.completionPercentage}%`);
										
										return (
											<div key={`task-${taskId}`} className="bg-white p-3 rounded-lg border space-y-2">
												<div className="flex items-start gap-3">
													<Checkbox
														checked={completion.isCompleted}
														onCheckedChange={() => handleTaskCompletionToggle(taskId)}
														className="mt-1"
													/>
													<div className="flex-1">
														<div className="font-medium text-sm">{task.name}</div>
														<div className="text-xs text-gray-500 line-clamp-1">{task.description}</div>
													</div>
													<div className="text-sm font-semibold text-primary">
														{completion.completionPercentage}%
													</div>
												</div>
											<div className="ml-7 space-y-1">
												<Slider
													id={`task-slider-${taskId}`}
													value={[completion.completionPercentage]}
													onValueChange={(value: number[]) => handleTaskPercentageChange(taskId, value[0])}
													max={100}
													step={5}
													className="w-full"
												/>
													<div className="flex justify-between text-xs text-gray-500">
														<span>0%</span>
														<span>50%</span>
														<span>100%</span>
													</div>
												</div>
											</div>
										);
									})}
								</div>
								<div className="pt-2 border-t">
									<div className="text-sm text-gray-600">
										<CheckCircle2 className="inline h-4 w-4 mr-1 text-green-600" />
										{Object.values(taskCompletions).filter(t => t.isCompleted).length} of {projectTasks.length} completed
									</div>
								</div>
							</div>
						)}

						<div className="space-y-2">
							<Label htmlFor="message">Message *</Label>
							<Textarea
								id="message"
								placeholder="Describe the update for the customer..."
								value={updateFormData.message}
								onChange={(e) => setUpdateFormData({ ...updateFormData, message: e.target.value })}
								rows={5}
								className="resize-none"
								required
							/>
							<p className="text-xs text-gray-500">
								{updateFormData.message.length}/2000 characters
							</p>
						</div>

						{updateFormData.updateType === 'COST_CHANGE' && (
							<>
								<div className="space-y-2">
									<Label htmlFor="additionalCost">Additional Cost (LKR)</Label>
									<Input
										id="additionalCost"
										type="number"
										step="0.01"
										placeholder="e.g., 5000.00"
										value={updateFormData.additionalCost}
										onChange={(e) => setUpdateFormData({ ...updateFormData, additionalCost: e.target.value })}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="additionalCostReason">Reason for Additional Cost</Label>
									<Textarea
										id="additionalCostReason"
										placeholder="Explain why additional costs are needed..."
										value={updateFormData.additionalCostReason}
										onChange={(e) => setUpdateFormData({ ...updateFormData, additionalCostReason: e.target.value })}
										rows={3}
										className="resize-none"
									/>
								</div>
							</>
						)}

						{(updateFormData.updateType === 'DELAY' || updateFormData.updateType === 'COMPLETION') && (
							<div className="space-y-2">
								<Label htmlFor="estimatedCompletionDate">
									{updateFormData.updateType === 'DELAY' ? 'New Estimated Completion Date' : 'Completion Date'}
								</Label>
								<Input
									id="estimatedCompletionDate"
									type="date"
									value={updateFormData.estimatedCompletionDate}
									onChange={(e) => setUpdateFormData({ ...updateFormData, estimatedCompletionDate: e.target.value })}
								/>
							</div>
						)}
					</div>

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setShowUpdateDialog(false)}
							disabled={submittingUpdate}
						>
							Cancel
						</Button>
						<Button
							onClick={handleSubmitUpdate}
							disabled={submittingUpdate || !updateFormData.message.trim()}
							className="bg-primary hover:bg-primary/90"
						>
							{submittingUpdate ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Posting...
								</>
							) : (
								'Post Update'
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Mark as Completed Dialog */}
			<Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
				<DialogContent className="max-w-lg">
					<DialogHeader>
						<DialogTitle className="text-2xl font-bold flex items-center gap-2">
							<CheckCircle2 className="h-6 w-6 text-green-600" />
							Complete Project
						</DialogTitle>
						<DialogDescription>
							Send a completion message to the customer and mark this project as completed.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						{projectToComplete && (
							<div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
								<p className="text-sm font-medium text-blue-900">
									Project: {projectToComplete.name}
								</p>
								<p className="text-xs text-blue-700 mt-1">
									Customer: {projectToComplete.customerName || `Customer #${projectToComplete.customerId}`}
								</p>
							</div>
						)}

						<div className="space-y-2">
							<Label htmlFor="completionMessage">Completion Message *</Label>
							<Textarea
								id="completionMessage"
								placeholder="Inform the customer about the project completion, final details, or any important notes..."
								value={completionMessage}
								onChange={(e) => setCompletionMessage(e.target.value)}
								rows={6}
								className="resize-none"
								required
							/>
							<p className="text-xs text-gray-500">
								{completionMessage.length}/1000 characters
							</p>
						</div>

						<div className="bg-green-50 border border-green-200 rounded-lg p-3">
							<p className="text-xs text-green-800">
								<strong>Note:</strong> This message will be sent to the customer as a completion update, and the project status will be changed to "Completed".
							</p>
						</div>
					</div>

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setShowCompletionDialog(false)}
							disabled={submittingCompletion}
						>
							Cancel
						</Button>
						<Button
							onClick={handleConfirmCompletion}
							disabled={submittingCompletion || !completionMessage.trim()}
							className="bg-green-600 hover:bg-green-700"
						>
							{submittingCompletion ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Completing...
								</>
							) : (
								<>
									<CheckCircle2 className="mr-2 h-4 w-4" />
									Mark as Completed
								</>
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Log Work Dialog */}
			<Dialog open={showLogWorkDialog} onOpenChange={setShowLogWorkDialog}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="text-2xl font-bold flex items-center gap-2">
							<Clock className="h-6 w-6 text-purple-600" />
							Log Work Time
						</DialogTitle>
						<DialogDescription>
							Record the time you spent working on this project
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						{selectedProjectForLog && (
							<>
								<div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
									<p className="text-sm font-medium text-purple-900">
										Project: {selectedProjectForLog.name}
									</p>
									<p className="text-xs text-purple-700 mt-1">
										Customer: {selectedProjectForLog.customerName || `Customer #${selectedProjectForLog.customerId}`}
									</p>
								</div>

								{/* Time Log Summary */}
								<ProjectTimeLogSummaryCard projectId={selectedProjectForLog.id} />
							</>
						)}

						<div className="space-y-2">
							<Label htmlFor="logTaskId">Task/Service *</Label>
							<Select
								value={logWorkData.taskId}
								onValueChange={(value) => setLogWorkData({ ...logWorkData, taskId: value })}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select a task..." />
								</SelectTrigger>
								<SelectContent>
									{loadingTasks ? (
										<div className="flex items-center justify-center py-4">
											<Loader2 className="h-4 w-4 animate-spin" />
										</div>
									) : projectTasksForLog.length === 0 ? (
										<div className="py-4 text-center text-sm text-gray-500">
											No tasks found
										</div>
									) : (
										projectTasksForLog.map((task) => (
											<SelectItem key={task.taskId} value={task.taskId.toString()}>
												{task.name} ({task.estimatedHours}h estimated)
											</SelectItem>
										))
									)}
								</SelectContent>
							</Select>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="startTime">Start Time *</Label>
								<Input
									id="startTime"
									type="datetime-local"
									value={logWorkData.startTime}
									onChange={(e) => setLogWorkData({ ...logWorkData, startTime: e.target.value })}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="endTime">End Time *</Label>
								<Input
									id="endTime"
									type="datetime-local"
									value={logWorkData.endTime}
									onChange={(e) => setLogWorkData({ ...logWorkData, endTime: e.target.value })}
									required
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="logDescription">Work Description *</Label>
							<Textarea
								id="logDescription"
								placeholder="Describe what you worked on..."
								value={logWorkData.description}
								onChange={(e) => setLogWorkData({ ...logWorkData, description: e.target.value })}
								rows={4}
								className="resize-none"
								required
							/>
							<p className="text-xs text-gray-500">
								{logWorkData.description.length}/500 characters
							</p>
						</div>

						<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
							<p className="text-xs text-yellow-800">
								<strong>Note:</strong> The system will validate that your logged time doesn't exceed the total estimated hours for the project.
							</p>
						</div>
					</div>

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setShowLogWorkDialog(false)}
							disabled={submittingLogWork}
						>
							Cancel
						</Button>
						<Button
							onClick={handleSubmitLogWork}
							disabled={submittingLogWork || !logWorkData.description.trim() || !logWorkData.startTime || !logWorkData.endTime || !logWorkData.taskId}
							className="bg-purple-600 hover:bg-purple-700"
						>
							{submittingLogWork ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Logging...
								</>
							) : (
								<>
									<Clock className="mr-2 h-4 w-4" />
									Log Work Time
								</>
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

		</div>
	);
}

