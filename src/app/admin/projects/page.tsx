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
import { Check, X, FolderOpen, Loader2, AlertCircle, RefreshCw, FileText, CheckCircle2, PlayCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/contexts/ToastContext";

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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/projects`, {
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
        throw new Error("Failed to fetch projects");
      }

      const apiResponse = await response.json();
      setProjects(apiResponse.data);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to load projects";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
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
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Manage Projects
        </h1>
        <p className="text-lg text-gray-600">
          Track and manage all the projects
        </p>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
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
            />
          </TabsContent>
          <TabsContent value="in-progress" className="mt-6">
            <StandardProjectTable
              data={projects.filter((p) => p.status === "IN_PROGRESS")}
              status="IN_PROGRESS"
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
    </div>
  );
}

// Table component for Pending Approval with Actions column
function PendingApprovalTable({ data }: { data: typeof projectsData }) {
  const handleApprove = (projectId: string) => {
    console.log(`Approving project ${projectId}`);
    // Here you would make an API call to approve the project
  };

  const handleReject = (projectId: string) => {
    console.log(`Rejecting project ${projectId}`);
    // Here you would make an API call to reject the project
  };

  return (
    <Card className="bg-white shadow-lg border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-orange-600 flex items-center gap-2">
          <Clock className="h-5 w-5 text-orange-600" />
          Projects Pending Approval
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
                Estimated Hours
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Customer
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Vehicle
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Assigned Employee(s)
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-700">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((project) => (
                <TableRow
                  key={project.id}
                  className="align-top hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="font-medium py-4 max-w-40">
                    <div className="text-sm leading-relaxed whitespace-normal break-words text-gray-900">
                      {project.projectName}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-48 py-4">
                    <div className="text-sm leading-relaxed whitespace-normal break-words text-gray-600">
                      {project.description}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {project.estimatedHours}h
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 text-gray-900">
                    {project.customer}
                  </TableCell>
                  <TableCell className="py-4 text-gray-600">
                    {project.vehicle}
                  </TableCell>
                  <TableCell className="py-4 max-w-36">
                    <div className="text-sm leading-relaxed whitespace-normal break-words text-gray-700 flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {project.assigned.join(", ")}
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-4">
                    <div className="flex gap-3 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleApprove(project.id)}
                        className="h-10 w-10 p-0 bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 border border-green-300 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <Check className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReject(project.id)}
                        className="h-10 w-10 p-0 bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800 border border-red-300 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Clock className="h-8 w-8 text-gray-300" />
                    <span>No projects pending approval.</span>
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

// Standard table component for other statuses (In Progress, Awaiting Parts, Completed, Cancelled)
function StandardProjectTable({ data }: { data: typeof projectsData }) {
  const getStatusIcon = (status: string) => {
// Standard table component for all statuses
function StandardProjectTable({ data, status }: { data: Project[]; status: ProjectStatus }) {
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
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
