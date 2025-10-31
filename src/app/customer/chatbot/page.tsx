"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Chatbot from "@/components/customer/Chatbot";
import { CustomerContext, QuickAction } from "@/lib/types/Chatbot";
import { getRouteForAction } from "@/lib/config/chatRoutes";

/**
 * ChatbotPage Component
 *
 * Orchestrates the chatbot interface for customer support.
 * Provides customer context and handles navigation for quick actions.
 *
 * Note: Currently uses mock customer context. In a production environment,
 * this would be replaced with actual user data from authentication context
 * or API calls.
 *
 * Navigation routes are defined in @/lib/config/chatRoutes to maintain
 * a single source of truth and prevent unexpected navigation.
 */
export default function ChatbotPage() {
  const router = useRouter();

  // Mock customer context - will be replaced with real auth/user context in production
  const [customerContext] = useState<CustomerContext>({
    id: "1",
    name: "John Doe",
    currentProject: {
      id: "proj-001",
      name: "Vehicle Maintenance",
      status: "in-progress",
    },
    currentService: {
      id: "serv-001",
      name: "Oil Change",
      status: "scheduled",
    },
    onlineStatus: "online",
  });

  /**
   * Navigate to route for quick action
   * Uses centralized route map to ensure valid navigation
   */
  const navigateForAction = useCallback(
    (action: QuickAction) => {
      const route = getRouteForAction(action.action);

      if (route) {
        // Navigate to the mapped route
        router.push(route);
      }
      // If route is null, action is handled internally by Chatbot (e.g., contact_support)
    },
    [router]
  );

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4 flex-shrink-0">
        <h1 className="text-3xl font-bold text-primary">
          Customer Support Chat
        </h1>
        <p className="text-gray-600 mt-2">
          Get instant help with your services, appointments, and account
          management.
        </p>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <Chatbot
          customerContext={customerContext}
          onActionClick={navigateForAction}
        />
      </div>
    </div>
  );
}
