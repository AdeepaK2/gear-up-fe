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
  Wrench,
  UserCog,
  CalendarCheck,
  Activity,
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
      estimatedCost: 15000.0,
      status: "accepted",
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
      estimatedCost: 45000.0,
      status: "accepted",
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
      estimatedCost: 8500.0,
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
      estimatedCost: 5000.0,
      status: "recommended",
      category: "Electrical",
      priority: "low",
      requestedBy: "employee",
      createdAt: "2025-10-15T10:00:00Z",
    },
  ],
  additionalRequests: [],
  totalEstimatedCost: 73500.0,
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
    color: "text-gray-600",
    bgColor: "bg-gray-50 border-gray-300",
    icon: <Clock className="h-5 w-5" />,
  },
  confirmed: {
    label: "Confirmed",
    color: "text-primary",
    bgColor: "bg-primary/20 border-primary/50",
    icon: <CheckCircle className="h-5 w-5" />,
  },
  "in-progress": {
    label: "In Progress",
    color: "text-primary",
    bgColor: "bg-primary/30 border-primary/60",
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

// Currency formatting function for LKR
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
  }).format(amount);
};

// Service Progress Component
const ServiceProgressBadge = ({
  status,
  progress,
}: {
  status: string;
  progress: "not-started" | "in-progress" | "completed" | undefined;
}) => {
  if (status !== "accepted") return null;

  const progressConfig = {
    "not-started": {
      label: "Not Started",
      color: "bg-gray-50 text-gray-700 border-gray-200",
    },
    "in-progress": {
      label: "In Progress",
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    completed: {
      label: "Completed",
      color: "bg-green-50 text-green-700 border-green-200",
    },
  };

  const config = progressConfig[progress || "not-started"];

  return (
    <Badge variant="outline" className={`${config.color} border-2 font-medium`}>
      {config.label}
    </Badge>
  );
};

export default function ProjectsPage() {
  const [project, setProject] = useState<ProjectData>(mockProject);
  const [isLoading, setIsLoading] = useState(false);
  const [serviceProgress, setServiceProgress] = useState<
    Record<string, "not-started" | "in-progress" | "completed">
  >({});

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

      // Initialize service progress as not-started
      setServiceProgress((prev) => ({
        ...prev,
        [serviceId]: "not-started",
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

  const handleServiceCancel = async (serviceId: string) => {
    const service = project.services.find((s) => s.id === serviceId);
    const progress = serviceProgress[serviceId] || "not-started";

    if (progress !== "not-started") {
      alert("Cannot cancel a service that has already started.");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to cancel "${service?.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProject((prev) => ({
        ...prev,
        services: prev.services.map((service) =>
          service.id === serviceId
            ? { ...service, status: "cancelled" as const }
            : service
        ),
        updatedAt: new Date().toISOString(),
      }));

      // Remove from progress tracking
      setServiceProgress((prev) => {
        const newProgress = { ...prev };
        delete newProgress[serviceId];
        return newProgress;
      });
    } catch (error) {
      console.error("Error cancelling service:", error);
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
      <Card className="shadow-xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary to-primary/90 text-white p-8">
          <CardTitle className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <FileText className="h-8 w-8" />
            </div>
            <div>
              <div className="text-2xl font-bold mb-1">Project Overview</div>
              <div className="text-white/90 font-normal flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Based on your consultation on{" "}
                {new Date(project.consultationDate).toLocaleDateString()}
              </div>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Vehicle Info */}
            <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20 hover:shadow-lg transition-all duration-300">
              <div className="p-3 bg-primary rounded-lg shadow-sm">
                <Car className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">
                  {project.vehicleName}
                </p>
                <p className="text-sm text-primary font-medium">
                  {project.vehicleDetails}
                </p>
              </div>
            </div>

            {/* Technician Info */}
            <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20 hover:shadow-lg transition-all duration-300">
              <div className="p-3 bg-primary rounded-lg shadow-sm">
                <UserCog className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">
                  {project.employeeName}
                </p>
                <p className="text-sm text-primary font-medium">
                  Your Technician
                </p>
              </div>
            </div>

            {/* Consultation Date */}
            <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20 hover:shadow-lg transition-all duration-300">
              <div className="p-3 bg-primary rounded-lg shadow-sm">
                <CalendarCheck className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">
                  {new Date(project.consultationDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-primary font-medium">
                  Consultation Date
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20 hover:shadow-lg transition-all duration-300">
              <div className="p-3 bg-primary rounded-lg shadow-sm">
                <div className="text-white">
                  {project.status === "waiting-confirmation" ? (
                    <Clock className="h-8 w-8" />
                  ) : project.status === "confirmed" ? (
                    <CheckCircle className="h-8 w-8" />
                  ) : project.status === "in-progress" ? (
                    <Activity className="h-8 w-8" />
                  ) : project.status === "completed" ? (
                    <CheckCircle className="h-8 w-8" />
                  ) : (
                    <X className="h-8 w-8" />
                  )}
                </div>
              </div>
              <div>
                <Badge
                  className={cn(
                    "text-sm font-semibold px-3 py-1 mb-2",
                    statusInfo.color,
                    statusInfo.bgColor,
                    "border-2"
                  )}
                >
                  {statusInfo.label}
                </Badge>
                <p className="text-sm text-primary font-medium">
                  Current Status
                </p>
              </div>
            </div>
          </div>

          {/* Additional Project Stats */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-center mb-2">
                  <div className="p-2 bg-primary rounded-lg">
                    <Wrench className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {project.services.length}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Total Services
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-center mb-2">
                  <div className="p-2 bg-primary rounded-lg">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-primary">
                  {acceptedServices.length}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Accepted Services
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-center mb-2">
                  <div className="p-2 bg-primary rounded-lg">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(totalAcceptedCost)}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Total Cost
                </div>
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
          <Badge
            variant="outline"
            className="text-sm border-blue-200 text-blue-700 bg-blue-50"
          >
            {project.services.filter((s) => s.status === "recommended").length}{" "}
            services pending review
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {project.services
            .filter((service) => service.status === "recommended")
            .map((service) => (
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

      {/* Accepted Services with Progress */}
      {acceptedServices.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Accepted Services
            </h2>
            <Badge
              variant="outline"
              className="text-sm border-green-200 text-green-700 bg-green-50"
            >
              {acceptedServices.length} service
              {acceptedServices.length !== 1 ? "s" : ""} confirmed
            </Badge>
          </div>

          <div className="space-y-4">
            {acceptedServices.map((service) => {
              const progress = serviceProgress[service.id] || "not-started";
              const canCancel =
                progress === "not-started" &&
                project.status === "waiting-confirmation";

              return (
                <Card
                  key={service.id}
                  className="border-l-4 border-l-green-500"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {service.name}
                          </h3>
                          <ServiceProgressBadge
                            status={service.status}
                            progress={progress}
                          />
                          {service.priority && (
                            <Badge
                              variant={
                                service.priority === "high"
                                  ? "destructive"
                                  : service.priority === "medium"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {service.priority} priority
                            </Badge>
                          )}
                        </div>

                        <p className="text-gray-600 mb-3">
                          {service.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span>Duration: {service.estimatedDuration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-green-600">
                              Cost: {formatCurrency(service.estimatedCost)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">
                              Category: {service.category}
                            </span>
                          </div>
                        </div>

                        {service.notes && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <strong>Note:</strong> {service.notes}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="ml-4 flex flex-col gap-2">
                        {/* Only show cancel button if service hasn't started yet */}
                        {progress === "not-started" && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleServiceCancel(service.id)}
                            disabled={isLoading}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel Service
                          </Button>
                        )}

                        {/* Show status info for in-progress and completed */}
                        {progress === "in-progress" && (
                          <div className="text-center">
                            <p className="text-sm text-blue-600 font-medium">
                              Service in progress
                            </p>
                            <p className="text-xs text-gray-500">
                              Cannot cancel
                            </p>
                          </div>
                        )}

                        {progress === "completed" && (
                          <div className="text-center">
                            <p className="text-sm text-green-600 font-medium">
                              Service completed
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Additional Service Request */}
      {project.status === "waiting-confirmation" &&
        acceptedServices.length > 0 && (
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

      {/* Service Status Information */}
      {(project.status === "confirmed" || acceptedServices.length > 0) && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Service Progress Information
                </h3>
                <div className="text-blue-800 text-sm space-y-1">
                  <p>
                    • <strong>Not Started:</strong> You can still cancel these
                    services without any charges
                  </p>
                  <p>
                    • <strong>In Progress:</strong> Service work has begun -
                    cancellation may incur charges
                  </p>
                  <p>
                    • <strong>Completed:</strong> Service has been finished and
                    quality checked
                  </p>
                </div>
                <p className="text-blue-700 text-sm mt-3 font-medium">
                  All prices are displayed in Sri Lankan Rupees (LKR)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
