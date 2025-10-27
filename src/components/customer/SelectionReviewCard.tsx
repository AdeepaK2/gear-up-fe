import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, X } from "lucide-react";
import { Service } from "@/lib/types/Project";
import { formatCurrencyLKR } from "@/lib/utils/currency";

/**
 * SelectionReviewCard - Review accepted services before final confirmation.
 *
 * @description Displays selected services with ability to unselect before
 * confirming. Shows total cost and provides confirmation action.
 *
 * @param {Service[]} acceptedServices - Services customer has accepted
 * @param {number} totalCost - Sum of accepted service costs
 * @param {function} onUnselect - Handler to remove a service from selection
 * @param {function} onConfirm - Handler to finalize all service selections
 * @param {boolean} isLoading - Loading state for button interactions
 */

interface SelectionReviewCardProps {
  acceptedServices: Service[];
  totalCost: number;
  onUnselect: (serviceId: string) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

const SelectionReviewCard: React.FC<SelectionReviewCardProps> = React.memo(
  ({ acceptedServices, totalCost, onUnselect, onConfirm, isLoading }) => {
    if (acceptedServices.length === 0) return null;

    return (
      <Card
        className="border-2 border-green-200 bg-green-50 shadow-lg"
        role="region"
        aria-labelledby="review-selection-heading"
      >
        <CardHeader className="bg-green-100 border-b border-green-200 pb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-200 rounded-full" aria-hidden="true">
              <CheckCircle className="h-8 w-8 text-green-700" />
            </div>
            <div>
              <h2
                id="review-selection-heading"
                className="text-xl font-bold text-green-800"
              >
                Review Your Selection
              </h2>
              <p className="text-sm text-green-700">
                Review your selected services and confirm when ready
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Selected Services List */}
          <div className="space-y-4 mb-6">
            {acceptedServices.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-green-200 hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {service.name}
                    </h3>
                    {service.priority && (
                      <Badge
                        className={
                          service.priority === "high"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : service.priority === "medium"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : "bg-green-50 text-green-700 border-green-200"
                        }
                        variant="outline"
                      >
                        {service.priority} priority
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {service.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-500">
                      Duration: {service.estimatedDuration}
                    </span>
                    <span className="font-semibold text-green-600">
                      {formatCurrencyLKR(service.estimatedCost)}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={() => onUnselect(service.id)}
                  disabled={isLoading}
                  variant="outline"
                  size="sm"
                  className="ml-4 border-gray-300 text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
                  aria-label={`Unselect ${service.name}`}
                >
                  <X className="h-4 w-4 mr-1" aria-hidden="true" />
                  Unselect
                </Button>
              </div>
            ))}
          </div>

          {/* Summary and Confirm */}
          <div className="border-t border-green-200 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-green-800">
                  Total: {formatCurrencyLKR(totalCost)}
                </p>
                <p className="text-sm text-green-700">
                  {acceptedServices.length} service
                  {acceptedServices.length !== 1 ? "s" : ""} selected
                </p>
              </div>
              <Button
                onClick={onConfirm}
                disabled={isLoading}
                aria-busy={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-3 text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
              >
                {isLoading ? "Processing..." : "Confirm All Services"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

SelectionReviewCard.displayName = "SelectionReviewCard";

export default SelectionReviewCard;
