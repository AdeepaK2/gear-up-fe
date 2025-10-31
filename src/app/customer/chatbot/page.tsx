"use client";

import { useState, useEffect } from "react";
import Chatbot from "@/components/customer/Chatbot";
import { CustomerContext, QuickAction } from "@/lib/types/Chatbot";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/authService";

export default function ChatbotPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Get real customer context from auth
  const [customerContext, setCustomerContext] = useState<CustomerContext>({
    id: "0",
    name: "Guest User",
    onlineStatus: "online",
  });

  useEffect(() => {
    const loadCustomerContext = () => {
      try {
        const user = authService.getCurrentUser();
        
        if (user) {
          setCustomerContext({
            id: user.email, // Use email as id since User doesn't have id field
            name: user.name || user.email.split('@')[0],
            onlineStatus: "online",
            // These can be loaded from actual API calls if needed
            currentProject: undefined,
            currentService: undefined,
          });
        } else {
          // Not logged in, redirect to login
          router.push('/login');
        }
      } catch (error) {
        console.error('Error loading customer context:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    loadCustomerContext();
  }, [router]);

  const handleActionClick = (action: QuickAction) => {
    // Handle navigation based on the action
    switch (action.action) {
      case "view_appointments":
        router.push("/customer/appointments");
        break;
      case "view_services":
        router.push("/services");
        break;
      case "request_service":
        router.push("/services");
        // You could add a query parameter to open a request form
        break;
      case "update_profile":
        router.push("/customer/profile");
        break;
      case "contact_support":
        // This is handled within the chatbot component
        break;
      default:
        console.log("Action clicked:", action);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chatbot...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary">
          Customer Support Chat
        </h1>
        <p className="text-gray-600 mt-2">
          Get instant help with your services, appointments, and account
          management.
        </p>
      </div>

      <div className="h-[calc(100vh-200px)]">
        <Chatbot
          customerContext={customerContext}
          onActionClick={handleActionClick}
        />
      </div>
    </div>
  );
}
