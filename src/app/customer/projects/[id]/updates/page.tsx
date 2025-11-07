"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, MessageSquare, DollarSign, Clock, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { projectService, type ProjectUpdate } from '@/lib/services/projectService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const getUpdateTypeIcon = (type: string) => {
	switch (type) {
		case 'PROGRESS':
			return <CheckCircle className="h-5 w-5 text-blue-600" />;
		case 'COST_CHANGE':
			return <DollarSign className="h-5 w-5 text-yellow-600" />;
		case 'DELAY':
			return <AlertTriangle className="h-5 w-5 text-orange-600" />;
		case 'COMPLETION':
			return <CheckCircle className="h-5 w-5 text-green-600" />;
		default:
			return <MessageSquare className="h-5 w-5 text-gray-600" />;
	}
};

const getUpdateTypeBadge = (type: string) => {
	const styles: Record<string, string> = {
		PROGRESS: 'bg-blue-100 text-blue-800 border-blue-300',
		COST_CHANGE: 'bg-yellow-100 text-yellow-800 border-yellow-300',
		DELAY: 'bg-orange-100 text-orange-800 border-orange-300',
		COMPLETION: 'bg-green-100 text-green-800 border-green-300',
		GENERAL: 'bg-gray-100 text-gray-800 border-gray-300',
	};
	
	return styles[type] || styles.GENERAL;
};

