import React from "react";
import { Bell, User } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 right-0 left-64 flex justify-end items-center p-6 bg-white z-40">
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
