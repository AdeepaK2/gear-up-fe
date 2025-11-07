"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, X, FolderOpen, Loader2, AlertCircle, RefreshCw, FileText, CheckCircle2, PlayCircle, UserPlus, Users, Clock, User, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/contexts/ToastContext";
import { API_ENDPOINTS } from "@/lib/config/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { projectService } from "@/lib/services/projectService";

// Project Status Enum matching backend
type ProjectStatus = 
  | "CREATED"
  | "RECOMMENDED"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

interface Project {
  id: number;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  customerId: number;
  customerName: string;
  vehicleId: number;
  appointmentId: number;
  taskIds: number[];
  assignedEmployeeIds?: number[];
  mainRepresentativeEmployeeId?: number;
}

interface Employee {
  employeeId: number;
  name: string;
  email: string;
  specialization: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [assignStep, setAssignStep] = useState<'select-employees' | 'select-representative'>(
    'select-employees'
  );
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [mainRepresentativeId, setMainRepresentativeId] = useState<number | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [assigning, setAssigning] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [projectToReject, setProjectToReject] = useState<Project | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const getAuthToken = () => {
    // Check both possible token storage keys
    return localStorage.getItem("accessToken") || localStorage.getItem("token");
  };

  const fetchProjects = async () => {
    setIsLoading(true);
    setError("");
    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error("Please login to continue");
      }

