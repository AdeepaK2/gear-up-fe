"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Loader2,
  Plus,
  X,
  CheckCircle2,
  Calendar,
  Package,
} from "lucide-react";
import { appointmentService } from "@/lib/services/appointmentService";
import { taskService, type Task } from "@/lib/services/taskService";
import { vehicleService } from "@/lib/services/vehicleService";
import { projectService } from "@/lib/services/projectService";
import type { Appointment } from "@/lib/types/Appointment";
import { useToast } from "@/contexts/ToastContext";

export default function CreateProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const appointmentId = Number(searchParams.get("appointmentId"));

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [selectedTaskIds, setSelectedTaskIds] = useState<number[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (appointmentId) {
      loadData();
    }
  }, [appointmentId]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load appointment details
      const aptData = await appointmentService.getAppointmentById(appointmentId);
      setAppointment(aptData);

      // Set default project name
      setProjectName(`Project for ${aptData.consultationTypeLabel || aptData.consultationType}`);

      // Load all tasks
      const tasksData = await taskService.getAllTasks();
      setAllTasks(tasksData);

      // Filter tasks for this appointment
      const appointmentTasks = tasksData.filter(
        task => task.appointmentId === appointmentId
      );
      setAvailableTasks(appointmentTasks);

      // Pre-select all appointment tasks
      setSelectedTaskIds(appointmentTasks.map(t => t.taskId));

      // Load customer vehicles
      const vehiclesData = await vehicleService.getMyVehicles();
      setVehicles(vehiclesData);

      // Auto-select vehicle if only one
      if (vehiclesData.length === 1) {
        setSelectedVehicleId(vehiclesData[0].id);
      }

      // Set default dates
      const today = new Date().toISOString().split("T")[0];
      setStartDate(today);

      const oneMonthLater = new Date();
      oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
      setEndDate(oneMonthLater.toISOString().split("T")[0]);
    } catch (err) {
      console.error("Failed to load data:", err);
      toast.error("Failed to load appointment data");
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskSelection = (taskId: number) => {
    setSelectedTaskIds(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const addAdditionalTask = (taskId: number) => {
    if (!selectedTaskIds.includes(taskId)) {
      setSelectedTaskIds(prev => [...prev, taskId]);
    }
  };

  const removeTask = (taskId: number) => {
    setSelectedTaskIds(prev => prev.filter(id => id !== taskId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedTaskIds.length === 0) {
      toast.error("Please select at least one service");
      return;
    }

    if (!selectedVehicleId) {
      toast.error("Please select a vehicle");
      return;
    }

    try {
      setSubmitting(true);

      const projectData = {
        name: projectName,
        description: projectDescription,
        startDate,
        endDate,
        appointmentId,
        vehicleId: selectedVehicleId,
        taskIds: selectedTaskIds,
      };

      await projectService.createProject(projectData);

      toast.success("Project created successfully!");

      setTimeout(() => {
        router.push("/customer/projects");
      }, 1500);
    } catch (err: any) {
      console.error("Failed to create project:", err);
      toast.error(err.message || "Failed to create project");
    } finally {
      setSubmitting(false);
    }
  };

  if (!appointmentId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Invalid appointment ID</p>
          <Button onClick={() => router.push("/customer/reports")} className="mt-4">
            Back to Reports
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-gray-600">Loading...</span>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Appointment not found</p>
          <Button onClick={() => router.push("/customer/reports")} className="mt-4">
            Back to Reports
          </Button>
        </div>
      </div>
    );
  }

  const selectedTasks = allTasks.filter(task => selectedTaskIds.includes(task.taskId));
  const unselectedTasks = allTasks.filter(
    task => !selectedTaskIds.includes(task.taskId) && task.appointmentId !== appointmentId
  );

  const totalCost = selectedTasks.reduce((sum, task) => sum + task.estimatedCost, 0);
  const totalHours = selectedTasks.reduce((sum, task) => sum + task.estimatedHours, 0);

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.push("/customer/reports")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-primary">Create Project</h1>
          <p className="text-gray-600 mt-1">
            Create a project from appointment #{appointmentId}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Appointment Info */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Appointment Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-600">Service Type</p>
                  <p className="font-medium">{appointment.consultationTypeLabel || appointment.consultationType}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">{new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Project Details Form */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Project Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="projectName">Project Name *</Label>
                <Input
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="w-full mt-1 p-3 border rounded-lg min-h-[100px]"
                  placeholder="Enter project description..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="vehicle">Vehicle *</Label>
                <select
                  id="vehicle"
                  value={selectedVehicleId || ""}
                  onChange={(e) => setSelectedVehicleId(Number(e.target.value))}
                  className="w-full mt-1 p-3 border rounded-lg"
                  required
                >
                  <option value="">Select a vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.make} {vehicle.model} ({vehicle.licensePlate})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Selected Services */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Selected Services</h2>
            {selectedTasks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No services selected</p>
            ) : (
              <div className="space-y-3">
                {selectedTasks.map((task) => (
                  <div
                    key={task.taskId}
                    className="border rounded-lg p-4 flex items-start justify-between"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold">{task.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">{task.category}</Badge>
                        <Badge variant="outline" className="text-xs">{task.priority}</Badge>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 ml-4">
                      <div className="text-right">
                        <div className="font-bold text-primary">${task.estimatedCost.toFixed(2)}</div>
                        <div className="text-sm text-gray-500">{task.estimatedHours}h</div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTask(task.taskId)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Add Additional Services */}
          {unselectedTasks.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Add Additional Services</h2>
              <div className="space-y-2">
                {unselectedTasks.slice(0, 5).map((task) => (
                  <div
                    key={task.taskId}
                    className="border rounded-lg p-3 flex items-center justify-between hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{task.name}</h4>
                      <p className="text-xs text-gray-600">${task.estimatedCost.toFixed(2)} • {task.estimatedHours}h</p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => addAdditionalTask(task.taskId)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Project Summary</h2>
            <div className="space-y-4 mb-6">
              <div className="pb-3 border-b">
                <p className="text-sm text-gray-600">Selected Services</p>
                <p className="text-2xl font-bold text-primary">{selectedTasks.length}</p>
              </div>
              <div className="pb-3 border-b">
                <p className="text-sm text-gray-600">Total Hours</p>
                <p className="text-2xl font-bold">{totalHours}h</p>
              </div>
              <div className="pb-3 border-b">
                <p className="text-sm text-gray-600">Total Cost</p>
                <p className="text-2xl font-bold text-green-600">${totalCost.toFixed(2)}</p>
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting || selectedTasks.length === 0 || !selectedVehicleId}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-6 text-lg"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Create Project
                </>
              )}
            </Button>

            {selectedTasks.length === 0 && (
              <p className="text-sm text-red-500 text-center mt-3">
                Please select at least one service
              </p>
            )}
            {!selectedVehicleId && (
              <p className="text-sm text-red-500 text-center mt-2">
                Please select a vehicle
              </p>
            )}
          </Card>
        </div>
      </form>
    </div>
  );
}
