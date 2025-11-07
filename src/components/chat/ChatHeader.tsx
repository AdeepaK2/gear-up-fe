import React from "react";
import { Bot, ArrowLeft, Menu, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import type { CustomerContext } from "@/lib/types/Chatbot";

interface ChatHeaderProps {
  customerContext: CustomerContext;
  isEscalated?: boolean;
  estimatedWaitTime?: number | null;
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  onNewChat?: () => void;
  backendConnected?: boolean;
}

/**
 * ChatHeader component
 * Professional header for chatbot interface with navigation controls
 * Includes back button, sidebar toggle, branding, and new chat button
 */
export const ChatHeader = React.memo<ChatHeaderProps>(
  ({
    customerContext,
    sidebarOpen = false,
    onToggleSidebar,
    onNewChat,
    backendConnected = true,
  }) => {
    const router = useRouter();

    return (
      <div
        className="bg-gradient-to-r from-primary via-primary/90 to-primary/90 text-white px-6 py-4 shadow-lg"
        role="banner"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Left Section: Navigation and Branding */}
          <div className="flex items-center space-x-4">
            {/* Back to Dashboard Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/customer")}
              className="text-white hover:text-blue-100 hover:bg-white/10 rounded-lg transition-all flex items-center gap-2"
              title="Back to dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline text-sm">Back to Dashboard</span>
              <span className="sm:hidden text-xs">Back</span>
            </Button>

            {/* Vertical Divider */}
            <div className="h-6 w-px bg-white/30"></div>

            {/* Menu Button (Sidebar Toggle) */}
            {!sidebarOpen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleSidebar}
                className="text-white hover:text-blue-100 hover:bg-white/10 rounded-lg transition-all"
                title="Show chat history"
              >
                <Menu className="w-5 h-5" />
              </Button>
            )}

            {/* Close Sidebar Button */}
            {sidebarOpen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleSidebar}
                className="text-white hover:text-blue-100 hover:bg-white/10 rounded-lg transition-all"
                title="Hide chat history"
              >
                <X className="w-5 h-5" />
              </Button>
            )}

            {/* Branding */}
            <div className="flex items-center space-x-3 ml-2">
              <div
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg"
                aria-hidden="true"
              >
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="font-bold text-lg leading-tight">
                  GearUp Assistant
                </h1>
                <p className="text-xs text-blue-100">
                  {!backendConnected && "Local Mode • "}Support & Help
                </p>
              </div>
            </div>
          </div>

          {/* Right Section: New Chat Button */}
          <Button
            onClick={onNewChat}
            className="bg-white text-blue-600 hover:bg-blue-50 rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            size="sm"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </Button>
        </div>
      </div>
    );
  }
);

ChatHeader.displayName = "ChatHeader";
