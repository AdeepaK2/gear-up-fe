"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  Loader2,
  ArrowRight,
  Package
} from "lucide-react";
import { appointmentService } from "@/lib/services/appointmentService";
import { taskService, type Task } from "@/lib/services/taskService";
import { projectService, type Project } from "@/lib/services/projectService";
import type { Appointment } from "@/lib/types/Appointment";

interface AppointmentWithTasks extends Appointment {
  tasks?: Task[];
}

interface ProjectWithTasks extends Project {
  tasks?: Task[];
}

export default function CustomerReportsPage() {
  const router = useRouter();
  const [completedAppointments, setCompletedAppointments] = useState<AppointmentWithTasks[]>([]);
  const [projectReports, setProjectReports] = useState<ProjectWithTasks[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState<{ [key: number]: boolean }>({});
  const [loadingProjectTasks, setLoadingProjectTasks] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    loadCompletedAppointments();
    loadProjectReports();
  }, []);

  const loadCompletedAppointments = async () => {
    try {
      setLoading(true);
      const appointments = await appointmentService.getAllAppointmentsForCurrentCustomer();
      
      // Get all projects to check which appointments have projects
      const allProjects = await projectService.getAllProjectsForCurrentCustomer();

      // Filter only COMPLETED appointments that don't have projects created yet
      const completed = appointments.filter(apt => {
        const isCompleted = apt.status?.toUpperCase() === 'COMPLETED';
        const hasProject = allProjects.some(proj => proj.appointmentId === apt.id);
        return isCompleted && !hasProject;
      });

      setCompletedAppointments(completed);
    } catch (err) {
      console.error("Failed to load completed appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadTasksForAppointment = async (appointmentId: number) => {
    try {
      setLoadingTasks(prev => ({ ...prev, [appointmentId]: true }));

      // Fetch all tasks and filter by appointmentId
      const allTasks = await taskService.getAllTasks();
      console.log(`Total tasks fetched: ${allTasks.length}`);
      console.log(`Looking for tasks with appointmentId: ${appointmentId}`);

      const appointmentTasks = allTasks.filter(task => task.appointmentId === appointmentId);
      console.log(`Found ${appointmentTasks.length} tasks for appointment ${appointmentId}`, appointmentTasks);

      // Update the appointment with tasks
      setCompletedAppointments(prev =>
        prev.map(apt =>
          apt.id === appointmentId
            ? { ...apt, tasks: appointmentTasks }
            : apt
        )
      );
    } catch (err) {
      console.error("Failed to load tasks:", err);
    } finally {
      setLoadingTasks(prev => ({ ...prev, [appointmentId]: false }));
    }
  };

  const loadProjectReports = async () => {
    try {
      console.log("Loading project reports...");
      const projects = await projectService.getProjectsWithReports();
      console.log("Project reports loaded:", projects.length, projects);
      setProjectReports(projects);
    } catch (err) {
      console.error("Failed to load project reports:", err);
    }
  };

  const loadTasksForProject = async (projectId: number) => {
    try {
      setLoadingProjectTasks(prev => ({ ...prev, [projectId]: true }));

      const allTasks = await taskService.getAllTasks();
      const projectTasks = allTasks.filter(task => 
        projectReports.find(p => p.id === projectId)?.taskIds?.includes(task.taskId)
      );

      setProjectReports(prev =>
        prev.map(proj =>
          proj.id === projectId
            ? { ...proj, tasks: projectTasks }
            : proj
        )
      );
    } catch (err) {
      console.error("Failed to load project tasks:", err);
    } finally {
      setLoadingProjectTasks(prev => ({ ...prev, [projectId]: false }));
    }
  };

  const handleCreateProject = (appointmentId: number) => {
    router.push(`/customer/projects/create?appointmentId=${appointmentId}`);
  };

  const parseProjectReport = (description: string) => {
    const parts = description.split('--- Project Report ---');
    if (parts.length < 2) return null;
    
    const reportSection = parts[1];
    const lines = reportSection.split('\n').filter(line => line.trim());
    
    const report: any = {};
    let currentSection = '';
    let extraCharges: Array<{ description: string; amount: string }> = [];
    let notes = '';

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('Submitted by:')) {
        report.submittedBy = trimmed.replace('Submitted by:', '').trim();
      } else if (trimmed.startsWith('Date:')) {
        report.date = trimmed.replace('Date:', '').trim();
      } else if (trimmed.startsWith('Completed Services:')) {
        report.completedServices = trimmed.replace('Completed Services:', '').trim();
      } else if (trimmed.startsWith('Extra Charges Total:')) {
        report.extraChargesTotal = trimmed.replace('Extra Charges Total:', '').trim();
      } else if (trimmed.startsWith('Extra Charges Details:')) {
        currentSection = 'extraCharges';
      } else if (trimmed.startsWith('- ')) {
        extraCharges.push({ description: trimmed.substring(2), amount: '' });
      } else if (trimmed.startsWith('Notes:')) {
        currentSection = 'notes';
        notes = trimmed.replace('Notes:', '').trim();
      } else if (currentSection === 'notes' && trimmed) {
        notes += (notes ? ' ' : '') + trimmed;
      }
    });

    report.extraCharges = extraCharges;
    report.notes = notes;
    return report;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-gray-600">Loading reports...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-4 sm:p-8 rounded-lg shadow-lg">
        <h1 className="text-xl sm:text-3xl font-bold">Service Reports</h1>
        <p className="text-white/90 mt-1 sm:mt-2 text-sm sm:text-base">
          View completed appointments and project reports
        </p>
      </div>

      {/* Project Reports Section */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Project Reports</h2>
        {projectReports.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {projectReports.map((project) => {
              const isExpanded = !!project.tasks;
              const isLoadingTasks = loadingProjectTasks[project.id];
              const reportData = project.description ? parseProjectReport(project.description) : null;

              return (
                <Card key={project.id} className="overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 border-b">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                      <div className="flex-1 w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-2">
                          <Badge className="bg-blue-500 text-white w-fit">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Project Report
                          </Badge>
                          <span className="text-base sm:text-lg font-semibold text-gray-900">
                            {project.name || project.projectName || `Project #${project.id}`}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mt-3 sm:mt-4">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Package className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="text-xs sm:text-sm truncate">
                              Vehicle: {project.vehicleName || 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="text-xs sm:text-sm">
                              {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                          {reportData && (
                            <div className="flex items-center gap-2 text-gray-700">
                              <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                              <span className="text-xs sm:text-sm">
                                Completed: {reportData.completedServices} services
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                        {!isExpanded && project.taskIds && project.taskIds.length > 0 && (
                          <Button
                            onClick={() => loadTasksForProject(project.id)}
                            disabled={isLoadingTasks}
                            variant="outline"
                            size="sm"
                            className="flex-1 sm:flex-none"
                          >
                            {isLoadingTasks ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                <span className="hidden sm:inline">Loading...</span>
                              </>
                            ) : (
                              <>
                                <FileText className="h-4 w-4 sm:mr-2" />
                                <span className="hidden sm:inline">View Report</span>
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Project Report Details */}
                  {isExpanded && project.tasks && project.tasks.length > 0 && (
                    <div className="p-4 sm:p-6">
                      {reportData && (
                        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg border">
                          <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Report Information</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                            {reportData.submittedBy && (
                              <div>
                                <span className="text-gray-600">Submitted by:</span>
                                <span className="ml-2 font-medium">{reportData.submittedBy}</span>
                              </div>
                            )}
                            {reportData.date && (
                              <div>
                                <span className="text-gray-600">Date:</span>
                                <span className="ml-2 font-medium">{reportData.date}</span>
                              </div>
                            )}
                          </div>
                          {reportData.extraChargesTotal && (
                            <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t">
                              <span className="text-gray-600 text-xs sm:text-sm">Extra Charges Total:</span>
                              <span className="ml-2 font-bold text-orange-600 text-sm sm:text-base">{reportData.extraChargesTotal}</span>
                            </div>
                          )}
                          {reportData.notes && (
                            <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t">
                              <span className="text-gray-600 font-medium text-xs sm:text-sm">Notes:</span>
                              <p className="text-gray-800 mt-1 text-xs sm:text-sm">{reportData.notes}</p>
                            </div>
                          )}
                        </div>
                      )}

                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                        Services Completed
                      </h3>
                      <div className="space-y-3">
                        {project.tasks.map((task) => (
                          <div
                            key={task.taskId}
                            className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                              <div className="flex-1 w-full">
                                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{task.name}</h4>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1">{task.description}</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {task.category && (
                                    <Badge variant="outline" className="text-xs">
                                      {task.category}
                                    </Badge>
                                  )}
                                  {task.priority && (
                                    <Badge
                                      variant="outline"
                                      className={`text-xs ${
                                        task.priority === "High"
                                          ? "border-red-300 text-red-700"
                                          : task.priority === "Medium"
                                          ? "border-yellow-300 text-yellow-700"
                                          : "border-green-300 text-green-700"
                                      }`}
                                    >
                                      {task.priority}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="text-left sm:text-right sm:ml-4 w-full sm:w-auto flex sm:flex-col justify-between sm:justify-start items-center sm:items-end">
                                <div className="text-base sm:text-lg font-bold text-primary">
                                  ${(task.estimatedCost || 0).toFixed(2)}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-500">
                                  {(task.estimatedHours || 0)}h
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div className="text-base sm:text-lg font-semibold text-gray-900">
                          Total Services Cost
                        </div>
                        <div className="text-xl sm:text-2xl font-bold text-primary">
                          ${project.tasks
                            .reduce((sum, task) => sum + (task.estimatedCost || 0), 0)
                            .toFixed(2)}
                        </div>
                      </div>
                      {reportData?.extraChargesTotal && (
                        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <div className="text-base sm:text-lg font-semibold text-gray-900">
                            Total Cost (Including Extra Charges)
                          </div>
                          <div className="text-xl sm:text-2xl font-bold text-green-600">
                            {reportData.extraChargesTotal}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {isExpanded && project.tasks && project.tasks.length === 0 && (
                    <div className="p-4 sm:p-6 text-center text-gray-500">
                      <FileText className="h-10 sm:h-12 w-10 sm:w-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm sm:text-base">No services recorded for this project</p>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-4 sm:p-8 text-center">
            <FileText className="h-10 sm:h-12 w-10 sm:w-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
            <p className="text-sm sm:text-base text-gray-600">No project reports available yet.</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Project reports will appear here once your completed projects have reports submitted.
            </p>
          </Card>
        )}
      </div>

      {/* Appointment Reports Section */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Appointment Reports</h2>
        {completedAppointments.length === 0 ? (
          <Card className="p-6 sm:p-12 text-center">
            <FileText className="h-12 sm:h-16 w-12 sm:w-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">No Completed Appointments</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              You don't have any completed service appointments yet.
            </p>
            <Button onClick={() => router.push("/customer/appointments")} className="bg-primary">
              <Calendar className="mr-2 h-4 w-4" />
              Book an Appointment
            </Button>
          </Card>
        ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {completedAppointments.map((appointment) => {
            const isExpanded = !!appointment.tasks;
            const isLoadingTasks = loadingTasks[appointment.id];

            return (
              <Card key={appointment.id} className="overflow-hidden">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-6 border-b">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex-1 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-2">
                        <Badge className="bg-green-500 text-white w-fit">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                        <span className="text-base sm:text-lg font-semibold text-gray-900">
                          Appointment #{appointment.id}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mt-3 sm:mt-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Package className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-xs sm:text-sm truncate">
                            {appointment.consultationTypeLabel || appointment.consultationType}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-xs sm:text-sm">
                            {new Date(appointment.appointmentDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-xs sm:text-sm">
                            {appointment.startTime} - {appointment.endTime}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full sm:w-auto">
                      {!isExpanded && (
                        <Button
                          onClick={() => loadTasksForAppointment(appointment.id)}
                          disabled={isLoadingTasks}
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto"
                        >
                          {isLoadingTasks ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Loading...
                            </>
                          ) : (
                            <>
                              <FileText className="h-4 w-4 mr-2" />
                              View Report
                            </>
                          )}
                        </Button>
                      )}
                      <Button
                        onClick={() => handleCreateProject(appointment.id)}
                        className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
                        size="sm"
                      >
                        Create Project
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Service Report Details */}
                {isExpanded && appointment.tasks && appointment.tasks.length > 0 && (
                  <div className="p-4 sm:p-6">
                    {/* Employee Notes/Report */}
                    {appointment.notes && (
                      <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2 text-sm sm:text-base">
                          <FileText className="h-4 sm:h-5 w-4 sm:w-5" />
                          Technician's Report
                        </h4>
                        <p className="text-gray-800 text-xs sm:text-sm whitespace-pre-wrap">{appointment.notes}</p>
                      </div>
                    )}

                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                      Services Performed
                    </h3>
                    <div className="space-y-3">
                      {appointment.tasks.map((task) => (
                        <div
                          key={task.taskId}
                          className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                            <div className="flex-1 w-full">
                              <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{task.name}</h4>
                              <p className="text-xs sm:text-sm text-gray-600 mt-1">{task.description}</p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {task.category}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${
                                    task.priority === "High"
                                      ? "border-red-300 text-red-700"
                                      : task.priority === "Medium"
                                      ? "border-yellow-300 text-yellow-700"
                                      : "border-green-300 text-green-700"
                                  }`}
                                >
                                  {task.priority}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-left sm:text-right sm:ml-4 w-full sm:w-auto flex sm:flex-col justify-between sm:justify-start items-center sm:items-end">
                              <div className="text-base sm:text-lg font-bold text-primary">
                                ${task.estimatedCost.toFixed(2)}
                              </div>
                              <div className="text-xs sm:text-sm text-gray-500">
                                {task.estimatedHours}h
                              </div>
                            </div>
                          </div>
                          {task.notes && (
                            <div className="mt-3 pt-3 border-t">
                              <p className="text-xs sm:text-sm text-gray-600">
                                <span className="font-medium">Notes:</span> {task.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="text-base sm:text-lg font-semibold text-gray-900">
                        Total Estimated Cost
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-primary">
                        ${appointment.tasks
                          .reduce((sum, task) => sum + task.estimatedCost, 0)
                          .toFixed(2)}
                      </div>
                    </div>
                  </div>
                )}

                {isExpanded && appointment.tasks && appointment.tasks.length === 0 && (
                  <div className="p-4 sm:p-6 text-center text-gray-500">
                    <FileText className="h-10 sm:h-12 w-10 sm:w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm sm:text-base">No services recorded for this appointment</p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
        )}
      </div>

      {/* Empty State - Show only if both are empty */}
      {completedAppointments.length === 0 && projectReports.length === 0 && (
        <Card className="p-6 sm:p-12 text-center">
          <FileText className="h-12 sm:h-16 w-12 sm:w-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">No Service Reports</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            You don't have any service reports yet.
          </p>
          <Button onClick={() => router.push("/customer/appointments")} className="bg-primary">
            <Calendar className="mr-2 h-4 w-4" />
            Book an Appointment
          </Button>
        </Card>
      )}
    </div>
  );
}
