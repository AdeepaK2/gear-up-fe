"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Calendar as CalendarIcon,
  X,
  Plus,
  Save,
  Settings as SettingsIcon,
} from "lucide-react";
import {
  shopSettingsService,
  type ShopSettings,
  type UpdateShopSettingsRequest,
  type ClosedDateRequest,
} from "@/lib/services/shopSettingsService";
import { useToast } from "@/contexts/ToastContext";

const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  // Form state
  const [openingTime, setOpeningTime] = useState("09:00");
  const [closingTime, setClosingTime] = useState("18:00");
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [isShopOpen, setIsShopOpen] = useState(true);

  // Closed dates
  const [newClosedDate, setNewClosedDate] = useState("");
  const [closedDateReason, setClosedDateReason] = useState("");
  const [addingDate, setAddingDate] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await shopSettingsService.getShopSettingsAdmin();
      setSettings(data);
      
      // Populate form
      setOpeningTime(data.openingTime);
      setClosingTime(data.closingTime);
      setSelectedDays(data.operatingDays);
      setIsShopOpen(data.isShopOpen);
    } catch (error: any) {
      console.error("Failed to load settings:", error);
      toast.error(error.message || "Failed to load shop settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);

      const updateData: UpdateShopSettingsRequest = {
        openingTime,
        closingTime,
        operatingDays: selectedDays,
        isShopOpen,
      };

      const updated = await shopSettingsService.updateShopSettings(updateData);
      setSettings(updated);
      toast.success("Shop settings updated successfully!");
    } catch (error: any) {
      console.error("Failed to update settings:", error);
      toast.error(error.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day].sort((a, b) => a - b)
    );
  };

  const handleAddClosedDate = async () => {
    if (!newClosedDate) {
      toast.error("Please select a date");
      return;
    }

    try {
      setAddingDate(true);

      const data: ClosedDateRequest = {
        date: newClosedDate,
        reason: closedDateReason || undefined,
      };

      const updated = await shopSettingsService.addClosedDate(data);
      setSettings(updated);
      setNewClosedDate("");
      setClosedDateReason("");
      toast.success("Closed date added successfully!");
    } catch (error: any) {
      console.error("Failed to add closed date:", error);
      toast.error(error.message || "Failed to add closed date");
    } finally {
      setAddingDate(false);
    }
  };

  const handleRemoveClosedDate = async (date: string) => {
    try {
      const updated = await shopSettingsService.removeClosedDate(date);
      setSettings(updated);
      toast.success("Closed date removed successfully!");
    } catch (error: any) {
      console.error("Failed to remove closed date:", error);
      toast.error(error.message || "Failed to remove closed date");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-gray-600">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
            <SettingsIcon className="h-8 w-8" />
            Shop Settings
          </h1>
          <p className="text-lg text-gray-600">
            Manage operating hours, days, and shop status
          </p>
        </div>
        {!isShopOpen && (
          <Badge variant="destructive" className="text-lg px-4 py-2">
            Shop Closed
          </Badge>
        )}
      </div>

      <Tabs defaultValue="hours" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hours">Operating Hours</TabsTrigger>
          <TabsTrigger value="days">Operating Days</TabsTrigger>
          <TabsTrigger value="closed">Closed Dates</TabsTrigger>
        </TabsList>

        {/* Operating Hours Tab */}
        <TabsContent value="hours" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">Shop Status</h3>
                  <p className="text-sm text-gray-600">
                    Control whether the shop is open for business
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Label htmlFor="shop-status" className="text-base">
                    {isShopOpen ? "Open" : "Closed"}
                  </Label>
                  <Switch
                    id="shop-status"
                    checked={isShopOpen}
                    onCheckedChange={setIsShopOpen}
                  />
                </div>
              </div>

              {!isShopOpen && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Shop is currently closed. Customers cannot book appointments
                    or create projects.
                  </AlertDescription>
                </Alert>
              )}

              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Operating Hours
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="opening-time">Opening Time</Label>
                    <Input
                      id="opening-time"
                      type="time"
                      value={openingTime}
                      onChange={(e) => setOpeningTime(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="closing-time">Closing Time</Label>
                    <Input
                      id="closing-time"
                      type="time"
                      value={closingTime}
                      onChange={(e) => setClosingTime(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="bg-primary hover:bg-primary/90"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Operating Days Tab */}
        <TabsContent value="days" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Operating Days</h3>
                <p className="text-sm text-gray-600">
                  Select the days when your shop is open for business
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {DAYS_OF_WEEK.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleDay(day.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedDays.includes(day.value)
                        ? "border-primary bg-primary/10 text-primary font-semibold"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{day.label}</span>
                      {selectedDays.includes(day.value) && (
                        <CheckCircle2 className="h-5 w-5" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {selectedDays.length === 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please select at least one operating day
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveSettings}
                  disabled={saving || selectedDays.length === 0}
                  className="bg-primary hover:bg-primary/90"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Closed Dates Tab */}
        <TabsContent value="closed" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Add Closed Date
                </h3>
                <p className="text-sm text-gray-600">
                  Mark specific dates when the shop will be closed (holidays,
                  maintenance, etc.)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="closed-date">Date</Label>
                  <Input
                    id="closed-date"
                    type="date"
                    value={newClosedDate}
                    onChange={(e) => setNewClosedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="reason">Reason (Optional)</Label>
                  <Input
                    id="reason"
                    type="text"
                    value={closedDateReason}
                    onChange={(e) => setClosedDateReason(e.target.value)}
                    placeholder="e.g., Christmas Holiday, Maintenance"
                    className="mt-1"
                  />
                </div>
              </div>

              <Button
                onClick={handleAddClosedDate}
                disabled={addingDate || !newClosedDate}
                className="bg-primary hover:bg-primary/90"
              >
                {addingDate ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Closed Date
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* List of Closed Dates */}
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Upcoming Closed Dates</h3>

              {!settings?.closedDates || settings.closedDates.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No closed dates scheduled
                </p>
              ) : (
                <div className="space-y-2">
                  {settings.closedDates
                    .sort()
                    .filter((date) => new Date(date) >= new Date())
                    .map((date) => (
                      <div
                        key={date}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <CalendarIcon className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">
                              {new Date(date).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveClosedDate(date)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
