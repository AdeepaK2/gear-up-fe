"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Wrench,
  Star,
  Banknote,
  Car,
  Zap,
  Shield,
  Settings,
  Filter,
  Battery,
  Gauge,
  Droplets,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Service, ServiceStatus } from "@/lib/types/Project";

// Get category icon
const getCategoryIcon = (category: string) => {
  const cat = category?.toLowerCase() || "";

  if (cat.includes("electrical")) {
    return <Zap className="h-4 w-4 text-yellow-500" />;
  }
  if (cat.includes("safety")) {
    return <Shield className="h-4 w-4 text-red-500" />;
  }
  if (cat.includes("maintenance")) {
    return <Settings className="h-4 w-4 text-blue-500" />;
  }
  if (cat.includes("performance")) {
    return <Gauge className="h-4 w-4 text-green-500" />;
  }
  if (cat.includes("custom")) {
    return <Star className="h-4 w-4 text-purple-500" />;
  }

  return <Car className="h-4 w-4 text-gray-500" />;
};

// Currency formatting function for LKR
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
  }).format(amount);
};

interface ServiceCardProps {
  service: Service;
  onSelect: (serviceId: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const statusConfig: Record<
  ServiceStatus,
  {
    color: string;
    icon: React.ReactNode;
    label: string;
    bgColor: string;
  }
> = {
  recommended: {
    color: "text-blue-700",
    icon: <AlertCircle className="h-4 w-4" />,
    label: "Recommended",
    bgColor: "bg-blue-50 border-blue-200",
  },
  accepted: {
    color: "text-green-700",
    icon: <CheckCircle className="h-4 w-4" />,
    label: "Accepted",
    bgColor: "bg-green-50 border-green-200",
  },
  rejected: {
    color: "text-red-700",
    icon: <XCircle className="h-4 w-4" />,
    label: "Rejected",
    bgColor: "bg-red-50 border-red-200",
  },
  requested: {
    color: "text-purple-700",
    icon: <Star className="h-4 w-4" />,
    label: "Requested",
    bgColor: "bg-purple-50 border-purple-200",
  },
  "in-progress": {
    color: "text-orange-700",
    icon: <Wrench className="h-4 w-4" />,
    label: "In Progress",
    bgColor: "bg-orange-50 border-orange-200",
  },
  completed: {
    color: "text-emerald-700",
    icon: <CheckCircle className="h-4 w-4" />,
    label: "Completed",
    bgColor: "bg-emerald-50 border-emerald-200",
  },
  cancelled: {
    color: "text-gray-700",
    icon: <XCircle className="h-4 w-4" />,
    label: "Cancelled",
    bgColor: "bg-gray-50 border-gray-200",
  },
};

export default function ServiceCard({
  service,
  onSelect,
  isLoading = false,
  disabled = false,
}: ServiceCardProps) {
  const statusInfo = statusConfig[service.status];
  const canModify = service.status === "recommended" && !disabled;

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-lg border-2",
        statusInfo.bgColor,
        service.status === "accepted" && "ring-2 ring-green-200",
        service.status === "rejected" && "opacity-75"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className="text-lg font-semibold text-gray-900">
                {service.name}
              </CardTitle>
              <Badge
                className={cn(
                  service.status === "recommended"
                    ? "bg-blue-100 text-blue-700 border-blue-200 px-3 py-1 rounded-full font-medium"
                    : cn(statusInfo.color, "bg-transparent border")
                )}
                variant={
                  service.status === "recommended" ? "default" : "outline"
                }
              >
                <span className="mr-1">{statusInfo.icon}</span>
                {statusInfo.label}
              </Badge>
            </div>
          </div>
          {service.priority && (
            <Badge
              className={cn(
                "ml-2 border-2 font-medium",
                service.priority === "high"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : service.priority === "medium"
                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                  : "bg-green-50 text-green-700 border-green-200"
              )}
              variant="outline"
            >
              {service.priority.charAt(0).toUpperCase() +
                service.priority.slice(1)}{" "}
              Priority
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Service Description */}
        <p className="text-gray-700 leading-relaxed">{service.description}</p>

        {/* Service Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white/50 rounded-lg">
            <p className="text-sm font-medium text-gray-900 mb-1">Duration</p>
            <p className="text-sm text-gray-600">{service.estimatedDuration}</p>
          </div>

          <div className="p-3 bg-white/50 rounded-lg">
            <p className="text-sm font-medium text-gray-900 mb-1">
              Estimated Cost
            </p>
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(service.estimatedCost)}
            </p>
          </div>
        </div>

        {/* Category & Notes */}
        {service.category && (
          <div className="p-2 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-700 font-medium">
              {service.category}
            </span>
          </div>
        )}

        {service.notes && (
          <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-400">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Technician Notes:</span>{" "}
              {service.notes}
            </p>
          </div>
        )}

        {/* Action Button */}
        {canModify && (
          <div className="pt-2">
            <Button
              onClick={() => onSelect(service.id)}
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {isLoading ? "Selecting..." : "Select Service"}
            </Button>
          </div>
        )}

        {/* Status Messages */}
        {service.status === "accepted" && (
          <div className="flex items-center gap-2 p-2 bg-green-100 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <p className="text-sm text-green-700 font-medium">
              Service selected - review in confirmation section below
            </p>
          </div>
        )}

        {service.status === "requested" && (
          <div className="flex items-center gap-2 p-2 bg-purple-100 rounded-lg">
            <Star className="h-4 w-4 text-purple-600" />
            <p className="text-sm text-purple-700 font-medium">
              Custom request - awaiting employee review
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
