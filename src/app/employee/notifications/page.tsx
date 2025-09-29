"use client";
import React from "react";

const initialNotifications = [
  {
    message:
      "A new service appointment has been scheduled for vehicle [Vehicle ID] on [Date] at [Time].",
    date: "Sep 5 2025",
    time: "18.00",
    read: false,
  },
  {
    message:
      "A new service appointment has been scheduled for vehicle [Vehicle ID] on [Date] at [Time].",
    date: "Sep 5 2025",
    time: "18.00",
    read: true,
  },
  {
    message:
      "A new service appointment has been scheduled for vehicle [Vehicle ID] on [Date] at [Time].",
    date: "Sep 5 2025",
    time: "18.00",
    read: true,
  },
  {
    message:
      "A new service appointment has been scheduled for vehicle [Vehicle ID] on [Date] at [Time].",
    date: "Sep 5 2025",
    time: "18.00",
    read: true,
  },
  {
    message:
      "A new service appointment has been scheduled for vehicle [Vehicle ID] on [Date] at [Time].",
    date: "Sep 5 2025",
    time: "18.00",
    read: true,
  },
];

export default function EmployeeNotifications() {
  const [notifications, setNotifications] = React.useState(initialNotifications);
  const [selectedIdx, setSelectedIdx] = React.useState<number | null>(null);

  const handleDismiss = (idx: number) => {
    setNotifications((prev) => prev.filter((_, i) => i !== idx));
    if (selectedIdx === idx) setSelectedIdx(null);
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <button className="text-sm font-medium text-gray-600 hover:underline">
          Mark all as read
        </button>
      </div>
      <div className="space-y-2">
        {notifications.map((n, idx) => (
          <div
            key={idx}
            className={`flex items-center bg-white rounded px-4 py-3 shadow-sm cursor-pointer ${
              selectedIdx === idx ? "border-2 border-blue-500" : ""
            }`}
            onClick={() => setSelectedIdx(idx)}
          >
            <div className="w-10 h-10 rounded-full bg-gray-200 mr-8 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-base">{n.message}</div>
              <div className="text-xs text-gray-400 mt-1">{n.date}</div>
            </div>
            <div className="flex flex-col items-end ml-4">
              <span className="text-xs text-gray-400">{n.time}</span>
              <button
                className="text-gray-400 hover:text-gray-600 text-lg leading-none mt-2"
                aria-label="Dismiss"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDismiss(idx);
                }}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
