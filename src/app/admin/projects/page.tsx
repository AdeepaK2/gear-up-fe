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
import { Check, X, FolderOpen, Loader2, AlertCircle, RefreshCw, FileText, CheckCircle2, PlayCircle, UserPlus, Users, Clock, User } from "lucide-react";
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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [assigning, setAssigning] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
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
        
      setProjects(projectsData);
      
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
    setSelectedEmployees([]);
    setAssignDialogOpen(true);
    if (employees.length === 0) {
      fetchEmployees();
    }
  };

  const handleCloseAssignDialog = () => {
    setAssignDialogOpen(false);
    setSelectedProject(null);
    setSelectedEmployees([]);
  };

  const handleToggleEmployee = (employeeId: number) => {
    setSelectedEmployees(prev =>
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleAssignEmployees = async () => {
    if (!selectedProject || selectedEmployees.length === 0) {
      toast.error("Please select at least one employee");
      return;
    }

    setAssigning(true);
    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error("Please login to continue");
      }

      const response = await fetch(
        `${API_ENDPOINTS.PROJECTS.BASE}/${selectedProject.id}/assign-employees`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ employeeIds: selectedEmployees }),
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

      toast.success(`Successfully assigned ${selectedEmployees.length} employee(s) to ${selectedProject.name}`);
      handleCloseAssignDialog();
      
      // Refresh projects list to reflect changes
      await fetchProjects();
    } catch (err: any) {
      toast.error(err.message || "Failed to assign employees");
      console.error("Error assigning employees:", err);
    } finally {
      setAssigning(false);
    }
  };

  const getStatusCounts = () => {
    return {
      created: projects.filter((p) => p.status === "CREATED").length,
      recommended: projects.filter((p) => p.status === "RECOMMENDED").length,
      confirmed: projects.filter((p) => p.status === "CONFIRMED").length,
      inProgress: projects.filter((p) => p.status === "IN_PROGRESS").length,
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
                    Created
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

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 text-base font-semibold mb-1">
                    Recommended
                  </p>
                  <div className="text-4xl font-extrabold text-purple-600">
                    {statusCounts.recommended}
                  </div>
                </div>
                <div className="p-3 bg-purple-600 rounded-lg shadow-sm">
                  <FolderOpen className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 text-base font-semibold mb-1">
                    Confirmed
                  </p>
                  <div className="text-4xl font-extrabold text-indigo-600">
                    {statusCounts.confirmed}
                  </div>
                </div>
                <div className="p-3 bg-indigo-600 rounded-lg shadow-sm">
                  <CheckCircle2 className="h-8 w-8 text-white" />
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
        <Tabs defaultValue="in-progress" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-gray-100">
            <TabsTrigger
              value="created"
              className="data-[state=active]:bg-white data-[state=active]:text-primary"
            >
              Created
            </TabsTrigger>
            <TabsTrigger
              value="recommended"
              className="data-[state=active]:bg-white data-[state=active]:text-purple-600"
            >
              Recommended
            </TabsTrigger>
            <TabsTrigger
              value="confirmed"
              className="data-[state=active]:bg-white data-[state=active]:text-indigo-600"
            >
              Confirmed
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

          <TabsContent value="created" className="mt-6">
            <StandardProjectTable
              data={projects.filter((p) => p.status === "CREATED")}
              status="CREATED"
            />
          </TabsContent>
          <TabsContent value="recommended" className="mt-6">
            <StandardProjectTable
              data={projects.filter((p) => p.status === "RECOMMENDED")}
              status="RECOMMENDED"
            />
          </TabsContent>
          <TabsContent value="confirmed" className="mt-6">
            <StandardProjectTable
              data={projects.filter((p) => p.status === "CONFIRMED")}
              status="CONFIRMED"
              onAssignEmployees={handleOpenAssignDialog}
            />
          </TabsContent>
          <TabsContent value="in-progress" className="mt-6">
            <StandardProjectTable
              data={projects.filter((p) => p.status === "IN_PROGRESS")}
              status="IN_PROGRESS"
              onAssignEmployees={handleOpenAssignDialog}
            />
          </TabsContent>
          <TabsContent value="completed" className="mt-6">
            <StandardProjectTable
              data={projects.filter((p) => p.status === "COMPLETED")}
              status="COMPLETED"
            />
          </TabsContent>
          <TabsContent value="cancelled" className="mt-6">
            <StandardProjectTable
              data={projects.filter((p) => p.status === "CANCELLED")}
              status="CANCELLED"
            />
          </TabsContent>
        </Tabs>
        </div>
      )}

      {/* Employee Assignment Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={handleCloseAssignDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Employees</DialogTitle>
            <DialogDescription>
              Select employees to assign to the project: {selectedProject?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {loadingEmployees ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading employees...
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {employees.map((employee) => (
                  <div
                    key={employee.employeeId}
                    className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      id={`employee-${employee.employeeId}`}
                      checked={selectedEmployees.includes(employee.employeeId)}
                      onChange={() => handleToggleEmployee(employee.employeeId)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label
                      htmlFor={`employee-${employee.employeeId}`}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-sm text-gray-500">{employee.specialization}</div>
                    </label>
                  </div>
                ))}
                {employees.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No employees available
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseAssignDialog}
              disabled={assigning}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssignEmployees}
              disabled={assigning || selectedEmployees.length === 0}
            >
              {assigning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Assigning...
                </>
              ) : (
                'Assign Employees'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


// Standard table component for all statuses
function StandardProjectTable({ 
  data, 
  status, 
  onAssignEmployees 
}: { 
  data: Project[]; 
  status: ProjectStatus;
  onAssignEmployees?: (project: Project) => void;
}) {
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
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200">
              <TableHead className="font-semibold text-gray-700">
                Project Name
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Description
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Customer
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Start Date
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                End Date
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Services
              </TableHead>
              {(status === "CONFIRMED" || status === "IN_PROGRESS") && (
                <TableHead className="font-semibold text-gray-700 text-center">
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
                  <TableCell className="font-medium py-4 text-gray-900">
                    <div className="text-sm leading-relaxed whitespace-normal break-words">
                      {project.name}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-48 py-4">
                    <div className="text-sm leading-relaxed whitespace-normal break-words text-gray-600">
                      {project.description || "No description"}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-gray-900">
                    {project.customerName}
                  </TableCell>
                  <TableCell className="py-4 text-gray-600">
                    {formatDate(project.startDate)}
                  </TableCell>
                  <TableCell className="py-4 text-gray-600">
                    {formatDate(project.endDate)}
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {project.taskIds.length} services
                    </Badge>
                  </TableCell>
                  {(status === "CONFIRMED" || status === "IN_PROGRESS") && (
                    <TableCell className="py-4 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAssignEmployees?.(project)}
                        className="flex items-center gap-2"
                      >
                        <UserPlus className="h-4 w-4" />
                        Assign
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={(status === "CONFIRMED" || status === "IN_PROGRESS") ? 7 : 6}
                  className="text-center py-8 text-gray-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    {getStatusIcon(status)}
                    <span>No {getStatusLabel(status).toLowerCase()} projects found.</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
