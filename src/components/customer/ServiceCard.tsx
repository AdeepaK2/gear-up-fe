"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Wrench,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Service, ServiceStatus } from "@/lib/types/Project";

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
  onAccept: (serviceId: string) => void;
  onReject: (serviceId: string) => void;
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
  onAccept,
  onReject,
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
            <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
              {service.name}
            </CardTitle>
            <Badge
              className={cn("mb-2", statusInfo.color, "bg-transparent border")}
              variant="outline"
            >
              <span className="mr-1">{statusInfo.icon}</span>
              {statusInfo.label}
            </Badge>
          </div>
          {service.priority && (
            <Badge
              variant={
                service.priority === "high"
                  ? "destructive"
                  : service.priority === "medium"
                  ? "default"
                  : "secondary"
              }
              className="ml-2"
            >
              {service.priority.toUpperCase()}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Service Description */}
        <p className="text-gray-700 leading-relaxed">{service.description}</p>

        {/* Service Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 p-3 bg-white/50 rounded-lg">
            <Clock className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Duration</p>
              <p className="text-sm text-gray-600">
                {service.estimatedDuration}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-white/50 rounded-lg">
            <DollarSign className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Estimated Cost
              </p>
              <p className="text-sm text-gray-600">
                <span className="text-2xl font-bold">
                  {formatCurrency(service.estimatedCost)}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Category & Notes */}
        {service.category && (
          <div className="flex items-center gap-2">
            <Wrench className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Category: {service.category}
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

        {/* Action Buttons */}
        {canModify && (
          <div className="flex gap-3 pt-2">
            <Button
              onClick={() => onAccept(service.id)}
              disabled={isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {isLoading ? "Processing..." : "Accept Service"}
            </Button>

            <Button
              onClick={() => onReject(service.id)}
              disabled={isLoading}
              variant="outline"
              className="flex-1 border-2 border-red-300 text-red-700 hover:bg-red-50"
            >
              <XCircle className="h-4 w-4 mr-2" />
              {isLoading ? "Processing..." : "Reject"}
            </Button>
          </div>
        )}

        {/* Status Messages */}
        {service.status === "accepted" && (
          <div className="flex items-center gap-2 p-2 bg-green-100 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <p className="text-sm text-green-700 font-medium">
              Service accepted - will be included in your project
            </p>
          </div>
        )}

        {service.status === "rejected" && (
          <div className="flex items-center gap-2 p-2 bg-red-100 rounded-lg">
            <XCircle className="h-4 w-4 text-red-600" />
            <p className="text-sm text-red-700 font-medium">
              Service rejected - excluded from project
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
