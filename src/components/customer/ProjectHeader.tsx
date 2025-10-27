import React from "react";

/**
 * ProjectHeader - Page title and subtitle for projects page.
 * 
 * @description Simple header component following SRP.
 * Provides consistent page-level heading structure.
 */

interface ProjectHeaderProps {
  title?: string;
  subtitle?: string;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  title = "Project Details",
  subtitle = "Review and manage your vehicle service project",
}) => {
  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-primary font-bold text-3xl">{title}</h1>
        <p className="text-gray-600 mt-1">{subtitle}</p>
      </div>
    </header>
  );
};

export default ProjectHeader;
