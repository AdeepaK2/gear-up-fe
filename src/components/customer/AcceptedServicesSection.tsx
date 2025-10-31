import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, X } from "lucide-react";
import { Service, ProjectStatus } from "@/lib/types/Project";
import { formatCurrencyLKR } from "@/lib/utils/currency";
import ServiceProgressBadge, {
  type ServiceProgress,
} from "./ServiceProgressBadge";

/**
 * AcceptedServicesSection - Displays confirmed services with progress tracking.
 *
 * @description Shows accepted services with their progress status and allows
 * cancellation of services that haven't started yet. Implements inline
 * confirmation pattern for service cancellation.
 *
 * @param {Service[]} acceptedServices - Confirmed services
 * @param {ProjectStatus} projectStatus - Current project status
 * @param {Record<string, ServiceProgress>} serviceProgress - Progress tracking map
 * @param {function} onCancel - Handler for service cancellation
 * @param {boolean} isLoading - Loading state
 */

interface AcceptedServicesSectionProps {
  acceptedServices: Service[];
  projectStatus: ProjectStatus;
  serviceProgress: Record<string, ServiceProgress>;
  onCancel: (serviceId: string) => void;
  isLoading: boolean;
}

const AcceptedServicesSection: React.FC<AcceptedServicesSectionProps> =
  React.memo(
    ({
      acceptedServices,
      projectStatus,
      serviceProgress,
      onCancel,
      isLoading,
    }) => {
      // Track which service is in "confirm cancellation" mode
      const [confirmingCancelId, setConfirmingCancelId] = useState<
        string | null
      >(null);

      const handleCancelClick = useCallback((serviceId: string) => {
        setConfirmingCancelId(serviceId);
      }, []);

      const handleCancelConfirm = useCallback(
        (serviceId: string) => {
          onCancel(serviceId);
          setConfirmingCancelId(null);
        },
        [onCancel]
      );

      const handleCancelBack = useCallback(() => {
        setConfirmingCancelId(null);
      }, []);

      if (acceptedServices.length === 0) return null;

      return (
        <Card
          className="shadow-lg border-0 overflow-hidden"
          role="region"
          aria-labelledby="accepted-services-heading"
        >
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3">
                <div
                  className="p-2 bg-white/20 rounded-lg backdrop-blur-sm"
                  aria-hidden="true"
                >
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <h2
                    id="accepted-services-heading"
                    className="text-xl font-bold"
                  >
                    Accepted Services
                  </h2>
                  <p className="text-white/90 font-normal text-sm">
                    Track progress of your confirmed services
                  </p>
                </div>
              </CardTitle>
              <Badge
                variant="outline"
                className="text-sm border-white/30 text-white bg-white/20 backdrop-blur-sm"
                aria-label={`${acceptedServices.length} services confirmed`}
              >
                {acceptedServices.length} service
                {acceptedServices.length !== 1 ? "s" : ""} confirmed
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="space-y-4">
              {acceptedServices.map((service) => {
                const progress = serviceProgress[service.id] || "not-started";
                const isConfirmingCancel = confirmingCancelId === service.id;

                return (
                  <Card
                    key={service.id}
                    className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow duration-200"
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
                              <Clock
                                className="h-4 w-4 text-gray-500"
                                aria-hidden="true"
                              />
                              <span>Duration: {service.estimatedDuration}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-green-600">
                                Cost: {formatCurrencyLKR(service.estimatedCost)}
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

                          {/* Inline confirmation for cancellation */}
                          {isConfirmingCancel && (
                            <div
                              className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg"
                              role="dialog"
                              aria-labelledby={`cancel-confirm-${service.id}`}
                              aria-describedby={`cancel-desc-${service.id}`}
                            >
                              <h4
                                id={`cancel-confirm-${service.id}`}
                                className="font-semibold text-red-900 mb-2"
                              >
                                Confirm Cancellation
                              </h4>
                              <p
                                id={`cancel-desc-${service.id}`}
                                className="text-sm text-red-800 mb-4"
                              >
                                Are you sure you want to cancel "{service.name}
                                "? This action cannot be undone.
                              </p>
                              <div className="flex gap-3">
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() =>
                                    handleCancelConfirm(service.id)
                                  }
                                  disabled={isLoading}
                                  aria-busy={isLoading}
                                  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
                                >
                                  Yes, Cancel Service
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={handleCancelBack}
                                  disabled={isLoading}
                                  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
                                >
                                  Go Back
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="ml-4 flex flex-col gap-2">
                          {/* Show cancel button only if not started and not confirming */}
                          {progress === "not-started" &&
                            !isConfirmingCancel && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleCancelClick(service.id)}
                                disabled={isLoading}
                                aria-label={`Cancel ${service.name}`}
                                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
                              >
                                <X
                                  className="h-4 w-4 mr-1"
                                  aria-hidden="true"
                                />
                                Cancel Service
                              </Button>
                            )}

                          {/* Status info for in-progress */}
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

                          {/* Status info for completed */}
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
          </CardContent>
        </Card>
      );
    }
  );

AcceptedServicesSection.displayName = "AcceptedServicesSection";

export default AcceptedServicesSection;
