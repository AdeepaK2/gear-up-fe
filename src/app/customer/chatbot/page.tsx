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
    onlineStatus: "online",
  });
  
  const [loading, setLoading] = useState(true);

  // Fetch real customer context from backend
  useEffect(() => {
    const fetchCustomerContext = async () => {
      try {
        if (!user) {
          // If no user, use guest context
          setCustomerContext({
            id: "guest",
            name: "Guest",
            onlineStatus: "online",
          });
          setLoading(false);
          return;
        }

        // Get current customer profile
        const profile = await customerService.getCurrentCustomerProfile();

        if (profile) {
          setCustomerContext({
            id: user.email, // Use email as ID
            name: profile.name,
            onlineStatus: "online",
          });
        }
      } catch (error) {
        console.error('Error fetching customer profile:', error);
        // Fallback to user info from auth context
        setCustomerContext({
          id: user?.email || "guest",
          name: user?.name || "there",
          onlineStatus: "online",
        });
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
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50/30 via-white to-blue-50/30">
        <div className="text-center">
          {/* Animated Spinner Container */}
          <div className="relative mb-6">
            {/* Outer rotating ring */}
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-100 border-t-blue-600 mx-auto"></div>
            {/* Inner pulsing circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full animate-pulse"></div>
            </div>
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>

          {/* Loading Text */}
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Initializing AI Assistant
          </h3>
          <p className="text-gray-500 text-sm animate-pulse">
            Getting ready to help you...
          </p>

          {/* Loading dots animation */}
          <div className="flex justify-center space-x-1 mt-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
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
