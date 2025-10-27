import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";

/**
 * ProjectActionsCard - Warning card for project with no selected services.
 *
 * @description Shows when customer hasn't selected any services and offers
 * option to cancel the project. Provides clear messaging about project status.
 *
 * @param {function} onCancelProject - Handler for project cancellation
 * @param {boolean} isLoading - Loading state for button interaction
 */

interface ProjectActionsCardProps {
  onCancelProject: () => void;
  isLoading: boolean;
}

const ProjectActionsCard: React.FC<ProjectActionsCardProps> = React.memo(
  ({ onCancelProject, isLoading }) => {
    return (
      <Card
        className="border-2 border-red-200 bg-red-50"
        role="alert"
        aria-labelledby="no-services-heading"
      >
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <AlertTriangle
              className="h-8 w-8 text-red-600 flex-shrink-0"
              aria-hidden="true"
            />
            <div className="flex-1">
              <h3
                id="no-services-heading"
                className="font-semibold text-red-900"
              >
                No Services Selected
              </h3>
              <p className="text-red-700 text-sm">
                If you don't need any of the recommended services, you can
                cancel this project.
              </p>
            </div>
            <Button
              onClick={onCancelProject}
              variant="destructive"
              disabled={isLoading}
              aria-busy={isLoading}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
            >
              <X className="h-4 w-4 mr-2" aria-hidden="true" />
              {isLoading ? "Cancelling..." : "Cancel Project"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
);

ProjectActionsCard.displayName = "ProjectActionsCard";

export default ProjectActionsCard;
