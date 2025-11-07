import React from "react";
import { Button } from "@/components/ui/button";
import type { QuickAction } from "@/lib/types/Chatbot";

interface QuickActionsBarProps {
  actions: QuickAction[];
  onActionClick: (action: QuickAction) => void;
}

/**
 * QuickActionsBar component
 * Displays quick action buttons for common tasks
 */
export const QuickActionsBar = React.memo<QuickActionsBarProps>(
  ({ actions, onActionClick }) => {
    return (
      <div className="px-6 py-2 border-b bg-gray-50" role="complementary">
        <div className="flex flex-wrap gap-2 justify-center">
          {actions.map((action) => (
            <Button
              key={action.id}
              size="sm"
              variant="outline"
              className="text-xs py-1 px-3"
              onClick={() => onActionClick(action)}
              aria-label={action.label}
            >
              <span aria-hidden="true">{action.icon}</span> {action.label}
            </Button>
          ))}
        </div>
      </div>
    );
  }
);

QuickActionsBar.displayName = "QuickActionsBar";
