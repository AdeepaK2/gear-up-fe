"use client";

import { useEffect, useState } from "react";
import { isDemoMode } from "../../lib/services/demoAuthService";

export default function DemoModeBanner() {
  const [isDemo, setIsDemo] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check demo mode initially
    setIsDemo(isDemoMode());

    // Also listen for storage changes (in case user logs in/out in another tab)
    const handleStorageChange = () => {
      setIsDemo(isDemoMode());
    };

    window.addEventListener('storage', handleStorageChange);

    // Re-check periodically to catch same-tab changes
    const interval = setInterval(() => {
      setIsDemo(isDemoMode());
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  if (!isDemo || !isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 text-gray-900 px-4 py-2 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
          <span className="text-sm font-semibold">
            🎭 DEMO MODE ACTIVE
          </span>
          <span className="text-xs opacity-90 hidden sm:inline">
            - You're using a demo account without backend authentication
          </span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-900 hover:text-gray-700 p-1 rounded hover:bg-amber-500/20 transition-colors"
          aria-label="Dismiss banner"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
