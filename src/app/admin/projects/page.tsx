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

// Dummy data for the projects table
const projectsData = [
  {
    id: "#12345",
    customer: "Tech Solutions Inc.",
    service: "Software Development",
    assigned: ["Alex", "Sarah"],
    status: "In Progress",
    dueDate: "2024-08-15",
  },
  {
    id: "#12346",
    customer: "Global Innovations Ltd.",
    service: "IT Consulting",
    assigned: ["Michael"],
    status: "In Progress",
    dueDate: "2024-08-20",
  },
  {
    id: "#12347",
    customer: "Future Dynamics Corp.",
    service: "Web Design",
    assigned: ["Emily", "David"],
    status: "In Progress",
    dueDate: "2024-08-25",
  },
  {
    id: "#12348",
    customer: "Pinnacle Enterprises",
    service: "Mobile App Development",
    assigned: ["Jessica"],
    status: "In Progress",
    dueDate: "2024-09-01",
  },
  {
    id: "#12349",
    customer: "Strategic Ventures LLC",
    service: "Data Analysis",
    assigned: ["Ryan"],
    status: "In Progress",
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

        {/* We can render the same table component for each tab, in a real app you would filter the data */}
        <TabsContent value="pending-approval">
          <ProjectTable data={projectsData.slice(0, 2)} />{" "}
          {/* Showing partial data for variety */}
        </TabsContent>
        <TabsContent value="in-progress">
          <ProjectTable data={projectsData} />
        </TabsContent>
        <TabsContent value="awaiting-parts">
          <ProjectTable data={[]} /> {/* Example of an empty state */}
        </TabsContent>
        <TabsContent value="completed">
          <ProjectTable data={projectsData.slice(2, 3)} />
        </TabsContent>
        <TabsContent value="cancelled">
          <ProjectTable data={projectsData.slice(4, 5)} />
        </TabsContent>
      </Tabs>
    </>
  );
}

// Reusable component for the projects table
function ProjectTable({ data }: { data: typeof projectsData }) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Assigned Employee(s)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.id}</TableCell>
                <TableCell>{project.customer}</TableCell>
                <TableCell>{project.service}</TableCell>
                <TableCell>{project.assigned.join(", ")}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{project.status}</Badge>
                </TableCell>
                <TableCell>{project.dueDate}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No projects found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
