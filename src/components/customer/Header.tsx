"use client";

import React, { useEffect, useState } from "react";
import { Bell, User } from "lucide-react";
import { authService } from "@/lib/services/authService";
import { customerService } from "@/lib/services/customerService";

export default function Header() {
  const [customerName, setCustomerName] = useState("Customer");

  useEffect(() => {
    const fetchCustomerName = async () => {
      try {
        // First try to get name from current user (stored in localStorage)
        const user = authService.getCurrentUser();
        if (user?.name) {
          setCustomerName(user.name);
        }

        // Then fetch full customer profile to get the most up-to-date name
        const customer = await customerService.getCurrentCustomerProfile();
        if (customer?.name) {
          setCustomerName(customer.name);
        }
      } catch (error) {
        console.error('Error fetching customer name:', error);
        // Keep the default or localStorage name if API call fails
      }
    };

    fetchCustomerName();
  }, []);

  return (
    // Fixed header that accounts for the sidebar width on large screens and is full-width on small screens
    <header className="fixed top-0 left-0 right-0 h-16 flex items-center px-4 md:px-6 bg-white border-b border-gray-200 shadow-sm z-40">
      {/* On md+ screens the sidebar occupies 16rem (left-64). We add a wrapper to push header contents to the right so icons align visually with the main content. */}
      <div className="w-full max-w-[calc(100%_-_16rem)] ml-auto flex items-center">
        <div className="flex items-center ml-auto">
          <Bell className="h-6 w-6 text-primary cursor-pointer" />
          <div className="mx-6 w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer">
            <User className="h-6 w-6 text-primary" />
          </div>
          <span className="font-medium text-primary">{customerName}</span>
        </div>
      </div>
    </header>
  );
}
