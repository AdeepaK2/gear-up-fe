import React from "react";
import { Bot } from "lucide-react";
import type { CustomerContext } from "@/lib/types/Chatbot";

interface ChatHeaderProps {
  customerContext: CustomerContext;
  isEscalated?: boolean;
  estimatedWaitTime?: number | null;
}

/**
 * ChatHeader component
 * Modern, centered header for chatbot interface
 */
export const ChatHeader = React.memo<ChatHeaderProps>(
  ({ customerContext }) => {
    return (
      <div
        className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white px-6 py-5 shadow-md"
        role="banner"
      >
        <div className="flex items-center justify-center max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            <div
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg"
              aria-hidden="true"
            >
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-xl">GearUp Assistant</h2>
              
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ChatHeader.displayName = "ChatHeader";
