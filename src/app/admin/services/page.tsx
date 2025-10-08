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
        <h1 className="text-3xl font-bold tracking-tight text-primary">
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
          <DialogContent className="sm:max-w-[520px] bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-2xl backdrop-blur-sm">
            <div className="relative">
              {/* Decorative accent */}
              <div className="absolute -top-6 -left-6 w-20 h-20 bg-blue-200/30 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-blue-100/40 rounded-full blur-lg"></div>

              <DialogHeader className="space-y-4 pb-6 border-b border-blue-200/30">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <PlusCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold text-gray-900 tracking-tight">
                      Add New Service
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 mt-1 text-base">
                      Create a new service offering for your customers
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="py-8 space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Service Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter service name (e.g., Oil Change Service)"
                    className="h-12 border-gray-200 focus:border-primary focus:ring-primary/20 bg-white/70 backdrop-blur-sm transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="type"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Service Type
                  </Label>
                  <Input
                    id="type"
                    placeholder="Enter service category (e.g., Maintenance, Repair)"
                    className="h-12 border-gray-200 focus:border-primary focus:ring-primary/20 bg-white/70 backdrop-blur-sm transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="hours"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Estimated Hours
                  </Label>
                  <Input
                    id="hours"
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder="Enter estimated duration (e.g., 2.5)"
                    className="h-12 border-gray-200 focus:border-primary focus:ring-primary/20 bg-white/70 backdrop-blur-sm transition-all duration-200"
                  />
                </div>
              </div>

              <DialogFooter className="border-t border-blue-200/30 pt-6 gap-3">
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-12 px-8 bg-gradient-to-r from-red-50 to-red-100 border-red-200 text-red-700 hover:from-red-100 hover:to-red-200 hover:border-red-300 hover:text-red-900 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </Button>
                </DialogTrigger>
                <Button
                  type="submit"
                  className="h-12 px-8 bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                >
                  Add Service
                </Button>
              </DialogFooter>
            </div>
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
