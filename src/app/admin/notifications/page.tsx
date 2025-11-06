"use client";

import React, { useState } from "react";
import { X, Loader2, Calendar, Briefcase, AlertCircle, Bell } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";

// Helper function to get notification type icon
const getTypeIcon = (type: string) => {
  switch (type?.toUpperCase()) {
    case "APPOINTMENT":
      return <Calendar className="w-5 h-5 text-blue-600" />;
    case "PROJECT_UPDATE":
      return <Briefcase className="w-5 h-5 text-green-600" />;
    case "TASK_ASSIGNED":
      return <AlertCircle className="w-5 h-5 text-orange-600" />;
    case "SYSTEM":
      return <Bell className="w-5 h-5 text-gray-600" />;
    default:
      return <Bell className="w-5 h-5 text-gray-600" />;
  }
};

// Helper function to get notification type color
const getTypeColor = (type: string, isRead: boolean) => {
  const baseColors: Record<string, string> = {
    APPOINTMENT: "border-blue-500",
    PROJECT_UPDATE: "border-green-500",
    TASK_ASSIGNED: "border-orange-500",
    SYSTEM: "border-gray-500",
  };
  
  const color = baseColors[type?.toUpperCase()] || "border-gray-500";
  return isRead ? color.replace("500", "300") : color;
};

export default function NotificationsPage() {
  const { notifications, loading, markAsRead, markAllAsRead, deleteNotification, connectionStatus } = useNotifications();
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  // Separate notifications into new (unread) and old (read)
  const newNotifications = notifications.filter((n) => !n.read);
  const oldNotifications = notifications.filter((n) => n.read);

  const handleMarkAsRead = async (id: string, idx: number) => {
    setSelectedIdx(idx);
    await markAsRead(id);
  };

  const handleDismiss = async (id: string) => {
    await deleteNotification(id);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Notifications</h1>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
          <span className="ml-2 text-lg">Loading notifications...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
          <div className="w-8 h-8 bg-gray-800 text-white text-lg rounded-full flex items-center justify-center font-semibold">
            {notifications.length}
          </div>
          {connectionStatus === 'CONNECTED' && (
            <span className="text-xs text-green-600 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
              Live
            </span>
          )}
        </div>
        <button
          className="text-sm font-medium text-gray-600 hover:underline hover:text-gray-800"
          onClick={markAllAsRead}
        >
          Mark all as read
        </button>
      </div>
      <div className="space-y-2">
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <div className="flex items-center gap-2 px-4">
            <span className="text-sm font-medium text-gray-600">New</span>
            <div className="w-6 h-6 bg-gray-800 text-white text-xs rounded-full flex items-center justify-center font-semibold">
              {newNotifications.length}
            </div>
          </div>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {newNotifications.length === 0 ? (
          <div className="flex items-center justify-center py-4">
            <span className="text-gray-500 text-lg">No new notifications</span>
          </div>
        ) : (
          newNotifications.map((n, idx) => (
            <div
              key={n.id}
              className={`flex items-center bg-white rounded-lg px-4 py-3 shadow-sm border-l-4 ${getTypeColor(n.type, n.read)} hover:bg-gray-50 transition-all duration-200 cursor-pointer ${
                selectedIdx === idx ? "border-2 border-gray-500" : ""
              }`}
              onClick={() => handleMarkAsRead(n.id, idx)}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 mr-4 flex-shrink-0">
                {getTypeIcon(n.type)}
              </div>
              <div className="flex-1">
                <div className="text-base font-medium">{n.title}</div>
                <div className="text-sm text-gray-600 mt-1">{n.message}</div>
                <div className="text-xs text-gray-400 mt-1">{n.timeAgo}</div>
              </div>
              <button
                className="text-gray-400 hover:text-gray-600 ml-4"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDismiss(n.id);
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))
        )}

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <div className="flex items-center gap-2 px-4">
            <span className="text-sm font-medium text-gray-600">Old</span>
            <div className="w-6 h-6 bg-gray-400 text-white text-xs rounded-full flex items-center justify-center font-semibold">
              {oldNotifications.length}
            </div>
          </div>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {oldNotifications.map((n, idx) => (
          <div
            key={n.id}
            className={`flex items-center bg-white rounded-lg px-4 py-3 shadow-sm border-l-4 ${getTypeColor(n.type, n.read)} hover:bg-gray-50 transition-all duration-200 cursor-pointer`}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 mr-4 flex-shrink-0">
              {getTypeIcon(n.type)}
            </div>
            <div className="flex-1">
              <div className="text-base">{n.title}</div>
              <div className="text-sm text-gray-600 mt-1">{n.message}</div>
              <div className="text-xs text-gray-400 mt-1">{n.timeAgo}</div>
            </div>
            <button
              className="text-gray-400 hover:text-gray-600 ml-4"
              onClick={(e) => {
                e.stopPropagation();
                handleDismiss(n.id);
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
