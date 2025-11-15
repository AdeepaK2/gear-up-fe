"use client";

import React, { useEffect, useState } from "react";
import { Bell, User, Menu } from "lucide-react";
import { authService } from "@/lib/services/authService";
import { customerService } from "@/lib/services/customerService";
import { useNotifications } from "@/contexts/NotificationContext";
import Link from "next/link";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [customerName, setCustomerName] = useState("Customer");
  const { unreadCount, connectionStatus } = useNotifications();

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
    <header className="fixed top-0 left-0 right-0 h-16 flex items-center px-4 md:px-6 bg-white border-b border-gray-200 shadow-sm z-40 md:left-64">
      {/* Hamburger menu for mobile */}
      <button
        onClick={onMenuClick}
        className="mr-4 p-2 rounded-lg hover:bg-gray-100 md:hidden"
      >
        <Menu size={24} className="text-primary" />
      </button>

      <div className="w-full flex items-center">
        <div className="flex items-center ml-auto">
          <Link href="/customer/notifications" className="relative cursor-pointer">
            <Bell className="h-6 w-6 text-primary" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
            {connectionStatus === 'CONNECTED' && (
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
            )}
          </Link>
          <div className="mx-6 w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer">
            <User className="h-6 w-6 text-primary" />
          </div>
          <span className="font-medium text-primary">{customerName}</span>
        </div>
      </div>
    </header>
  );
}