export default function CustomerProjectUpdatesPage() {
	const params = useParams();
	const router = useRouter();
	const projectId = parseInt(params.id as string);
	
	const [project, setProject] = useState<any>(null);
	const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		loadProjectAndUpdates();
	}, [projectId]);

	const loadProjectAndUpdates = async () => {
		try {
			setLoading(true);
			setError(null);
			
			const [projectsData, updatesData] = await Promise.all([
				projectService.getAllProjectsForCurrentCustomer(),
				projectService.getProjectUpdates(projectId),
			]);

			const projectData = projectsData.find(p => p.id === projectId);

			if (!projectData) {
				throw new Error('Project not found');
			}

			setProject(projectData);
			setUpdates(updatesData);
		} catch (err) {
			console.error('Failed to load project updates:', err);
			setError(err instanceof Error ? err.message : 'Failed to load updates');
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
					<p className="text-gray-600">Loading project updates...</p>
				</div>
			</div>
		);
	}

	if (error || !project) {
		return (
			<div className="min-h-screen p-6">
				<div className="max-w-4xl mx-auto">
					<Button
						onClick={() => router.back()}
						variant="outline"
						className="mb-4"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back
					</Button>
					<Card>
						<CardContent className="p-12 text-center">
							<AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
							<h2 className="text-2xl font-semibold text-gray-900 mb-2">Error</h2>
							<p className="text-gray-600">{error || 'Project not found'}</p>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	// Calculate overall progress if available
	const latestProgressUpdate = updates
		.filter(u => u.completedTasks !== null && u.totalTasks !== null)
		.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

	const progressPercentage = latestProgressUpdate
		? Math.round((latestProgressUpdate.completedTasks! / latestProgressUpdate.totalTasks!) * 100)
		: 0;

	// Calculate total additional costs
	const totalAdditionalCost = updates
		.filter(u => u.additionalCost)
		.reduce((sum, u) => sum + (u.additionalCost || 0), 0);

	return (
		<div className="min-h-screen p-6">
			<div className="max-w-4xl mx-auto space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<Button
						onClick={() => router.push('/customer/projects')}
						variant="outline"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Projects
					</Button>
				</div>

				{/* Project Info Card */}
				<Card className="border-primary/20 shadow-lg">
					<CardHeader className="bg-gradient-to-r from-primary to-secondary text-white">
						<CardTitle className="text-2xl">{project.name}</CardTitle>
						<p className="text-white/90">{project.description}</p>
					</CardHeader>
					<CardContent className="p-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-3">
								<div>
									<p className="text-sm text-gray-500">Start Date</p>
									<p className="font-medium">
										{project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not set'}
									</p>
								</div>
								<div>
									<p className="text-sm text-gray-500">End Date</p>
									<p className="font-medium">
										{project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Not set'}
									</p>
								</div>
							</div>
							
							{latestProgressUpdate && (
								<div className="space-y-3">
									<div>
										<p className="text-sm text-gray-500 mb-2">Overall Progress</p>
										<Progress value={progressPercentage} className="h-3" />
										<p className="text-sm font-medium mt-1">
											{latestProgressUpdate.completedTasks}/{latestProgressUpdate.totalTasks} tasks ({progressPercentage}%)
										</p>
									</div>
									{totalAdditionalCost > 0 && (
										<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
											<p className="text-sm font-medium text-yellow-800">
												Total Additional Cost: LKR {totalAdditionalCost.toLocaleString()}
											</p>
										</div>
									)}
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Updates Timeline */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<MessageSquare className="h-5 w-5" />
							Project Updates
						</CardTitle>
						<p className="text-sm text-gray-600">
							{updates.length} {updates.length === 1 ? 'update' : 'updates'} from your service team
						</p>
					</CardHeader>
					<CardContent>
						{updates.length === 0 ? (
							<div className="text-center py-12">
								<FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
								<p className="text-gray-600">No updates posted yet</p>
								<p className="text-sm text-gray-500 mt-2">
									The service team will post updates about your project progress here
								</p>
							</div>
						) : (
							<div className="space-y-6">
								{updates.map((update, index) => (
									<div
										key={update.id}
										className={`border-l-4 pl-6 py-4 relative ${
											index === 0 ? 'border-primary' : 'border-primary/30'
										}`}
									>
										{/* Timeline dot */}
										<div className={`absolute left-0 top-4 w-4 h-4 rounded-full -translate-x-[10px] ${
											index === 0 ? 'bg-primary' : 'bg-primary/50'
										}`}></div>

										{/* Latest badge */}
										{index === 0 && (
											<Badge className="absolute -top-2 left-4 bg-primary text-white">
												Latest Update
											</Badge>
										)}

										{/* Update Header */}
										<div className="flex items-start justify-between mb-3">
											<div className="flex items-center gap-3">
												{getUpdateTypeIcon(update.updateType)}
												<div>
													<Badge className={`${getUpdateTypeBadge(update.updateType)} border`}>
														{update.updateType.replace('_', ' ')}
													</Badge>
													<p className="text-xs text-gray-500 mt-1">
														By {update.employeeName} • {new Date(update.createdAt).toLocaleString()}
													</p>
												</div>
											</div>
										</div>

										{/* Update Content */}
										<div className="space-y-3 bg-gray-50 p-4 rounded-lg">
											<p className="text-gray-700 whitespace-pre-wrap">{update.message}</p>

											{/* Progress Info */}
											{update.completedTasks !== null && update.completedTasks !== undefined && 
											 update.totalTasks !== null && update.totalTasks !== undefined && (
												<div className="flex items-center gap-2 text-sm bg-white p-3 rounded border border-gray-200">
													<CheckCircle className="h-4 w-4 text-green-600" />
													<span className="font-medium">
														Progress: {update.completedTasks}/{update.totalTasks} tasks completed
													</span>
													<span className="text-gray-500">
														({Math.round((update.completedTasks / update.totalTasks) * 100)}%)
													</span>
												</div>
											)}

											{/* Cost Change Info */}
											{update.additionalCost && (
												<div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
													<div className="flex items-center gap-2 text-sm font-medium text-yellow-800 mb-2">
														<DollarSign className="h-5 w-5" />
														Additional Cost: LKR {update.additionalCost.toLocaleString()}
													</div>
													{update.additionalCostReason && (
														<p className="text-sm text-yellow-700">
															<strong>Reason:</strong> {update.additionalCostReason}
														</p>
													)}
												</div>
											)}

											{/* Completion Date */}
											{update.estimatedCompletionDate && (
												<div className="flex items-center gap-2 text-sm text-gray-700 bg-white p-3 rounded border border-gray-200">
													<Clock className="h-4 w-4" />
													<span>
														<strong>
															{update.updateType === 'DELAY' ? 'New' : ''} Estimated Completion:
														</strong>{' '}
														{new Date(update.estimatedCompletionDate).toLocaleDateString()}
													</span>
												</div>
											)}
										</div>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
