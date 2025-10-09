"use client";

import { useState, useEffect } from "react";
import Chatbot from "@/components/customer/Chatbot";
import { CustomerContext, QuickAction } from "@/lib/types/Chatbot";
import { useRouter } from "next/navigation";

export default function ChatbotPage() {
  const router = useRouter();

  // Mock customer context - in a real app, this would come from your auth/user context
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
