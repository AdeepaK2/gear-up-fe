import React from "react";
import { Bell, User } from "lucide-react";

export default function Header() {
  return (
    // Use a fixed height (h-16) and remove extra top padding so main content can offset by the same amount
    <header className="fixed top-0 right-0 left-64 h-16 flex items-center px-6 bg-white border-b border-gray-200 shadow-sm z-40">
      <div className="flex items-center ml-auto">
        <Bell className="h-6 w-6 text-primary cursor-pointer" />
        <div className="mx-6 w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer">
          <User className="h-6 w-6 text-primary" />
        </div>
        <span className="font-medium text-primary">Customer Name</span>
      </div>
    </header>
  );
}
