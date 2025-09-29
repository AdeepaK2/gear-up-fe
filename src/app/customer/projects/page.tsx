"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Car,
  Calendar,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  Settings,
} from "lucide-react";
import ServiceCard from "@/components/customer/ServiceCard";
import ProjectSummary from "@/components/customer/ProjectSummary";
import AdditionalServiceRequest from "@/components/customer/AdditionalServiceRequest";
import { ProjectData, Service, ProjectStatus } from "@/lib/types/Project";
import { cn } from "@/lib/utils";

// Mock data - replace with actual API call
const mockProject: ProjectData = {
  id: "proj_001",
  appointmentId: "apt_001",
  customerId: "cust_001",
  vehicleId: "veh_001",
  vehicleName: "2020 Toyota Camry",
  vehicleDetails: "License: ABC-123",
  consultationType: "general-checkup",
  consultationDate: "2025-10-15",
  employeeId: "emp_001",
  employeeName: "John Smith",
  status: "waiting-confirmation",
  services: [
    {
      id: "srv_001",
      name: "Engine Oil Change",
      description:
        "Replace engine oil and filter with high-quality synthetic oil. Includes inspection of oil levels and engine condition.",
      estimatedDuration: "45 minutes",
      estimatedCost: 75.0,
      status: "recommended",
      category: "Maintenance",
      priority: "high",
      notes:
        "Due for oil change based on mileage. Recommend synthetic oil for better engine protection.",
      requestedBy: "employee",
      createdAt: "2025-10-15T10:00:00Z",
    },
    {
      id: "srv_002",
      name: "Brake Pad Replacement",
      description:
        "Replace front brake pads with OEM parts. Includes rotor inspection and brake fluid level check.",
      estimatedDuration: "2 hours",
      estimatedCost: 320.0,
      status: "recommended",
      category: "Safety",
      priority: "medium",
      notes:
        "Front brake pads are at 20% remaining. Recommend replacement soon for optimal braking performance.",
      requestedBy: "employee",
      createdAt: "2025-10-15T10:00:00Z",
    },
    {
      id: "srv_003",
      name: "Air Filter Replacement",
      description:
        "Replace engine air filter to improve air flow and engine efficiency.",
      estimatedDuration: "20 minutes",
      estimatedCost: 45.0,
      status: "recommended",
      category: "Maintenance",
      priority: "low",
      notes:
        "Air filter is moderately dirty. Replacement will improve fuel efficiency.",
      requestedBy: "employee",
      createdAt: "2025-10-15T10:00:00Z",
    },
    {
      id: "srv_004",
      name: "Battery Test & Clean",
      description:
        "Test battery performance and clean battery terminals for optimal electrical connection.",
      estimatedDuration: "30 minutes",
      estimatedCost: 25.0,
      status: "recommended",
      category: "Electrical",
      priority: "low",
      requestedBy: "employee",
      createdAt: "2025-10-15T10:00:00Z",
    },
  ],
  additionalRequests: [],
  totalEstimatedCost: 465.0,
  totalAcceptedCost: 0,
  acceptedServicesCount: 0,
  createdAt: "2025-10-15T10:00:00Z",
  updatedAt: "2025-10-15T10:00:00Z",
};

const projectStatusConfig: Record<
  ProjectStatus,
  {
    label: string;
    color: string;
    bgColor: string;
    icon: React.ReactNode;
  }
> = {
  "waiting-confirmation": {
    label: "Waiting for Confirmation",
    color: "text-yellow-700",
    bgColor: "bg-yellow-50 border-yellow-200",
    icon: <Clock className="h-5 w-5" />,
  },
  confirmed: {
    label: "Confirmed",
    color: "text-blue-700",
    bgColor: "bg-blue-50 border-blue-200",
    icon: <CheckCircle className="h-5 w-5" />,
  },
  "in-progress": {
    label: "In Progress",
    color: "text-orange-700",
    bgColor: "bg-orange-50 border-orange-200",
    icon: <Settings className="h-5 w-5" />,
  },
  completed: {
    label: "Completed",
    color: "text-green-700",
    bgColor: "bg-green-50 border-green-200",
    icon: <CheckCircle className="h-5 w-5" />,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-700",
    bgColor: "bg-red-50 border-red-200",
    icon: <X className="h-5 w-5" />,
  },
};

