"use client";

import React from "react";
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
import { Button } from "@/components/ui/button";
import { Check, X, FolderOpen, Clock, User, Car } from "lucide-react";

// Updated dummy data for the projects table with new structure
const projectsData = [
  {
    id: "#12345",
    projectName: "E-commerce Website Development",
    description:
      "Complete redesign and development of e-commerce platform with payment integration",
    estimatedHours: 120,
    customer: "Tech Solutions Inc.",
    vehicle: "N/A", // Some projects might not involve vehicles
    assigned: ["Alex Johnson", "Sarah Wilson"],
    status: "Pending Approval",
    dueDate: "2024-08-15",
  },
  {
    id: "#12346",
    projectName: "Vehicle Diagnostics System",
    description:
      "Install and configure advanced diagnostics equipment for BMW X5",
    estimatedHours: 8,
    customer: "Global Innovations Ltd.",
    vehicle: "BMW X5 2023",
    assigned: ["Michael Brown"],
    status: "In Progress",
    dueDate: "2024-08-20",
  },
  {
    id: "#12347",
    projectName: "Engine Overhaul",
    description: "Complete engine rebuild and performance optimization",
    estimatedHours: 40,
    customer: "Future Dynamics Corp.",
    vehicle: "Toyota Camry 2020",
    assigned: ["Emily Davis", "David Martinez"],
    status: "Awaiting Parts",
    dueDate: "2024-08-25",
  },
  {
    id: "#12348",
    projectName: "Brake System Upgrade",
    description: "Install high-performance brake system and safety checks",
    estimatedHours: 6,
    customer: "Pinnacle Enterprises",
    vehicle: "Ford F-150 2022",
    assigned: ["Jessica Lee"],
    status: "Completed",
    dueDate: "2024-09-01",
  },
  {
    id: "#12349",
    projectName: "Transmission Repair",
    description: "Automatic transmission rebuild and testing",
    estimatedHours: 24,
    customer: "Strategic Ventures LLC",
    vehicle: "Honda Accord 2019",
    assigned: ["Ryan Thompson"],
    status: "Cancelled",
    dueDate: "2024-09-05",
  },
];

export default function ProjectsPage() {
  const getStatusCounts = () => {
    return {
      pending: projectsData.filter((p) => p.status === "Pending Approval")
        .length,
      inProgress: projectsData.filter((p) => p.status === "In Progress").length,
      awaitingParts: projectsData.filter((p) => p.status === "Awaiting Parts")
        .length,
      completed: projectsData.filter((p) => p.status === "Completed").length,
      cancelled: projectsData.filter((p) => p.status === "Cancelled").length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          Manage Projects
        </h1>
        <p className="text-lg text-gray-600">
          Track and manage all the projects
        </p>
      </div>

      {/* Stats Cards */}
      <div className="space-y-6">
        {/* First Row - 3 Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 text-base font-semibold mb-1">
                    Pending Approval
                  </p>
                  <div className="text-4xl font-extrabold text-primary">
                    {statusCounts.pending}
                  </div>
                </div>
                <div className="p-3 bg-primary rounded-lg shadow-sm">
                  <Clock className="h-8 w-8 text-white" />
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
                  <FolderOpen className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 text-base font-semibold mb-1">
                    Awaiting Parts
                  </p>
                  <div className="text-4xl font-extrabold text-primary">
                    {statusCounts.awaitingParts}
                  </div>
                </div>
                <div className="p-3 bg-primary rounded-lg shadow-sm">
                  <Car className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Second Row - 2 Cards (Same width as first row cards, centered) */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 text-base font-semibold mb-1">
                    Completed
                  </p>
                  <div className="text-4xl font-extrabold text-primary">
                    {statusCounts.completed}
                  </div>
                </div>
                <div className="p-3 bg-primary rounded-lg shadow-sm">
                  <Check className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 text-base font-semibold mb-1">
                    Cancelled
                  </p>
                  <div className="text-4xl font-extrabold text-primary">
                    {statusCounts.cancelled}
                  </div>
                </div>
                <div className="p-3 bg-primary rounded-lg shadow-sm">
                  <X className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-16">
        <Tabs defaultValue="in-progress" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gray-100">
            <TabsTrigger
              value="pending-approval"
              className="data-[state=active]:bg-white data-[state=active]:text-orange-600"
            >
              Pending Approval
            </TabsTrigger>
            <TabsTrigger
              value="in-progress"
              className="data-[state=active]:bg-white data-[state=active]:text-primary"
            >
              In Progress
            </TabsTrigger>
            <TabsTrigger
              value="awaiting-parts"
              className="data-[state=active]:bg-white data-[state=active]:text-yellow-600"
            >
              Awaiting Parts
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

          <TabsContent value="pending-approval" className="mt-6">
            <PendingApprovalTable
              data={projectsData.filter((p) => p.status === "Pending Approval")}
            />
          </TabsContent>
          <TabsContent value="in-progress" className="mt-6">
            <StandardProjectTable
              data={projectsData.filter((p) => p.status === "In Progress")}
            />
          </TabsContent>
          <TabsContent value="awaiting-parts" className="mt-6">
            <StandardProjectTable
              data={projectsData.filter((p) => p.status === "Awaiting Parts")}
            />
          </TabsContent>
          <TabsContent value="completed" className="mt-6">
            <StandardProjectTable
              data={projectsData.filter((p) => p.status === "Completed")}
            />
          </TabsContent>
          <TabsContent value="cancelled" className="mt-6">
            <StandardProjectTable
              data={projectsData.filter((p) => p.status === "Cancelled")}
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
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
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
    switch (status) {
      case "In Progress":
        return <FolderOpen className="h-5 w-5 text-primary" />;
      case "Awaiting Parts":
        return <Car className="h-5 w-5 text-yellow-600" />;
      case "Completed":
        return <Check className="h-5 w-5 text-green-600" />;
      case "Cancelled":
        return <X className="h-5 w-5 text-red-600" />;
      default:
        return <FolderOpen className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "text-primary";
      case "Awaiting Parts":
        return "text-yellow-600";
      case "Completed":
        return "text-green-600";
      case "Cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const status = data[0]?.status || "Projects";

  return (
    <Card className="bg-white shadow-lg border-0">
      <CardHeader className="pb-4">
        <CardTitle
          className={`text-xl font-bold flex items-center gap-2 ${getStatusColor(
            status
          )}`}
        >
          {getStatusIcon(status)}
          {status} Projects
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
                  <TableCell className="py-4">
                    <div className="text-sm leading-relaxed whitespace-normal break-words text-gray-700 flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {project.assigned.join(", ")}
                    </div>
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
                    <span>No {status.toLowerCase()} projects found.</span>
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
