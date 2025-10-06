import React from "react";
import { Bell, User } from "lucide-react";

export default function Header() {
  return (
    <header className="flex justify-end items-center p-6 bg-white border-b shadow-sm">
      <div className="flex items-center">
        <Bell className="h-6 w-6 text-gray-600 cursor-pointer mr-14" />
        <div className="mx-8 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer">
          <User className="h-5 w-5 text-gray-600" />
        </div>
        <span className="font-medium">Anne Perera</span>
      </div>
    </header>
  );
}