      const response = await fetch(`${API_ENDPOINTS.PROJECTS.BASE}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        localStorage.clear();
        throw new Error("Session expired. Please login again.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP ${response.status}: Failed to fetch projects`);
      }

      const apiResponse = await response.json();
      
      // Ensure we have data array, fallback to empty array
      const projectsData = Array.isArray(apiResponse.data) 
        ? apiResponse.data 
        : Array.isArray(apiResponse) 
        ? apiResponse 
        : [];
      
      // Ensure all projects have assignedEmployeeIds as an array (even if empty)
      const normalizedProjects = projectsData.map((p: Project) => ({
        ...p,
        assignedEmployeeIds: p.assignedEmployeeIds || []
      }));
        
      setProjects(normalizedProjects);
      
      // Clear any previous errors on successful fetch
      setError("");
    } catch (err: any) {
      const errorMessage = err.message || "Failed to load projects";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error fetching projects:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error("Please login to continue");
      }

      const response = await fetch(`${API_ENDPOINTS.EMPLOYEE.BASE}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        localStorage.clear();
        throw new Error("Session expired. Please login again.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP ${response.status}: Failed to fetch employees`);
      }

      const apiResponse = await response.json();
      
      // Ensure we have data array, fallback to empty array
      const employeesData = Array.isArray(apiResponse.data) 
        ? apiResponse.data 
        : Array.isArray(apiResponse) 
        ? apiResponse 
        : [];
        
      setEmployees(employeesData);
    } catch (err: any) {
      toast.error(err.message || "Failed to load employees");
      console.error("Error fetching employees:", err);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const handleOpenAssignDialog = (project: Project) => {
    setSelectedProject(project);
    // Pre-populate with existing assigned employees if any
    const existingEmployeeIds = project.assignedEmployeeIds || [];
    setSelectedEmployees(existingEmployeeIds);
    
    // Set main representative - if project has one, use it; otherwise auto-select first if multiple
    if (project.mainRepresentativeEmployeeId) {
      setMainRepresentativeId(project.mainRepresentativeEmployeeId);
    } else if (existingEmployeeIds.length === 1) {
      // Single employee automatically becomes main representative
      setMainRepresentativeId(existingEmployeeIds[0]);
    } else if (existingEmployeeIds.length > 1) {
      // Multiple employees but no main representative - auto-select first
      setMainRepresentativeId(existingEmployeeIds[0]);
    } else {
      setMainRepresentativeId(null);
    }
    
    setAssignDialogOpen(true);
    if (employees.length === 0) {
      fetchEmployees();
    }
  };

  const handleCloseAssignDialog = () => {
    setAssignDialogOpen(false);
    setAssignStep('select-employees');
    setSelectedProject(null);
    setSelectedEmployees([]);
    setMainRepresentativeId(null);
  };

  const handleToggleEmployee = (employeeId: number) => {
    setSelectedEmployees(prev => {
      const newSelection = prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId];
      
      return newSelection;
    });
  };

  const handleNextToRepresentative = () => {
    if (selectedEmployees.length === 0) {
      toast.error("Please select at least one employee");
      return;
    }

    // If only one employee, auto-select as main representative and proceed
    if (selectedEmployees.length === 1) {
      setMainRepresentativeId(selectedEmployees[0]);
      // Skip to assignment
      handleAssignEmployees(selectedEmployees[0]);
      return;
    }

    // Multiple employees - move to representative selection
    setAssignStep('select-representative');
  };

  const handleBackToEmployees = () => {
    setAssignStep('select-employees');
  };

  const handleAssignEmployees = async (autoMainRepId?: number) => {
    const finalMainRepId = autoMainRepId || mainRepresentativeId;
    
    if (!selectedProject || selectedEmployees.length === 0) {
      toast.error("Please select at least one employee");
      return;
    }

    // Validate main representative is selected if multiple employees
    if (selectedEmployees.length > 1 && !finalMainRepId) {
      toast.error("Please select a main representative");
      return;
    }

    setAssigning(true);
    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error("Please login to continue");
      }

      const requestBody: { employeeIds: number[]; mainRepresentativeEmployeeId?: number | null } = {
        employeeIds: selectedEmployees,
      };

      // Include main representative ID
      if (selectedEmployees.length > 1) {
        requestBody.mainRepresentativeEmployeeId = finalMainRepId;
      } else if (selectedEmployees.length === 1) {
        // Single employee automatically becomes main representative
        requestBody.mainRepresentativeEmployeeId = selectedEmployees[0];
      }

      const response = await fetch(
        `${API_ENDPOINTS.PROJECTS.BASE}/${selectedProject.id}/assign-employees`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.status === 401) {
        localStorage.clear();
        throw new Error("Session expired. Please login again.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP ${response.status}: Failed to assign employees`);
      }

      const apiResponse = await response.json();
      const updatedProject = apiResponse.data;
      
      // Ensure we have the assignedEmployeeIds from the response
      const assignedIds = updatedProject?.assignedEmployeeIds && Array.isArray(updatedProject.assignedEmployeeIds) && updatedProject.assignedEmployeeIds.length > 0
        ? updatedProject.assignedEmployeeIds
        : selectedEmployees;
      
      // Update the project in local state immediately with the response data
      setProjects(prevProjects => 
        prevProjects.map(p => 
          p.id === selectedProject.id 
            ? { 
                ...p, 
                assignedEmployeeIds: assignedIds,
                mainRepresentativeEmployeeId: updatedProject?.mainRepresentativeEmployeeId || finalMainRepId || null,
                status: p.status
              }
            : p
        )
      );

      toast.success(`Successfully assigned ${selectedEmployees.length} employee(s) to ${selectedProject.name}`);
      
      // Close dialog first
      handleCloseAssignDialog();
      
      // Then refresh projects list
      await fetchProjects();
    } catch (err: any) {
      toast.error(err.message || "Failed to assign employees");
      console.error("Error assigning employees:", err);
    } finally {
      setAssigning(false);
    }
  };

  const handleApprove = async (project: Project) => {
    // Check if employees are assigned before approving
    const hasEmployees = project.assignedEmployeeIds && project.assignedEmployeeIds.length > 0;
    
    if (!hasEmployees) {
      toast.error('Cannot approve project. Please assign at least one employee first.');
      return;
    }

    try {
      await projectService.updateProjectStatus(project.id, 'IN_PROGRESS');
      toast.success('Project approved successfully');
      await fetchProjects();
    } catch (error: any) {
      toast.error('Failed to approve project: ' + error.message);
      console.error('Error approving project:', error);
    }
  };

  const handleRejectClick = (project: Project) => {
    setProjectToReject(project);
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (!projectToReject) return;

    setRejecting(true);
    try {
      await projectService.updateProjectStatus(projectToReject.id, 'CANCELLED');
      toast.success('Project rejected and cancelled successfully');
      setRejectDialogOpen(false);
      setProjectToReject(null);
      await fetchProjects();
    } catch (error: any) {
      toast.error('Failed to reject project: ' + error.message);
      console.error('Error rejecting project:', error);
    } finally {
      setRejecting(false);
    }
  };

  const getStatusCounts = () => {
    return {
      created: projects.filter((p) => {
        const hasNoEmployees = !p.assignedEmployeeIds || p.assignedEmployeeIds.length === 0;
        return p.status !== "CANCELLED" && p.status !== "COMPLETED" && (p.status === "CREATED" || hasNoEmployees);
      }).length,
      inProgress: projects.filter((p) => {
        const hasEmployees = p.assignedEmployeeIds && p.assignedEmployeeIds.length > 0;
        return p.status === "IN_PROGRESS" && hasEmployees;
      }).length,
      completed: projects.filter((p) => p.status === "COMPLETED").length,
      cancelled: projects.filter((p) => p.status === "CANCELLED").length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Manage Projects
          </h1>
          <p className="text-lg text-gray-600">
            Track and manage all the projects
          </p>
        </div>
        <Button
          onClick={fetchProjects}
          disabled={isLoading}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      {isLoading && projects.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-gray-600">Loading projects...</span>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 text-base font-semibold mb-1">
                    Pending
                  </p>
                  <div className="text-4xl font-extrabold text-primary">
                    {statusCounts.created}
                  </div>
                </div>
                <div className="p-3 bg-primary rounded-lg shadow-sm">
                  <FileText className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 text-base font-semibold mb-1">
                    In Progress
                  </p>
                  <div className="text-4xl font-extrabold text-primary">
                    {statusCounts.inProgress}
                  </div>
                </div>
                <div className="p-3 bg-primary rounded-lg shadow-sm">
                  <PlayCircle className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 text-base font-semibold mb-1">
                    Completed
                  </p>
                  <div className="text-4xl font-extrabold text-green-600">
                    {statusCounts.completed}
                  </div>
                </div>
                <div className="p-3 bg-green-600 rounded-lg shadow-sm">
                  <Check className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 text-base font-semibold mb-1">
                    Cancelled
                  </p>
                  <div className="text-4xl font-extrabold text-red-600">
                    {statusCounts.cancelled}
                  </div>
                </div>
                <div className="p-3 bg-red-600 rounded-lg shadow-sm">
                  <X className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* No Projects Message */}
      {!isLoading && projects.length === 0 && !error && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <FolderOpen className="h-16 w-16 text-gray-300" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Projects Found
                </h3>
                <p className="text-gray-600 mb-4">
                  There are currently no projects in the system. Projects will appear here once they are created.
                </p>
                <Button onClick={fetchProjects} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {projects.length > 0 && (
        <div className="mt-16">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100">
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-white data-[state=active]:text-primary"
            >
              Pending
            </TabsTrigger>
            <TabsTrigger
              value="in-progress"
              className="data-[state=active]:bg-white data-[state=active]:text-primary"
            >
              In Progress
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="data-[state=active]:bg-white data-[state=active]:text-green-600"
            >
              Completed
            </TabsTrigger>
            <TabsTrigger
              value="cancelled"
              className="data-[state=active]:bg-white data-[state=active]:text-red-600"
            >
              Cancelled
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            <StandardProjectTable
              data={projects.filter((p) => {
                const hasNoEmployees = !p.assignedEmployeeIds || p.assignedEmployeeIds.length === 0;
                return p.status !== "CANCELLED" && p.status !== "COMPLETED" && (p.status === "CREATED" || hasNoEmployees);
              })}
              status="CREATED"
              onAssignEmployees={handleOpenAssignDialog}
              onApprove={handleApprove}
              onReject={handleRejectClick}
              projects={projects}
            />
          </TabsContent>
          <TabsContent value="in-progress" className="mt-6">
            <StandardProjectTable
              data={projects.filter((p) => {
                const hasEmployees = p.assignedEmployeeIds && p.assignedEmployeeIds.length > 0;
                return p.status === "IN_PROGRESS" && hasEmployees;
              })}
              status="IN_PROGRESS"
              onAssignEmployees={handleOpenAssignDialog}
              projects={projects}
            />
          </TabsContent>
          <TabsContent value="completed" className="mt-6">
            <StandardProjectTable
              data={projects.filter((p) => p.status === "COMPLETED")}
              status="COMPLETED"
              projects={projects}
            />
          </TabsContent>
          <TabsContent value="cancelled" className="mt-6">
            <StandardProjectTable
              data={projects.filter((p) => p.status === "CANCELLED")}
              status="CANCELLED"
              projects={projects}
            />
          </TabsContent>
        </Tabs>
        </div>
      )}

      {/* Employee Assignment Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={handleCloseAssignDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {assignStep === 'select-employees' ? 'Step 1: Select Employees' : 'Step 2: Select Main Representative'}
            </DialogTitle>
            <DialogDescription>
              {assignStep === 'select-employees' 
                ? `Select employees to assign to the project: ${selectedProject?.name}`
                : 'Choose the main representative who will be the primary point of contact for this project'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto py-4">
            {loadingEmployees ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading employees...
              </div>
            ) : (
              <>
                {/* Step 1: Select Employees */}
                {assignStep === 'select-employees' && (
                  <div className="space-y-3">
                    {employees.map((employee) => (
                      <div
                        key={employee.employeeId}
                        className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedEmployees.includes(employee.employeeId)
                            ? 'border-primary bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => handleToggleEmployee(employee.employeeId)}
                      >
                        <input
                          type="checkbox"
                          id={`employee-${employee.employeeId}`}
                          checked={selectedEmployees.includes(employee.employeeId)}
                          onChange={() => handleToggleEmployee(employee.employeeId)}
                          className="rounded border-gray-300 text-primary focus:ring-primary w-5 h-5"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <label
                          htmlFor={`employee-${employee.employeeId}`}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="font-semibold text-gray-900">{employee.name}</span>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">{employee.specialization}</div>
                        </label>
                        {selectedEmployees.includes(employee.employeeId) && (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    ))}
                    {employees.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p>No employees available</p>
                      </div>
                    )}
                    {selectedEmployees.length > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                        <p className="text-sm text-blue-900">
                          <strong>{selectedEmployees.length}</strong> employee{selectedEmployees.length > 1 ? 's' : ''} selected
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Select Main Representative */}
                {assignStep === 'select-representative' && (
                  <div className="space-y-3">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <p className="text-sm text-blue-900 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        You have selected <strong>{selectedEmployees.length}</strong> employees. 
                        Please choose one as the main representative.
                      </p>
                    </div>
                    {employees
                      .filter(emp => selectedEmployees.includes(emp.employeeId))
                      .map((employee) => (
                        <div
                          key={employee.employeeId}
                          className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            mainRepresentativeId === employee.employeeId
                              ? 'border-primary bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                          onClick={() => setMainRepresentativeId(employee.employeeId)}
                        >
                          <input
                            type="radio"
                            id={`main-rep-${employee.employeeId}`}
                            name="mainRepresentative"
                            checked={mainRepresentativeId === employee.employeeId}
                            onChange={() => setMainRepresentativeId(employee.employeeId)}
                            className="border-gray-300 text-primary focus:ring-primary w-5 h-5"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <label
                            htmlFor={`main-rep-${employee.employeeId}`}
                            className="flex-1 cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-500" />
                              <span className="font-semibold text-gray-900">{employee.name}</span>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">{employee.specialization}</div>
                          </label>
                          {mainRepresentativeId === employee.employeeId && (
                            <Badge className="bg-primary text-white">Main Representative</Badge>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </>
            )}
          </div>

          <DialogFooter className="flex-shrink-0 pt-4 border-t">
            {assignStep === 'select-employees' ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCloseAssignDialog}
                  disabled={assigning}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleNextToRepresentative}
                  disabled={selectedEmployees.length === 0}
                  className="bg-primary hover:bg-primary/90"
                >
                  Next: Select Representative
                  <Users className="h-4 w-4 ml-2" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={handleBackToEmployees}
                  disabled={assigning}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={() => handleAssignEmployees()}
                  disabled={assigning || !mainRepresentativeId}
                  className="bg-primary hover:bg-primary/90"
                >
                  {assigning ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Assigning...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Assign Employees
                    </>
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <ConfirmationDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        title="Reject Project"
        description={`Are you sure you want to reject and cancel the project "${projectToReject?.name}"? This action cannot be undone.`}
        confirmText="Reject Project"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleRejectConfirm}
      />
    </div>
  );
}


// Standard table component for all statuses
function StandardProjectTable({ 
  data, 
  status, 
  onAssignEmployees,
  onApprove,
  onReject,
  projects
}: { 
  data: Project[]; 
  status: ProjectStatus;
  onAssignEmployees?: (project: Project) => void;
  onApprove?: (project: Project) => void;
  onReject?: (project: Project) => void;
  projects?: Project[];
}) {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    // Fetch employees if we're showing IN_PROGRESS or COMPLETED projects
    if (status === "IN_PROGRESS" || status === "COMPLETED") {
      fetchEmployees();
    }
  }, [status]);

  const getAuthToken = () => {
    return localStorage.getItem("accessToken") || localStorage.getItem("token");
  };

  const fetchEmployees = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch(`${API_ENDPOINTS.EMPLOYEE.BASE}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const apiResponse = await response.json();
        const employeesData = Array.isArray(apiResponse.data) 
          ? apiResponse.data 
          : Array.isArray(apiResponse) 
          ? apiResponse 
          : [];
        setEmployees(employeesData);
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  const getEmployeeName = (employeeId: number) => {
    const employee = employees.find(e => e.employeeId === employeeId);
    return employee?.name || `Employee #${employeeId}`;
  };

  const getStatusIcon = (status: ProjectStatus) => {
    switch (status) {
      case "CREATED":
        return <FileText className="h-5 w-5 text-primary" />;
      case "RECOMMENDED":
        return <FolderOpen className="h-5 w-5 text-purple-600" />;
      case "CONFIRMED":
        return <CheckCircle2 className="h-5 w-5 text-indigo-600" />;
      case "IN_PROGRESS":
        return <PlayCircle className="h-5 w-5 text-primary" />;
      case "COMPLETED":
        return <Check className="h-5 w-5 text-green-600" />;
      case "CANCELLED":
        return <X className="h-5 w-5 text-red-600" />;
      default:
        return <FolderOpen className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case "CREATED":
        return "text-primary";
      case "RECOMMENDED":
        return "text-purple-600";
      case "CONFIRMED":
        return "text-indigo-600";
      case "IN_PROGRESS":
        return "text-primary";
      case "COMPLETED":
        return "text-green-600";
      case "CANCELLED":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const getStatusLabel = (status: ProjectStatus) => {
    if (status === "CREATED") {
      return "Pending";
    }
    return status.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  };

  return (
    <Card className="bg-white shadow-lg border-0">
      <CardHeader className="pb-4">
        <CardTitle
          className={`text-xl font-bold flex items-center gap-2 ${getStatusColor(status)}`}
        >
          {getStatusIcon(status)}
          {getStatusLabel(status)} Projects
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Scroll hint */}
        <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 text-xs text-blue-700 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
          Scroll horizontally to see all columns
        </div>
        <div className="overflow-x-auto overflow-y-visible scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <Table className="w-full table-auto">
            <TableHeader>
              <TableRow className="border-gray-200">
                <TableHead className="font-semibold text-gray-700 whitespace-nowrap min-w-[120px]">
                  Project Name
                </TableHead>
                <TableHead className="font-semibold text-gray-700 whitespace-nowrap w-[120px]">
                  Description
                </TableHead>
                <TableHead className="font-semibold text-gray-700 whitespace-nowrap min-w-[100px]">
                  Customer
                </TableHead>
                <TableHead className="font-semibold text-gray-700 whitespace-nowrap min-w-[90px]">
                  Start Date
                </TableHead>
                <TableHead className="font-semibold text-gray-700 whitespace-nowrap min-w-[90px]">
                  End Date
                </TableHead>
                <TableHead className="font-semibold text-gray-700 whitespace-nowrap min-w-[80px]">
                  Services
                </TableHead>
                {(status === "IN_PROGRESS" || status === "COMPLETED") && (
                  <TableHead className="font-semibold text-gray-700 whitespace-nowrap min-w-[150px]">
                    Employees
                  </TableHead>
                )}
                {(status === "CREATED" || status === "CONFIRMED" || status === "IN_PROGRESS") && (
                  <TableHead className="font-semibold text-gray-700 text-center whitespace-nowrap min-w-[140px]">
                    Actions
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((project) => (
                <TableRow
                  key={project.id}
                  className="align-top hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="font-medium py-3 text-gray-900 min-w-[120px]">
                    <div className="text-xs leading-tight whitespace-normal break-words max-w-[120px]">
                      {project.name}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 w-[120px]">
                    <div className="text-xs leading-tight whitespace-normal break-words text-gray-600 line-clamp-2 max-w-[120px]" title={project.description || "No description"}>
                      {project.description || "No description"}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-gray-900 whitespace-nowrap min-w-[100px]">
                    <div className="text-xs">{project.customerName}</div>
                  </TableCell>
                  <TableCell className="py-3 text-gray-600 whitespace-nowrap min-w-[90px]">
                    <div className="text-xs">{formatDate(project.startDate)}</div>
                  </TableCell>
                  <TableCell className="py-3 text-gray-600 whitespace-nowrap min-w-[90px]">
                    <div className="text-xs">{formatDate(project.endDate)}</div>
                  </TableCell>
                  <TableCell className="py-3 whitespace-nowrap min-w-[80px]">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-2 py-0"
                    >
                      {project.taskIds.length}
                    </Badge>
                  </TableCell>
                  {(status === "IN_PROGRESS" || status === "COMPLETED") && (
                    <TableCell className="py-3 min-w-[150px]">
                      {project.assignedEmployeeIds && project.assignedEmployeeIds.length > 0 ? (
                        <div className="space-y-1">
                          {project.assignedEmployeeIds.map((empId) => (
                            <div
                              key={empId}
                              className={`flex items-center gap-1 text-xs ${
                                empId === project.mainRepresentativeEmployeeId
                                  ? 'font-semibold text-primary'
                                  : 'text-gray-700'
                              }`}
                            >
                              <User className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{getEmployeeName(empId)}</span>
                              {empId === project.mainRepresentativeEmployeeId && (
                                <Badge variant="outline" className="text-[10px] px-1 py-0 bg-primary text-white border-primary">
                                  Lead
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">None</span>
                      )}
                    </TableCell>
                  )}
                  {(status === "CREATED" || status === "CONFIRMED" || status === "IN_PROGRESS") && (
                    <TableCell className="py-3 text-center min-w-[140px]">
                      <div className="flex gap-1 justify-center items-center whitespace-nowrap">
                        {status === "CREATED" && onApprove && onReject && (() => {
                          const hasEmployees = project.assignedEmployeeIds && project.assignedEmployeeIds.length > 0;
                          return (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onApprove(project)}
                                disabled={!hasEmployees}
                                title={!hasEmployees ? "Assign at least one employee before approving" : "Approve project"}
                                className={`h-7 w-7 p-0 rounded-full ${
                                  hasEmployees
                                    ? "bg-green-100 text-green-700 hover:bg-green-200 border border-green-300"
                                    : "bg-gray-100 text-gray-400 border border-gray-300 opacity-50"
                                }`}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onReject?.(project)}
                                className="h-7 w-7 p-0 bg-red-100 text-red-700 hover:bg-red-200 border border-red-300 rounded-full"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </>
                          );
                        })()}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onAssignEmployees?.(project)}
                          className="h-7 px-2 bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300 text-[10px] font-medium"
                        >
                          <UserPlus className="h-3 w-3 mr-1" />
                          Assign
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={
                    (status === "IN_PROGRESS" || status === "COMPLETED") 
                      ? 8 
                      : (status === "CREATED" || status === "CONFIRMED") 
                      ? 7 
                      : 6
                  }
                  className="text-center py-8 text-gray-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    {getStatusIcon(status)}
                    <span className="text-sm">No {getStatusLabel(status).toLowerCase()} projects found.</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </div>
      </CardContent>
    </Card>
  );
}
