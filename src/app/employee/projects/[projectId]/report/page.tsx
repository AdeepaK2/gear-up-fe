"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, CheckCircle2, Check, Plus, X } from "lucide-react";
import { projectService, type Project } from "@/lib/services/projectService";
import { taskService, type Task } from "@/lib/services/taskService";
import { useToast } from "@/contexts/ToastContext";
import { authService } from "@/lib/services/authService";

export default function ProjectReportPage() {
  const router = useRouter();
  const params = useParams();
  const toast = useToast();
  const projectId = Number(params.projectId);

  const [project, setProject] = useState<Project | null>(null);
  const [projectTasks, setProjectTasks] = useState<Task[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [reportNotes, setReportNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [extraCharges, setExtraCharges] = useState<
    Array<{ description: string; amount: number }>
  >([]);

  useEffect(() => {
    if (projectId) {
      loadData();
    }
  }, [projectId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const projectData = await projectService.getProjectById(projectId);
      setProject(projectData);

      if (projectData.taskIds && projectData.taskIds.length > 0) {
        const allTasks = await taskService.getAllTasks();
        const tasks = allTasks.filter((task) =>
          projectData.taskIds?.includes(task.taskId)
        );
        setProjectTasks(tasks);
        setSelectedTasks(tasks.map((task) => task.taskId));
      }
    } catch (err) {
      console.error("Failed to load data:", err);
      toast.error("Failed to load project data");
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

  const addExtraCharge = () => {
    setExtraCharges((prev) => [...prev, { description: "", amount: 0 }]);
  };

  const removeExtraCharge = (index: number) => {
    setExtraCharges((prev) => prev.filter((_, i) => i !== index));
  };

  const updateExtraCharge = (
    index: number,
    field: "description" | "amount",
    value: string | number
  ) => {
    setExtraCharges((prev) =>
      prev.map((charge, i) =>
        i === index ? { ...charge, [field]: value } : charge
      )
    );
  };

  const handleSubmitReport = async () => {
    if (selectedTasks.length === 0) {
      toast.error("Please select at least one service");
      return;
    }

    try {
      setSubmitting(true);

      const response = await authService.authenticatedFetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"
        }/projects/${projectId}/report`,
        {
          method: "POST",
          body: JSON.stringify({
            taskIds: selectedTasks,
            notes: reportNotes || undefined,
            extraCharges: extraCharges.filter(
              (charge) => charge.description.trim() && charge.amount > 0
            ),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit report");
      }

      toast.success("Report submitted successfully and sent to customer!");

      setTimeout(() => {
        router.push("/employee/projects");
      }, 1500);
    } catch (err: any) {
      console.error("Failed to submit report:", err);
      toast.error(err.message || "Failed to submit report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!projectId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Invalid project ID</p>
          <Button
            onClick={() => router.push("/employee/projects")}
            className="mt-4"
          >
            Back to Projects
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

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Project not found</p>
          <Button
            onClick={() => router.push("/employee/projects")}
            className="mt-4"
          >
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  const selectedTasksDetails = projectTasks.filter((task) =>
    selectedTasks.includes(task.taskId)
  );
  const servicesCost = selectedTasksDetails.reduce(
    (sum, task) => sum + (task.estimatedCost || 0),
    0
  );
  const extraChargesTotal = extraCharges.reduce(
    (sum, charge) => sum + (charge.amount || 0),
    0
  );
  const totalCost = servicesCost + extraChargesTotal;
  const totalHours = selectedTasksDetails.reduce(
    (sum, task) => sum + (task.estimatedHours || 0),
    0
  );

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.push("/employee/projects")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Submit Project Report
          </h1>
          <p className="text-gray-600 mt-1">
            Project #{projectId} - {project.name || project.projectName}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Project Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Customer</p>
                <p className="font-medium">
                  {project.customerName ||
                    `Customer #${project.customerId || "N/A"}`}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Vehicle</p>
                <p className="font-medium">{project.vehicleName || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="font-medium">
                  {project.startDate
                    ? new Date(project.startDate).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Due Date</p>
                <p className="font-medium">
                  {project.dueDate || project.endDate
                    ? new Date(
                        project.dueDate || project.endDate || ""
                      ).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-medium text-green-600">{project.status}</p>
              </div>
              {project.description && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-600 mb-2">Description</p>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 max-h-[400px] overflow-y-auto">
                    {(() => {
                      const parts = project.description.split(
                        "--- Project Report ---"
                      );
                      const initialText = parts[0]?.trim();
                      const reportSection = parts[1];

                      return (
                        <div className="space-y-4">
                          {initialText && (
                            <div className="pb-4 border-b border-gray-200">
                              <p className="text-gray-700 text-sm leading-relaxed">
                                {initialText}
                              </p>
                            </div>
                          )}

                          {reportSection && (
                            <div>
                              <h3 className="font-bold text-primary mb-4 text-lg">
                                Project Report
                              </h3>
                              <div className="space-y-3">
                                {reportSection
                                  .split("\n")
                                  .filter((line) => line.trim())
                                  .map((line, lineIndex) => {
                                    const trimmedLine = line.trim();

                                    if (
                                      trimmedLine.startsWith("Submitted by:")
                                    ) {
                                      const value = trimmedLine
                                        .replace("Submitted by:", "")
                                        .trim();
                                      return (
                                        <div
                                          key={lineIndex}
                                          className="flex items-start gap-3"
                                        >
                                          <span className="text-gray-500 font-medium min-w-[120px]">
                                            Submitted by:
                                          </span>
                                          <span className="text-gray-900 font-semibold">
                                            {value}
                                          </span>
                                        </div>
                                      );
                                    }

                                    if (trimmedLine.startsWith("Date:")) {
                                      const value = trimmedLine
                                        .replace("Date:", "")
                                        .trim();
                                      return (
                                        <div
                                          key={lineIndex}
                                          className="flex items-start gap-3"
                                        >
                                          <span className="text-gray-500 font-medium min-w-[120px]">
                                            Date:
                                          </span>
                                          <span className="text-gray-900">
                                            {value}
                                          </span>
                                        </div>
                                      );
                                    }

                                    if (
                                      trimmedLine.startsWith(
                                        "Completed Services:"
                                      )
                                    ) {
                                      const value = trimmedLine
                                        .replace("Completed Services:", "")
                                        .trim();
                                      return (
                                        <div
                                          key={lineIndex}
                                          className="flex items-start gap-3"
                                        >
                                          <span className="text-gray-500 font-medium min-w-[120px]">
                                            Completed Services:
                                          </span>
                                          <span className="text-primary font-bold">
                                            {value}
                                          </span>
                                        </div>
                                      );
                                    }

                                    if (
                                      trimmedLine.startsWith(
                                        "Extra Charges Total:"
                                      )
                                    ) {
                                      const value = trimmedLine
                                        .replace("Extra Charges Total:", "")
                                        .trim();
                                      return (
                                        <div
                                          key={lineIndex}
                                          className="flex items-start gap-3 mt-4 pt-4 border-t border-gray-300"
                                        >
                                          <span className="text-gray-500 font-medium min-w-[120px]">
                                            Extra Charges Total:
                                          </span>
                                          <span className="text-orange-600 font-bold text-lg">
                                            {value}
                                          </span>
                                        </div>
                                      );
                                    }

                                    if (
                                      trimmedLine.startsWith(
                                        "Extra Charges Details:"
                                      )
                                    ) {
                                      return (
                                        <div key={lineIndex} className="mt-3">
                                          <span className="text-gray-600 font-semibold">
                                            {trimmedLine}
                                          </span>
                                        </div>
                                      );
                                    }

                                    if (trimmedLine.startsWith("- ")) {
                                      const chargeText =
                                        trimmedLine.substring(2);
                                      return (
                                        <div
                                          key={lineIndex}
                                          className="ml-6 flex items-start gap-2"
                                        >
                                          <span className="text-orange-500 mt-1">
                                            •
                                          </span>
                                          <span className="text-gray-800">
                                            {chargeText}
                                          </span>
                                        </div>
                                      );
                                    }

                                    if (trimmedLine.startsWith("Notes:")) {
                                      const notesText = trimmedLine
                                        .replace("Notes:", "")
                                        .trim();
                                      return (
                                        <div
                                          key={lineIndex}
                                          className="mt-4 pt-4 border-t border-gray-300"
                                        >
                                          <div className="flex items-start gap-3 mb-2">
                                            <span className="text-gray-600 font-semibold min-w-[120px]">
                                              Notes:
                                            </span>
                                          </div>
                                          {notesText && (
                                            <p className="text-gray-800 ml-0 leading-relaxed bg-white p-3 rounded border border-gray-200">
                                              {notesText}
                                            </p>
                                          )}
                                        </div>
                                      );
                                    }

                                    return null;
                                  })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Services Completed</h2>
            <p className="text-sm text-gray-600 mb-4">
              All project services are pre-selected. Uncheck any services that
              were not completed.
            </p>

            {projectTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No services available for this project</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {projectTasks.map((task) => (
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
                              LKR {(task.estimatedCost || 0).toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {task.estimatedHours || 0}h
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                          {task.category && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              {task.category}
                            </span>
                          )}
                          {task.priority && (
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
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Extra Charges</h2>
            <p className="text-sm text-gray-600 mb-4">
              Add any additional charges that were incurred during the project
            </p>

            <div className="space-y-3">
              {extraCharges.map((charge, index) => (
                <div
                  key={index}
                  className="flex gap-3 items-start p-3 border rounded-lg bg-gray-50"
                >
                  <div className="flex-1">
                    <Label
                      htmlFor={`charge-desc-${index}`}
                      className="text-sm text-gray-600"
                    >
                      Description
                    </Label>
                    <Input
                      id={`charge-desc-${index}`}
                      value={charge.description}
                      onChange={(e) =>
                        updateExtraCharge(index, "description", e.target.value)
                      }
                      placeholder="e.g., Additional parts, Emergency service..."
                      className="mt-1"
                    />
                  </div>
                  <div className="w-32">
                    <Label
                      htmlFor={`charge-amount-${index}`}
                      className="text-sm text-gray-600"
                    >
                      Amount ($)
                    </Label>
                    <Input
                      id={`charge-amount-${index}`}
                      type="number"
                      step="0.01"
                      min="0"
                      value={charge.amount || ""}
                      onChange={(e) =>
                        updateExtraCharge(
                          index,
                          "amount",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      placeholder="0.00"
                      className="mt-1"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeExtraCharge(index)}
                    className="mt-6"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addExtraCharge}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Extra Charge
              </Button>
            </div>
          </Card>

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
                <p className="text-sm text-gray-600">Services Cost</p>
                <p className="text-xl font-bold text-primary">
                  LKR {servicesCost.toFixed(2)}
                </p>
              </div>

              {extraChargesTotal > 0 && (
                <div className="pb-3 border-b">
                  <p className="text-sm text-gray-600">Extra Charges</p>
                  <p className="text-xl font-bold text-orange-600">
                    LKR {extraChargesTotal.toFixed(2)}
                  </p>
                </div>
              )}

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
                <div className="space-y-2 max-h-[150px] overflow-y-auto mb-4">
                  {selectedTasksDetails.map((task) => (
                    <div
                      key={task.taskId}
                      className="flex items-start justify-between text-sm"
                    >
                      <span className="text-gray-700 flex-1">{task.name}</span>
                      <span className="text-primary font-medium ml-2">
                        LKR {(task.estimatedCost || 0).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {extraCharges.filter(
              (charge) => charge.description.trim() && charge.amount > 0
            ).length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Extra Charges:
                </p>
                <div className="space-y-2 max-h-[150px] overflow-y-auto">
                  {extraCharges
                    .filter(
                      (charge) => charge.description.trim() && charge.amount > 0
                    )
                    .map((charge, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between text-sm"
                      >
                        <span className="text-gray-700 flex-1">
                          {charge.description}
                        </span>
                        <span className="text-orange-600 font-medium ml-2">
                          LKR {charge.amount.toFixed(2)}
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
