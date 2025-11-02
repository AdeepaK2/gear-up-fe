import React from "react";
import { Bell, User } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 left-64 right-0 flex justify-end items-center p-6 bg-gray-50 z-40 border-b border-gray-200 h-20">
      <div className="flex items-center gap-4">
        <Bell className="h-6 w-6 text-gray-600 cursor-pointer hover:text-gray-900 transition-colors" />
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
          <User className="h-6 w-6 text-gray-600" />
        </div>
        <span className="font-medium text-gray-700">Anne Perera</span>
      </div>
    </header>
  );
}
