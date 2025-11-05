import React from "react";
import { User, Clock, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CustomerContext } from "@/lib/types/Chatbot";

interface ChatHeaderProps {
  customerContext: CustomerContext;
  isEscalated?: boolean;
  estimatedWaitTime?: number | null;
}

/**
 * ChatHeader component
 * Displays customer context and escalation status
 */
export const ChatHeader = React.memo<ChatHeaderProps>(
  ({ customerContext, isEscalated = false, estimatedWaitTime = null }) => {
    const router = useRouter();

    const handleBackClick = () => {
      router.push("/customer");
    };

    return (
      <div
        className="bg-gradient-to-r from-primary to-primary/90 text-white px-6 py-3"
        role="banner"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackClick}
              className="text-white hover:bg-white/10 p-2"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div
              className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
              aria-hidden="true"
            >
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-semibold text-base">{customerContext.name}</h2>
              <div className="flex items-center space-x-4 text-xs text-white/80">
                {customerContext.currentProject && (
                  <span>Project: {customerContext.currentProject.name}</span>
                )}
                {customerContext.currentService && (
                  <span>Service: {customerContext.currentService.name}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge
              variant={
                customerContext.onlineStatus === "online"
                  ? "default"
                  : "secondary"
              }
              aria-label={`Status: ${customerContext.onlineStatus}`}
            >
              {customerContext.onlineStatus === "online"
                ? "🟢 Online"
                : "🔴 Offline"}
            </Badge>
            {isEscalated && estimatedWaitTime && (
              <Badge
                variant="outline"
                className="text-yellow-300 border-yellow-300"
                aria-label={`Estimated wait time: ${estimatedWaitTime} minutes`}
              >
                <Clock className="w-3 h-3 mr-1" aria-hidden="true" />
                Wait: {estimatedWaitTime}min
              </Badge>
            )}
          </div>
        </div>
      </div>
    );
  }
);

ChatHeader.displayName = "ChatHeader";
