import React from "react";
import { Bell } from "lucide-react";

export default function Header() {
  return (
    <header className="flex justify-end items-center p-6 bg-white border-b shadow-sm">
      <div className="flex items-center space-x-6">
        <Bell className="h-6 w-6 text-gray-600 cursor-pointer" />
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>{" "}
        {/* Profile circle */}
        <span className="font-medium">Anne Perera</span>
      </div>
    </header>
  );
}
