"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Chatbot from "@/components/customer/Chatbot";
import { CustomerContext, QuickAction } from "@/lib/types/Chatbot";
import { getRouteForAction } from "@/lib/config/chatRoutes";
import { customerService } from "@/lib/services/customerService";
import { useAuth } from "@/lib/context/AuthContext";

/**
 * ChatbotPage Component
 *
 * Orchestrates the chatbot interface for customer support.
 * Provides customer context and handles navigation for quick actions.
 *
 * Fetches real customer data from the backend to provide accurate context
 * in the chatbot interface including current projects and services.
 *
 * Navigation routes are defined in @/lib/config/chatRoutes to maintain
 * a single source of truth and prevent unexpected navigation.
 */
export default function ChatbotPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [customerContext, setCustomerContext] = useState<CustomerContext>({
    id: "1",
    name: "Loading...",
    currentProject: {
      id: "proj-001",
      name: "Loading...",
      status: "in-progress",
    },
    currentService: {
      id: "serv-001",
      name: "Loading...",
      status: "scheduled",
    },
    onlineStatus: "online",
  });
  
  const [loading, setLoading] = useState(true);

  // Fetch real customer context from backend
  useEffect(() => {
    const fetchCustomerContext = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }

        const context = await customerService.getCurrentCustomerContext();
        
        if (context) {
          setCustomerContext({
            id: user.email, // Use email as ID for now
            name: context.profile.name,
            currentProject: {
              id: "proj-001",
              name: context.currentProject || "Vehicle Maintenance",
              status: "in-progress",
            },
            currentService: {
              id: "serv-001", 
              name: context.currentService || "General Service",
              status: "scheduled",
            },
            onlineStatus: "online",
          });
        }
      } catch (error) {
        console.error('Error fetching customer context:', error);
        // Keep default loading state if there's an error
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerContext();
  }, [user]);

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

  // Show loading state while fetching customer data
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full">
      <Chatbot
        customerContext={customerContext}
        onActionClick={navigateForAction}
      />
    </div>
  );
}
