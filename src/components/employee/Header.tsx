import React from 'react';
import { Bell } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex justify-end items-center p-4 bg-white border-b shadow-sm">
      <div className="flex items-center space-x-4">
        <Bell className="h-6 w-6 text-gray-600 cursor-pointer" />
        <img
          src="/image.jpg" // Replace with actual image path or URL
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="font-medium">John Doe</span>
      </div>
    </header>
  );
}