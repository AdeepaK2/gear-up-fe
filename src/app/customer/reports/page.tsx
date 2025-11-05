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
import type { Appointment } from "@/lib/types/Appointment";

interface AppointmentWithTasks extends Appointment {
  tasks?: Task[];
}

export default function CustomerReportsPage() {
  const router = useRouter();
  const [completedAppointments, setCompletedAppointments] = useState<AppointmentWithTasks[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    loadCompletedAppointments();
  }, []);

  const loadCompletedAppointments = async () => {
    try {
      setLoading(true);
      const appointments = await appointmentService.getAllAppointmentsForCurrentCustomer();

      // Filter only COMPLETED appointments
      const completed = appointments.filter(
        apt => apt.status?.toUpperCase() === 'COMPLETED'
      );

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

  const handleCreateProject = (appointmentId: number) => {
    router.push(`/customer/projects/create?appointmentId=${appointmentId}`);
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
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold">Service Reports</h1>
        <p className="text-white/90 mt-2">
          View completed appointments and create projects from service reports
        </p>
      </div>

      {/* Completed Appointments List */}
      {completedAppointments.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Completed Services</h2>
          <p className="text-gray-600 mb-6">
            You don't have any completed service appointments yet.
          </p>
          <Button onClick={() => router.push("/customer/appointments")} className="bg-primary">
            <Calendar className="mr-2 h-4 w-4" />
            Book an Appointment
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {completedAppointments.map((appointment) => {
            const isExpanded = !!appointment.tasks;
            const isLoadingTasks = loadingTasks[appointment.id];

            return (
              <Card key={appointment.id} className="overflow-hidden">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className="bg-green-500 text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                        <span className="text-lg font-semibold text-gray-900">
                          Appointment #{appointment.id}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Package className="h-4 w-4 text-primary" />
                          <span className="text-sm">
                            {appointment.consultationTypeLabel || appointment.consultationType}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="text-sm">
                            {new Date(appointment.appointmentDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="text-sm">
                            {appointment.startTime} - {appointment.endTime}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {!isExpanded && (
                        <Button
                          onClick={() => loadTasksForAppointment(appointment.id)}
                          disabled={isLoadingTasks}
                          variant="outline"
                          size="sm"
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
                        className="bg-primary hover:bg-primary/90"
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
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Services Performed
                    </h3>
                    <div className="space-y-3">
                      {appointment.tasks.map((task) => (
                        <div
                          key={task.taskId}
                          className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{task.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                              <div className="flex gap-2 mt-2">
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
                            <div className="text-right ml-4">
                              <div className="text-lg font-bold text-primary">
                                ${task.estimatedCost.toFixed(2)}
                              </div>
                              <div className="text-sm text-gray-500">
                                {task.estimatedHours}h
                              </div>
                            </div>
                          </div>
                          {task.notes && (
                            <div className="mt-3 pt-3 border-t">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Notes:</span> {task.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-6 border-t flex items-center justify-between">
                      <div className="text-lg font-semibold text-gray-900">
                        Total Estimated Cost
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        ${appointment.tasks
                          .reduce((sum, task) => sum + task.estimatedCost, 0)
                          .toFixed(2)}
                      </div>
                    </div>
                  </div>
                )}

                {isExpanded && appointment.tasks && appointment.tasks.length === 0 && (
                  <div className="p-6 text-center text-gray-500">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p>No services recorded for this appointment</p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
