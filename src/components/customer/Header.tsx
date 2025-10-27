import React from "react";
import { Bell, User } from "lucide-react";

export default function Header() {
  return (
    // Fixed header that accounts for the sidebar width on large screens and is full-width on small screens
    <header className="fixed top-0 left-0 right-0 h-16 flex items-center px-4 md:px-6 bg-white border-b border-gray-200 shadow-sm z-40">
      {/* On md+ screens the sidebar occupies 16rem (left-64). We add a wrapper to push header contents to the right so icons align visually with the main content. */}
      <div className="w-full max-w-[calc(100%_-_16rem)] ml-auto flex items-center">
        <div className="flex items-center ml-auto">
          <Bell className="h-6 w-6 text-primary cursor-pointer" />
          <div className="mx-6 w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer">
            <User className="h-6 w-6 text-primary" />
          </div>
          <span className="font-medium text-primary">Customer Name</span>
        </div>
      </div>
    </header>
  );
}
