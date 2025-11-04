"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, User, Loader2 } from "lucide-react";
import { employeeService } from "@/lib/services/employeeService";
import { notificationService } from "@/lib/services/notificationService";

export default function Header() {
  const [employeeName, setEmployeeName] = useState<string>("Employee");
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployeeData();
    
    // Refresh notification count every 30 seconds
    const notificationInterval = setInterval(refreshNotificationCount, 30000);
    
    return () => clearInterval(notificationInterval);
  }, []);

  const refreshNotificationCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setNotificationCount(count);
    } catch (error) {
      console.error('Failed to refresh notification count:', error);
    }
  };

  const loadEmployeeData = async () => {
    try {
      setLoading(true);
      
      // Fetch current employee info
      const employee = await employeeService.getCurrentEmployee();
      if (employee && employee.name) {
        setEmployeeName(employee.name);
      }
      
      // Fetch notification count
      const count = await notificationService.getUnreadCount();
      setNotificationCount(count);
      
    } catch (error) {
      console.error('Failed to load employee data:', error);
      setEmployeeName("Employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="fixed top-0 left-64 right-0 flex justify-end items-center p-6 bg-gray-50 z-40 border-b border-gray-200 h-20">
      <div className="flex items-center gap-4">
        <Link href="/employee/notifications">
          <div className="relative cursor-pointer hover:bg-gray-100 rounded-full p-2 transition-colors">
            <Bell className="h-6 w-6 text-gray-600 hover:text-gray-900" />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
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
