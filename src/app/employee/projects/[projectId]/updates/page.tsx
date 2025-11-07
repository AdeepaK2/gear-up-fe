"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, MessageSquare, DollarSign, Clock, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { projectService, type Project, type ProjectUpdate } from '@/lib/services/projectService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

export default function ProjectUpdatesPage() {
	const params = useParams();
	const router = useRouter();
	const projectId = parseInt(params.projectId as string);
	
	const [project, setProject] = useState<Project | null>(null);
	const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		console.log('🔍 Loading updates for projectId:', projectId);
		console.log('📋 Params:', params);
		if (isNaN(projectId)) {
			console.error('❌ Invalid projectId:', params.projectId);
			setError('Invalid project ID');
			setLoading(false);
			return;
		}
		loadProjectAndUpdates();
	}, [projectId]);

	const loadProjectAndUpdates = async () => {
		try {
			setLoading(true);
			setError(null);
			
			console.log('📡 Fetching project and updates for ID:', projectId);
			
			const [projectData, updatesData] = await Promise.all([
				projectService.getEmployeeProjects().then(projects => {
					console.log('📦 All projects:', projects.length);
					return projects.find(p => p.id === projectId);
				}),
				projectService.getProjectUpdates(projectId).then(updates => {
					console.log('✅ Updates received:', updates.length, updates);
					return updates;
				}),
			]);

			console.log('🎯 Project found:', projectData?.name);

			if (!projectData) {
				throw new Error('Project not found');
			}

			setProject(projectData);
			setUpdates(updatesData);
			console.log('✨ State updated - Project:', projectData.name, 'Updates:', updatesData.length);
		} catch (err) {
			console.error('❌ Failed to load project updates:', err);
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

	return (
		<div className="min-h-screen p-6">
			<div className="max-w-4xl mx-auto space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<Button
						onClick={() => router.back()}
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
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div>
								<p className="text-sm text-gray-500">Customer</p>
								<p className="font-medium">{project.customerName || `Customer #${project.customerId}`}</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Vehicle</p>
								<p className="font-medium">{project.vehicleName || 'N/A'}</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Due Date</p>
								<p className="font-medium">
									{project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'N/A'}
								</p>
							</div>
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
							{updates.length} {updates.length === 1 ? 'update' : 'updates'}
						</p>
					</CardHeader>
					<CardContent>
						{updates.length === 0 ? (
							<div className="text-center py-12">
								<FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
								<p className="text-gray-600">No updates posted yet</p>
								<p className="text-sm text-gray-500 mt-2">
									The main representative will post updates about project progress here
								</p>
							</div>
						) : (
							<div className="space-y-6">
								{updates.map((update) => (
									<div
										key={update.id}
										className="border-l-4 border-primary/30 pl-6 py-4 relative"
									>
										{/* Timeline dot */}
										<div className="absolute left-0 top-4 w-4 h-4 bg-primary rounded-full -translate-x-[10px]"></div>

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
										<div className="space-y-3">
											<p className="text-gray-700 whitespace-pre-wrap">{update.message}</p>

											{/* Progress Info */}
											{update.completedTasks !== null && update.completedTasks !== undefined && 
											 update.totalTasks !== null && update.totalTasks !== undefined && update.totalTasks > 0 && (
												<div className="flex items-center gap-2 text-sm">
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
												<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
													<div className="flex items-center gap-2 text-sm font-medium text-yellow-800 mb-1">
														<DollarSign className="h-4 w-4" />
														Additional Cost: LKR {update.additionalCost.toLocaleString()}
													</div>
													{update.additionalCostReason && (
														<p className="text-sm text-yellow-700 ml-6">
															{update.additionalCostReason}
														</p>
													)}
												</div>
											)}

											{/* Completion Date */}
											{update.estimatedCompletionDate && (
												<div className="flex items-center gap-2 text-sm text-gray-600">
													<Clock className="h-4 w-4" />
													<span>
														{update.updateType === 'DELAY' ? 'New' : ''} Estimated Completion:{' '}
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
