"use client";

import React from "react";
import Link from "next/link";
import { Bell, User, Loader2 } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";

export default function Header() {
  const { unreadCount, connectionStatus } = useNotifications();
  const [employeeName, setEmployeeName] = React.useState<string>("Employee");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadEmployeeData = async () => {
      try {
        const { employeeService } = await import("@/lib/services/employeeService");
        const employee = await employeeService.getCurrentEmployee();
        if (employee?.name) {
          setEmployeeName(employee.name);
        }
      } catch (error) {
        console.error('Failed to load employee data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEmployeeData();
  }, []);

  return (
    <header className="fixed top-0 left-64 right-0 flex justify-end items-center p-6 bg-gray-50 z-40 border-b border-gray-200 h-20">
      <div className="flex items-center gap-4">
        <Link href="/employee/notifications">
          <div className="relative cursor-pointer hover:bg-gray-100 rounded-full p-2 transition-colors">
            <Bell className="h-6 w-6 text-gray-600 hover:text-gray-900" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
            {connectionStatus === 'CONNECTED' && (
              <span className="absolute bottom-0 right-0 bg-green-500 rounded-full w-2 h-2"></span>
            )}
          </div>
        </Link>
        <Link href="/employee/profile">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-opacity-80 transition-colors">
            <User className="h-6 w-6 text-white" />
          </div>
        </Link>
        <span className="font-medium text-gray-700 min-w-[150px]">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin inline" />
          ) : (
            employeeName
          )}
        </span>
      </div>
    </header>
  );
}