export default function ProjectsPage() {
  const [project, setProject] = useState<ProjectData>(mockProject);
  const [isLoading, setIsLoading] = useState(false);

  const statusInfo = projectStatusConfig[project.status];
  const acceptedServices = project.services.filter(
    (s) => s.status === "accepted"
  );
  const totalAcceptedCost = acceptedServices.reduce(
    (sum, service) => sum + service.estimatedCost,
    0
  );

  const handleServiceAccept = async (serviceId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProject((prev) => ({
        ...prev,
        services: prev.services.map((service) =>
          service.id === serviceId
            ? { ...service, status: "accepted" as const }
            : service
        ),
        updatedAt: new Date().toISOString(),
      }));
    } catch (error) {
      console.error("Error accepting service:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceReject = async (serviceId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProject((prev) => ({
        ...prev,
        services: prev.services.map((service) =>
          service.id === serviceId
            ? { ...service, status: "rejected" as const }
            : service
        ),
        updatedAt: new Date().toISOString(),
      }));
    } catch (error) {
      console.error("Error rejecting service:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmServices = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setProject((prev) => ({
        ...prev,
        status: "confirmed",
        totalAcceptedCost,
        acceptedServicesCount: acceptedServices.length,
        updatedAt: new Date().toISOString(),
      }));
    } catch (error) {
      console.error("Error confirming services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdditionalServiceRequest = async (request: {
    customRequest: string;
    referenceFile?: File;
  }) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newService: Service = {
        id: `srv_${Date.now()}`,
        name: "Custom Service Request",
        description: request.customRequest,
        estimatedDuration: "TBD",
        estimatedCost: 0,
        status: "requested",
        category: "Custom",
        requestedBy: "customer",
        createdAt: new Date().toISOString(),
      };

      setProject((prev) => ({
        ...prev,
        services: [...prev.services, newService],
        updatedAt: new Date().toISOString(),
      }));
    } catch (error) {
      console.error("Error submitting additional service request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelProject = async () => {
    if (acceptedServices.length > 0) {
      alert(
        "Cannot cancel project with accepted services. Please reject all services first."
      );
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProject((prev) => ({
        ...prev,
        status: "cancelled",
        updatedAt: new Date().toISOString(),
      }));
    } catch (error) {
      console.error("Error cancelling project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Details</h1>
          <p className="text-gray-600 mt-1">
            Review and manage your vehicle service project
          </p>
        </div>
      </div>

      {/* Project Overview */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-primary to-secondary text-white">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xl font-bold">Project Overview</div>
              <div className="text-sm text-white/90 font-normal">
                Based on your consultation on{" "}
                {new Date(project.consultationDate).toLocaleDateString()}
              </div>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <Car className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold text-gray-900">
                  {project.vehicleName}
                </p>
                <p className="text-sm text-gray-600">
                  {project.vehicleDetails}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="h-8 w-8 text-green-600" />
              <div>
                <p className="font-semibold text-gray-900">
                  {project.employeeName}
                </p>
                <p className="text-sm text-gray-600">Your Technician</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <p className="font-semibold text-gray-900">
                  {new Date(project.consultationDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">Consultation Date</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", statusInfo.bgColor)}>
                <div className={statusInfo.color}>{statusInfo.icon}</div>
              </div>
              <div>
                <Badge
                  className={cn(
                    "border-2",
                    statusInfo.color,
                    statusInfo.bgColor
                  )}
                >
                  {statusInfo.label}
                </Badge>
                <p className="text-sm text-gray-600 mt-1">Current Status</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Services */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Recommended Services
          </h2>
          <Badge variant="secondary" className="text-sm">
            {project.services.filter((s) => s.status === "recommended").length}{" "}
            services pending review
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {project.services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onAccept={handleServiceAccept}
              onReject={handleServiceReject}
              isLoading={isLoading}
              disabled={project.status !== "waiting-confirmation"}
            />
          ))}
        </div>
      </div>

      {/* Additional Service Request */}
      {project.status === "waiting-confirmation" && (
        <AdditionalServiceRequest
          onSubmit={handleAdditionalServiceRequest}
          isLoading={isLoading}
          disabled={project.status !== "waiting-confirmation"}
        />
      )}

      {/* Project Summary */}
      <ProjectSummary
        acceptedServices={acceptedServices}
        totalCost={totalAcceptedCost}
        onConfirmServices={handleConfirmServices}
        isLoading={isLoading}
        disabled={
          project.status !== "waiting-confirmation" ||
          acceptedServices.length === 0
        }
      />

      {/* Project Actions */}
      {project.status === "waiting-confirmation" &&
        acceptedServices.length === 0 && (
          <Card className="border-2 border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900">
                    No Services Selected
                  </h3>
                  <p className="text-red-700 text-sm">
                    If you don't need any of the recommended services, you can
                    cancel this project.
                  </p>
                </div>
                <Button
                  onClick={handleCancelProject}
                  variant="destructive"
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel Project
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
