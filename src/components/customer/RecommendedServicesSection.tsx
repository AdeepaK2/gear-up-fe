import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench } from "lucide-react";
import ServiceCard from "@/components/customer/ServiceCard";
import { Service, ProjectStatus } from "@/lib/types/Project";

/**
 * RecommendedServicesSection - Displays list of recommended services.
 *
 * @description Renders a card containing recommended services that await
 * customer review. Filters and maps services to ServiceCard components.
 *
 * @param {Service[]} services - All project services
 * @param {ProjectStatus} projectStatus - Current project status
 * @param {function} onSelect - Handler for service selection
 * @param {boolean} isLoading - Loading state for button interactions
 */

interface RecommendedServicesSectionProps {
  services: Service[];
  projectStatus: ProjectStatus;
  onSelect: (serviceId: string) => void;
  isLoading: boolean;
}

const RecommendedServicesSection: React.FC<RecommendedServicesSectionProps> =
  React.memo(({ services, projectStatus, onSelect, isLoading }) => {
    const recommendedServices = services.filter(
      (service) => service.status === "recommended"
    );

    if (recommendedServices.length === 0) {
      return (
        <Card className="shadow-lg border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary to-primary/90 text-white p-6">
            <CardTitle className="flex items-center gap-3">
              <div
                className="p-2 bg-white/20 rounded-lg backdrop-blur-sm"
                aria-hidden="true"
              >
                <Wrench className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xl font-bold">Recommended Services</div>
                <div className="text-white/90 font-normal text-sm">
                  No additional services recommended at this time
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center py-8 text-gray-600">
              <p>All available services have been reviewed.</p>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="shadow-lg border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary to-primary/90 text-white p-6">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <div
                className="p-2 bg-white/20 rounded-lg backdrop-blur-sm"
                aria-hidden="true"
              >
                <Wrench className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Recommended Services</h2>
                <p className="text-white/90 font-normal text-sm">
                  Review and select services for your vehicle
                </p>
              </div>
            </CardTitle>
            <Badge
              variant="outline"
              className="text-sm border-white/30 text-white bg-white/20 backdrop-blur-sm"
              aria-label={`${recommendedServices.length} services pending review`}
            >
              {recommendedServices.length} pending review
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recommendedServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onSelect={onSelect}
                isLoading={isLoading}
                disabled={projectStatus !== "waiting-confirmation"}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  });

RecommendedServicesSection.displayName = "RecommendedServicesSection";

export default RecommendedServicesSection;
