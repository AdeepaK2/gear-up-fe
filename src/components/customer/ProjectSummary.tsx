"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  DollarSign,
  Clock,
  FileText,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";
import {
  Service,
  ProjectSummary as ProjectSummaryType,
} from "@/lib/types/Project";

// Currency formatting function for LKR
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
  }).format(amount);
};

interface ProjectSummaryProps {
  acceptedServices: Service[];
  totalCost: number;
  onConfirmServices: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function ProjectSummary({
  acceptedServices,
  totalCost,
  onConfirmServices,
  isLoading = false,
  disabled = false,
}: ProjectSummaryProps) {
  const serviceCount = acceptedServices.length;
  const totalDuration = calculateTotalDuration(acceptedServices);

  if (serviceCount === 0) {
    return (
      <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
        <CardContent className="p-8 text-center">
          <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No Services Selected
          </h3>
          <p className="text-gray-500">
            Accept some services above to see your project summary here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-100 border-b border-green-200">
        <CardTitle className="flex items-center gap-3 text-green-800">
          <div className="p-2 bg-green-200 rounded-lg">
            <FileText className="h-5 w-5 text-green-700" />
          </div>
          <div>
            <div className="text-xl font-bold">Project Summary</div>
            <div className="text-sm font-normal text-green-700">
              Review your selected services before confirmation
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-blue-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{serviceCount}</p>
              <p className="text-sm text-gray-600">
                Service{serviceCount !== 1 ? "s" : ""} Selected
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalCost)}
              </p>
              <p className="text-sm text-gray-600">Total Estimated Cost</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {totalDuration}
              </p>
              <p className="text-sm text-gray-600">Estimated Duration</p>
            </div>
          </div>
        </div>

        {/* Selected Services List */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Selected Services
          </h4>
          <div className="space-y-2">
            {acceptedServices.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-green-200 shadow-sm"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-green-100 text-green-800 border-green-300">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Accepted
                    </Badge>
                    <h5 className="font-medium text-gray-900">
                      {service.name}
                    </h5>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 max-w-md truncate">
                    {service.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(service.estimatedCost)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {service.estimatedDuration}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Confirmation Section */}
        <div className="border-t border-green-200 pt-6">
          <div className="bg-white p-6 rounded-xl border-2 border-green-300 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-bold text-gray-900">
                  Ready to Confirm?
                </h4>
                <p className="text-sm text-gray-600">
                  Confirming will start your project with the selected services.
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Project Cost</p>
                <p className="text-3xl font-bold text-green-600">
                  {formatCurrency(totalCost)}
                </p>
              </div>
            </div>

            <Button
              onClick={onConfirmServices}
              disabled={isLoading || disabled}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 text-lg"
              size="lg"
            >
              {isLoading ? (
                "Processing..."
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Confirm Selected Services
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </Button>

            <p className="text-xs text-gray-500 mt-3 text-center">
              By confirming, you agree to proceed with the selected services.
              You'll receive updates on the project progress.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to calculate total duration
function calculateTotalDuration(services: Service[]): string {
  let totalMinutes = 0;

  services.forEach((service) => {
    const duration = service.estimatedDuration.toLowerCase();

    // Parse duration (assumes formats like "30 minutes", "1-2 hours", "2 hours")
    if (duration.includes("hour")) {
      const hours = parseFloat(duration.match(/(\d+(?:\.\d+)?)/)?.[0] || "1");
      totalMinutes += hours * 60;
    } else if (duration.includes("minute")) {
      const minutes = parseFloat(duration.match(/(\d+)/)?.[0] || "30");
      totalMinutes += minutes;
    } else {
      // Default to 30 minutes if format is unclear
      totalMinutes += 30;
    }
  });

  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  } else {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (minutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${minutes}m`;
    }
  }
}
