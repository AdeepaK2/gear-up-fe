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
    name: "Oil Change Service",
    type: "Maintenance",
    hours: "2",
    created: "2024-08-15",
  },
  {
    id: "#12346",
    name: "Brake Inspection",
    type: "Safety Check",
    hours: "1.5",
    created: "2024-08-20",
  },
  {
    id: "#12347",
    name: "Engine Diagnostic",
    type: "Diagnostic",
    hours: "3",
    created: "2024-08-25",
  },
  {
    id: "#12348",
    name: "Tire Rotation",
    type: "Maintenance",
    hours: "1",
    created: "2024-09-01",
  },
  {
    id: "#12349",
    name: "Transmission Service",
    type: "Repair",
    hours: "4",
    created: "2024-09-05",
  },
];

export default function ServicesPage() {
  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          Manage Services
        </h1>
        <p className="text-lg text-gray-600">
          Create and manage vehicle services and maintenance options
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Search for a service"
            className="pl-12 w-96 h-12 text-base"
          />
        </div>

        {/* Add Service Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 h-12 px-6 text-base font-semibold">
              <PlusCircle className="mr-3 h-7 w-7" />
              Add New Service
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
              <DialogDescription>
                Fill in the details for the new service. Click add service when
                you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Service Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter service name"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Service Type
                </Label>
                <Input
                  id="type"
                  placeholder="Enter service type"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="hours" className="text-right">
                  Estimated Hours
                </Label>
                <Input
                  id="hours"
                  placeholder="Enter estimated hours"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Add Service
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Services Table */}
      <Card className="bg-white shadow-lg border-0">
        <div className="p-6">
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900">
              All Services
            </h3>
            <p className="text-gray-600 text-md">
              Manage and organize your vehicle service offerings
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200">
                <TableHead className="font-semibold text-gray-700">
                  Service ID
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Service Name
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Service Type
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Estimated Hours
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Created Date
                </TableHead>
                <TableHead className="text-center font-semibold text-gray-700">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {servicesData.map((service) => (
                <TableRow
                  key={service.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="font-medium py-6 text-gray-900">
                    {service.id}
                  </TableCell>
                  <TableCell className="py-6 text-gray-900 font-medium">
                    {service.name}
                  </TableCell>
                  <TableCell className="py-6">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {service.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-6 text-gray-700">
                    {service.hours}h
                  </TableCell>
                  <TableCell className="py-6 text-gray-700">
                    {service.created}
                  </TableCell>
                  <TableCell className="text-center py-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      Delete Service
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
