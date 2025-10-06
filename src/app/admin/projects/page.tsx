"use client";

import React from "react";
import { Card } from "@/components/ui/card";
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
import { Check, X } from "lucide-react";

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
  return (
    <>
      <h1 className="text-3xl font-bold mb-6 mt-6">Manage Projects</h1>

      <Tabs defaultValue="in-progress" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="pending-approval">Pending Approval</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="awaiting-parts">Awaiting Parts</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value="pending-approval">
          <PendingApprovalTable
            data={projectsData.filter((p) => p.status === "Pending Approval")}
          />
        </TabsContent>
        <TabsContent value="in-progress">
          <StandardProjectTable
            data={projectsData.filter((p) => p.status === "In Progress")}
          />
        </TabsContent>
        <TabsContent value="awaiting-parts">
          <StandardProjectTable
            data={projectsData.filter((p) => p.status === "Awaiting Parts")}
          />
        </TabsContent>
        <TabsContent value="completed">
          <StandardProjectTable
            data={projectsData.filter((p) => p.status === "Completed")}
          />
        </TabsContent>
        <TabsContent value="cancelled">
          <StandardProjectTable
            data={projectsData.filter((p) => p.status === "Cancelled")}
          />
        </TabsContent>
      </Tabs>
    </>
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
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Estimated Hours</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Assigned Employee(s)</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">
                  {project.projectName}
                </TableCell>
                <TableCell className="max-w-xs">
                  <div className="truncate" title={project.description}>
                    {project.description}
                  </div>
                </TableCell>
                <TableCell>{project.estimatedHours}h</TableCell>
                <TableCell>{project.customer}</TableCell>
                <TableCell>{project.vehicle}</TableCell>
                <TableCell>{project.assigned.join(", ")}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleApprove(project.id)}
                      className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReject(project.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No projects pending approval.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}

// Standard table component for other statuses (In Progress, Awaiting Parts, Completed, Cancelled)
function StandardProjectTable({ data }: { data: typeof projectsData }) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Estimated Hours</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Assigned Employee(s)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">
                  {project.projectName}
                </TableCell>
                <TableCell className="max-w-xs">
                  <div className="truncate" title={project.description}>
                    {project.description}
                  </div>
                </TableCell>
                <TableCell>{project.estimatedHours}h</TableCell>
                <TableCell>{project.customer}</TableCell>
                <TableCell>{project.vehicle}</TableCell>
                <TableCell>{project.assigned.join(", ")}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No projects found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
