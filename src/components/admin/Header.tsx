import React from "react";
import { Bell, User } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import Link from "next/link";

export default function Header() {
  const { user } = useAuth();
  const { unreadCount, connectionStatus } = useNotifications();

  return (
    <header className="fixed top-0 right-0 left-64 flex justify-end items-center p-6 bg-gray-50 z-40 pt-8">
      <div className="flex items-center">
        <Link href="/admin/notifications" className="relative cursor-pointer">
          <Bell className="h-6 w-6 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          {connectionStatus === 'CONNECTED' && (
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
          )}
        </Link>
        <div className="mx-8 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer">
          <User className="h-6 w-6 text-gray-600" />
        </div>
        <span className="font-medium">{user?.name || "Admin"}</span>
      </div>
    </header>
  );
}
