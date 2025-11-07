'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Calendar,
  CalendarCheck,
  Car,
  FileText,
  Package,
  Clock,
  DollarSign,
  Loader2,
  CheckCircle2,
  AlertCircle,
  User,
} from 'lucide-react';
import { projectService } from '@/lib/services/projectService';
import { taskService, type Task } from '@/lib/services/taskService';
import { useToast } from '@/contexts/ToastContext';

export default function ProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const toast = useToast();
  const projectId = Number(params.id);

  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjectDetails();
  }, [projectId]);

  const loadProjectDetails = async () => {
    try {
      setLoading(true);

      // Fetch project details
      console.log('Fetching project with ID:', projectId);
      const projectData = await projectService.getProjectById(projectId);
      console.log('Project data received:', projectData);
      setProject(projectData);

      // Fetch tasks for this project
      console.log('Project taskIds:', projectData.taskIds);
      if (projectData.taskIds && projectData.taskIds.length > 0) {
        console.log('Fetching tasks...');
        const allTasks = await taskService.getAllTasks();
        console.log('All tasks fetched:', allTasks.length);

        const projectTasks = allTasks.filter(task =>
          projectData.taskIds.includes(task.taskId)
        );
        console.log('Project tasks filtered:', projectTasks.length, projectTasks);
        setTasks(projectTasks);
      } else {
        console.warn('No taskIds found in project data');
      }
    } catch (error: any) {
      console.error('Failed to load project details:', error);
      toast.error(error.message || 'Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'PENDING':
        return 'bg-gray-100 text-gray-800';
      case 'ACCEPTED':
        return 'bg-purple-100 text-purple-800';
      case 'RECOMMENDED':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-gray-600">Loading project details...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-6">
            The project you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button onClick={() => router.push('/customer/projects')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  const totalCost = tasks.reduce((sum, task) => sum + (task.estimatedCost || 0), 0);
  const totalHours = tasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0);

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/customer/projects')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-primary">Project Details</h1>
            <p className="text-gray-600 mt-1">View your project information and services</p>
          </div>
        </div>
        <Badge className={`text-sm font-semibold px-4 py-2 ${getStatusColor(project.status)}`}>
          {project.status || 'PENDING'}
        </Badge>
      </div>

      {/* Project Information Card */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary to-secondary text-white">
          <CardTitle className="flex items-center gap-3">
            <FileText className="h-6 w-6" />
            {project.name || `Project #${project.id}`}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Project Name & Description */}
            <div className="lg:col-span-4">
              <div className="flex items-start gap-2 mb-2">
                <Package className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="font-medium text-gray-900">
                    {project.description || 'No description provided'}
                  </p>
                </div>
              </div>
            </div>

            {/* Start Date */}
            <div className="flex items-start gap-2">
              <Calendar className="h-5 w-5 text-gray-500 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="font-medium text-gray-900">
                  {project.startDate
                    ? new Date(project.startDate).toLocaleDateString()
                    : 'Not set'}
                </p>
              </div>
            </div>

            {/* End Date */}
            <div className="flex items-start gap-2">
              <CalendarCheck className="h-5 w-5 text-gray-500 mt-1" />
              <div>
                <p className="text-sm text-gray-600">End Date</p>
                <p className="font-medium text-gray-900">
                  {project.endDate
                    ? new Date(project.endDate).toLocaleDateString()
                    : 'Not set'}
                </p>
              </div>
            </div>

            {/* Vehicle */}
            <div className="flex items-start gap-2">
              <Car className="h-5 w-5 text-gray-500 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Vehicle</p>
                <p className="font-medium text-gray-900">
                  Vehicle ID: #{project.vehicleId || 'N/A'}
                </p>
              </div>
            </div>

            {/* Customer */}
            {project.customerName && (
              <div className="flex items-start gap-2">
                <User className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-medium text-gray-900">{project.customerName}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Project Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Services</p>
                <p className="text-3xl font-bold text-gray-900">{tasks.length}</p>
              </div>
              <Package className="h-12 w-12 text-primary opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Hours</p>
                <p className="text-3xl font-bold text-gray-900">{totalHours}</p>
              </div>
              <Clock className="h-12 w-12 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Cost</p>
                <p className="text-3xl font-bold text-green-600">
                  LKR {totalCost.toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-12 w-12 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services/Tasks List */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Services Included
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No services found for this project</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.taskId}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">
                        {task.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {task.description || 'No description'}
                      </p>
                    </div>
                    <Badge className={`ml-4 ${getTaskStatusColor(task.status)}`}>
                      {task.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 pt-3 border-t">
                    <div>
                      <p className="text-xs text-gray-500">Category</p>
                      <p className="text-sm font-medium">{task.category || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Priority</p>
                      <p className="text-sm font-medium">{task.priority || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Estimated Hours</p>
                      <p className="text-sm font-medium">{task.estimatedHours || 0}h</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Cost</p>
                      <p className="text-sm font-medium text-green-600">
                        LKR {task.estimatedCost?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                  </div>

                  {task.notes && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-gray-500 mb-1">Notes</p>
                      <p className="text-sm text-gray-700">{task.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        <Button
          variant="outline"
          onClick={() => router.push('/customer/projects')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
      </div>
    </div>
  );
}
