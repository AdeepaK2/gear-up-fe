'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { shopSettingsService, type ShopSettings } from '@/lib/services/shopSettingsService';

export default function ShopStatusBanner() {
  const [shopSettings, setShopSettings] = useState<ShopSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadShopSettings = async () => {
      try {
        const settings = await shopSettingsService.getShopSettings();
        setShopSettings(settings);
      } catch (error) {
        console.error('Failed to load shop settings:', error);
      } finally {
        setLoading(false);
      }
    };
    loadShopSettings();
  }, []);

  if (loading || !shopSettings) {
    return null;
  }

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const operatingDaysText = shopSettings.operatingDays
    .sort((a, b) => a - b)
    .map(day => dayNames[day])
    .join(', ');

  const isOpen = shopSettings.isShopOpen;

  return (
    <div className={`${isOpen ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border-b-2 py-3`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            {isOpen ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-800">We're Open!</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="font-semibold text-red-800">Currently Closed</span>
              </>
            )}
          </div>

          {/* Operating Hours */}
          {isOpen && (
            <>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="h-4 w-4" />
                <span className="text-sm">
                  <span className="font-medium">Hours:</span> {shopSettings.openingTime} - {shopSettings.closingTime}
                </span>
              </div>

              {/* Operating Days */}
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  <span className="font-medium">Open:</span> {operatingDaysText}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
