"use client"; // This is a client component to manage the dialog state

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, PlusCircle } from "lucide-react";

// Dummy data for the services table
const servicesData = [
  {
    id: "#12345",
    name: "Tech Solutions Inc.",
    type: "Software Development",
    hours: "In Progress",
    created: "2024-08-15",
  },
  {
    id: "#12346",
    name: "Global Innovations Ltd.",
    type: "IT Consulting",
    hours: "In Progress",
    created: "2024-08-20",
  },
  {
    id: "#12347",
    name: "Future Dynamics Corp.",
    type: "Web Design",
    hours: "In Progress",
    created: "2024-08-25",
  },
  {
    id: "#12348",
    name: "Pinnacle Enterprises",
    type: "Mobile App Development",
    hours: "In Progress",
    created: "2024-09-01",
  },
  {
    id: "#12349",
    name: "Strategic Ventures LLC",
    type: "Data Analysis",
    hours: "In Progress",
    created: "2024-09-05",
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6 mt-6">
        <h1 className="text-3xl font-bold">Manage Services</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Service
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
              <DialogDescription>
                Fill in the details for the new service. Click save when you're
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  placeholder="Enter a description"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Service Type
                </Label>
                <Input
                  id="type"
                  placeholder="Choose the service type"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Input
                  id="status"
                  placeholder="Enter your role"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="hours" className="text-right">
                  Estimated Hours
                </Label>
                <Input
                  id="hours"
                  placeholder="Enter the estimated hours"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Service</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="search"
          placeholder="Search services"
          className="pl-10 w-full max-w-sm"
        />
      </div>

      {/* Services Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service Name</TableHead>
              <TableHead>Service Type</TableHead>
              <TableHead>Estimated Hours</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {servicesData.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">{service.id}</TableCell>
                <TableCell>{service.name}</TableCell>
                <TableCell>{service.type}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{service.hours}</Badge>
                </TableCell>
                <TableCell>{service.created}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="link"
                    className="text-red-600 hover:text-red-800 px-0"
                  >
                    Delete Service
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
