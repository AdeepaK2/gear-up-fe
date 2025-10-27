import React from "react";
import { LucideIcon } from "lucide-react";

/**
 * ProjectInfoTile - Reusable information tile component.
 *
 * @description Displays a single piece of project information with
 * icon, label, and value in a consistent styled card.
 *
 * @param {LucideIcon} Icon - Lucide icon component
 * @param {string} label - Primary information label
 * @param {string} sublabel - Secondary descriptive text
 * @param {React.ReactNode} children - Optional additional content (e.g., badges)
 */

interface ProjectInfoTileProps {
  Icon: LucideIcon;
  label: string;
  sublabel: string;
  children?: React.ReactNode;
}

const ProjectInfoTile: React.FC<ProjectInfoTileProps> = React.memo(
  ({ Icon, label, sublabel, children }) => {
    return (
      <div
        className="flex items-center gap-4 p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20 hover:shadow-lg transition-all duration-300"
        role="group"
        aria-label={`${sublabel}: ${label}`}
      >
        <div className="p-3 bg-primary rounded-lg shadow-sm" aria-hidden="true">
          <Icon className="h-8 w-8 text-white" />
        </div>
        <div className="flex-1">
          {children ? (
            <div className="mb-2">{children}</div>
          ) : (
            <p className="font-bold text-gray-900 text-lg">{label}</p>
          )}
          <p className="text-sm text-primary font-medium">{sublabel}</p>
        </div>
      </div>
    );
  }
);

ProjectInfoTile.displayName = "ProjectInfoTile";

export default ProjectInfoTile;
