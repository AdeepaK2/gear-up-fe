"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, CheckCircle2, Check } from "lucide-react";
import { appointmentService } from "@/lib/services/appointmentService";
import { taskService, type Task } from "@/lib/services/taskService";
import type { Appointment } from "@/lib/types/Appointment";
import { useToast } from "@/contexts/ToastContext";

export default function AppointmentReportPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const appointmentId = Number(searchParams.get("id"));

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [reportNotes, setReportNotes] = useState("");
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
      const appointmentData = await appointmentService.getAppointmentById(
        appointmentId
      );
      setAppointment(appointmentData);

      // Load available tasks/services
      const tasks = await taskService.getAllTasks();
      setAvailableTasks(tasks);
    } catch (err) {
      console.error("Failed to load data:", err);
      toast.error("Failed to load appointment data");
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskSelection = (taskId: number) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSubmitReport = async () => {
    if (selectedTasks.length === 0) {
      toast.error("Please select at least one service");
      return;
    }

    try {
      setSubmitting(true);

      // Update the appointment with status and selected tasks
      await appointmentService.updateAppointment(appointmentId, {
        status: "COMPLETED",
        taskIds: selectedTasks,
        notes: reportNotes || undefined,
      });

      toast.success("Report submitted successfully!");

      // Redirect back to appointments page
      setTimeout(() => {
        router.push("/employee/appointments");
      }, 1500);
    } catch (err) {
      console.error("Failed to submit report:", err);
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!appointmentId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Invalid appointment ID</p>
          <Button
            onClick={() => router.push("/employee/appointments")}
            className="mt-4"
          >
            Back to Appointments
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
          <Button
            onClick={() => router.push("/employee/appointments")}
            className="mt-4"
          >
            Back to Appointments
          </Button>
        </div>
      </div>
    );
  }

  const selectedTasksDetails = availableTasks.filter((task) =>
    selectedTasks.includes(task.taskId)
  );
  const totalCost = selectedTasksDetails.reduce(
    (sum, task) => sum + task.estimatedCost,
    0
  );
  const totalHours = selectedTasksDetails.reduce(
    (sum, task) => sum + task.estimatedHours,
    0
  );

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.push("/employee/appointments")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Submit Appointment Report
          </h1>
          <p className="text-gray-600 mt-1">
            Appointment #{appointmentId} -{" "}
            {appointment.consultationTypeLabel || appointment.consultationType}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Service Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Appointment Details Card */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Appointment Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Customer ID</p>
                <p className="font-medium">#{appointment.customerId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium">
                  {new Date(appointment.appointmentDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-medium">
                  {appointment.startTime} - {appointment.endTime}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-medium text-blue-600">
                  {appointment.status}
                </p>
              </div>
            </div>
          </Card>

          {/* Services Selection Card */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Select Services Performed
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Choose all services that were performed during this appointment
            </p>

            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {availableTasks.map((task) => (
                <div
                  key={task.taskId}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedTasks.includes(task.taskId)
                      ? "border-primary bg-blue-50"
                      : "border-gray-200 hover:border-primary/50"
                  }`}
                  onClick={() => toggleTaskSelection(task.taskId)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-1 flex-shrink-0 ${
                        selectedTasks.includes(task.taskId)
                          ? "bg-primary border-primary"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedTasks.includes(task.taskId) && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {task.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {task.description}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-semibold text-primary">
                            LKR {task.estimatedCost.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {task.estimatedHours}h
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {task.category}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            task.priority === "High"
                              ? "bg-red-100 text-red-700"
                              : task.priority === "Medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Additional Notes */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Additional Notes</h2>
            <Label htmlFor="notes" className="text-sm text-gray-600">
              Add any additional notes or observations about the work performed
            </Label>
            <textarea
              id="notes"
              value={reportNotes}
              onChange={(e) => setReportNotes(e.target.value)}
              className="w-full mt-2 p-3 border rounded-lg min-h-[120px] focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Enter any additional notes here..."
            />
          </Card>
        </div>

        {/* Sidebar - Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Report Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="pb-3 border-b">
                <p className="text-sm text-gray-600">Selected Services</p>
                <p className="text-2xl font-bold text-primary">
                  {selectedTasks.length}
                </p>
              </div>

              <div className="pb-3 border-b">
                <p className="text-sm text-gray-600">Total Hours</p>
                <p className="text-2xl font-bold">{totalHours}h</p>
              </div>

              <div className="pb-3 border-b">
                <p className="text-sm text-gray-600">Total Cost</p>
                <p className="text-2xl font-bold text-green-600">
                  LKR {totalCost.toFixed(2)}
                </p>
              </div>
            </div>

            {selectedTasks.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Selected Services:
                </p>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {selectedTasksDetails.map((task) => (
                    <div
                      key={task.taskId}
                      className="flex items-start justify-between text-sm"
                    >
                      <span className="text-gray-700 flex-1">{task.name}</span>
                      <span className="text-primary font-medium ml-2">
                        LKR {task.estimatedCost.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={handleSubmitReport}
              disabled={submitting || selectedTasks.length === 0}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-6 text-lg"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Submit Report
                </>
              )}
            </Button>

            {selectedTasks.length === 0 && (
              <p className="text-sm text-red-500 text-center mt-3">
                Please select at least one service
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
