"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  Car,
  MessageSquare,
  FileText,
  Save,
  X,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AppointmentFormData,
  ConsultationType,
  Vehicle,
} from "@/lib/types/Appointment";

// Consultation options with user-friendly labels
const consultationTypes: {
  value: ConsultationType;
  label: string;
  description: string;
}[] = [
  {
    value: "general-checkup",
    label: "General Vehicle Checkup",
    description: "Overall health check and maintenance advice",
  },
  {
    value: "specific-issue",
    label: "Specific Problem/Issue",
    description: "I have a specific problem that needs diagnosis",
  },
  {
    value: "maintenance-advice",
    label: "Maintenance Consultation",
    description: "Advice on maintenance schedule and recommendations",
  },
  {
    value: "performance-issue",
    label: "Performance Issue",
    description: "Vehicle not performing as expected",
  },
  {
    value: "safety-concern",
    label: "Safety Concern",
    description: "Safety-related issues or concerns",
  },
  {
    value: "other",
    label: "Other",
    description: "Other consultation needs",
  },
];

interface AppointmentFormProps {
  vehicles: Vehicle[];
  onSubmit: (data: AppointmentFormData) => Promise<void>;
  onCancel?: () => void;
  editingAppointment?: AppointmentFormData;
  isLoading?: boolean;
}

export default function AppointmentForm({
  vehicles,
  onSubmit,
  onCancel,
  editingAppointment,
  isLoading = false,
}: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    vehicleId: editingAppointment?.vehicleId || "",
    consultationType:
      editingAppointment?.consultationType || ("" as ConsultationType),
    appointmentDate: editingAppointment?.appointmentDate || "",
    startTime: editingAppointment?.startTime || "",
    endTime: editingAppointment?.endTime || "",
    customerIssue: editingAppointment?.customerIssue || "",
    notes: editingAppointment?.notes || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.vehicleId) {
      newErrors.vehicleId = "Please select a vehicle";
    }

    if (!formData.consultationType) {
      newErrors.consultationType = "Please select a consultation type";
    }

    if (!formData.appointmentDate) {
      newErrors.appointmentDate = "Please select an appointment date";
    }

    if (!formData.startTime) {
      newErrors.startTime = "Please enter a start time";
    }

    if (!formData.endTime) {
      newErrors.endTime = "Please enter an end time";
    }

    // Validate that end time is after start time
    if (
      formData.startTime &&
      formData.endTime &&
      formData.startTime >= formData.endTime
    ) {
      newErrors.endTime = "End time must be after start time";
    }

    // Validate that appointment is not in the past
    if (formData.appointmentDate && formData.startTime) {
      const appointmentDateTime = new Date(
        `${formData.appointmentDate}T${formData.startTime}`
      );

      if (appointmentDateTime < new Date()) {
        newErrors.appointmentDate = "Appointment cannot be in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const appointmentData: AppointmentFormData = {
      ...formData,
      id: editingAppointment?.id,
    };

    try {
      await onSubmit(appointmentData);

      // Reset form if creating new appointment
      if (!editingAppointment) {
        setFormData({
          vehicleId: "",
          consultationType: "" as ConsultationType,
          appointmentDate: "",
          startTime: "",
          endTime: "",
          customerIssue: "",
          notes: "",
        });
      }
    } catch (error) {
      console.error("Error submitting appointment:", error);
    }
  };

  const selectedVehicle = vehicles.find((v) => v.id === formData.vehicleId);
  const selectedConsultationType = consultationTypes.find(
    (c) => c.value === formData.consultationType
  );

  // Get today's date for min attribute
  const today = new Date().toISOString().split("T")[0];

  return (
    <Card className="w-full">
      <CardHeader className="bg-primary text-white">
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          {editingAppointment
            ? "Edit Consultation Appointment"
            : "Book Consultation Appointment"}
        </CardTitle>
        <p className="text-sm text-white/90 mt-1">
          Book a consultation with our experts. Services will be recommended
          after the consultation.
        </p>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vehicle Selection */}
          {!editingAppointment && (
            <div className="space-y-2">
              <Label
                htmlFor="vehicle"
                className="text-primary font-medium flex items-center gap-2"
              >
                <Car className="h-4 w-4" />
                Select Vehicle
              </Label>
              <Select
                value={formData.vehicleId}
                onValueChange={(value) =>
                  setFormData({ ...formData, vehicleId: value })
                }
              >
                <SelectTrigger
                  className={cn(
                    "border-2",
                    errors.vehicleId && "border-red-500"
                  )}
                >
                  <SelectValue placeholder="Choose your vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.vehicleId && (
                <p className="text-red-500 text-sm">{errors.vehicleId}</p>
              )}

              {/* Vehicle Info Display */}
              {selectedVehicle && (
                <div className="bg-ternary p-3 rounded-lg mt-2">
                  <p className="text-sm text-primary font-medium">
                    Selected: {selectedVehicle.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedVehicle.details}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Consultation Type Selection */}
          <div className="space-y-2">
            <Label
              htmlFor="consultation"
              className="text-primary font-medium flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              What do you need help with?
            </Label>
            <Select
              value={formData.consultationType}
              onValueChange={(value: ConsultationType) =>
                setFormData({ ...formData, consultationType: value })
              }
            >
              <SelectTrigger
                className={cn(
                  "border-2",
                  errors.consultationType && "border-red-500"
                )}
              >
                <SelectValue placeholder="Select consultation type" />
              </SelectTrigger>
              <SelectContent>
                {consultationTypes.map((consultation) => (
                  <SelectItem
                    key={consultation.value}
                    value={consultation.value}
                  >
                    {consultation.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.consultationType && (
              <p className="text-red-500 text-sm">{errors.consultationType}</p>
            )}

            {/* Consultation Info Display */}
            {selectedConsultationType && (
              <div className="bg-ternary p-3 rounded-lg mt-2">
                <p className="text-sm text-primary font-medium">
                  {selectedConsultationType.label}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedConsultationType.description}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Our expert will assess your vehicle and recommend appropriate
                  services.
                </p>
              </div>
            )}
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label
              htmlFor="appointmentDate"
              className="text-primary font-medium flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Consultation Date
            </Label>
            <Input
              id="appointmentDate"
              type="date"
              value={formData.appointmentDate}
              min={today}
              onChange={(e) =>
                setFormData({ ...formData, appointmentDate: e.target.value })
              }
              className={cn(
                "border-2",
                errors.appointmentDate && "border-red-500"
              )}
            />
            {errors.appointmentDate && (
              <p className="text-red-500 text-sm">{errors.appointmentDate}</p>
            )}
          </div>

          {/* Time Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="startTime"
                className="text-primary font-medium flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                Start Time
              </Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                className={cn("border-2", errors.startTime && "border-red-500")}
              />
              {errors.startTime && (
                <p className="text-red-500 text-sm">{errors.startTime}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime" className="text-primary font-medium">
                End Time
              </Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                className={cn("border-2", errors.endTime && "border-red-500")}
              />
              {errors.endTime && (
                <p className="text-red-500 text-sm">{errors.endTime}</p>
              )}
            </div>
          </div>

          {/* Customer Issue Description */}
          <div className="space-y-2">
            <Label
              htmlFor="customerIssue"
              className="text-primary font-medium flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Describe Your Issue (Optional)
            </Label>
            <Input
              id="customerIssue"
              value={formData.customerIssue}
              onChange={(e) =>
                setFormData({ ...formData, customerIssue: e.target.value })
              }
              placeholder="Briefly describe what you're experiencing with your vehicle"
              className="border-2"
            />
            <p className="text-xs text-gray-500">
              This helps our experts prepare for your consultation
            </p>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-primary font-medium">
              Additional Notes (Optional)
            </Label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Any additional information you'd like to share"
              rows={3}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                "Processing..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {editingAppointment
                    ? "Update Consultation"
                    : "Book Consultation"}
                </>
              )}
            </Button>

            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1 border-2 border-gray-300 hover:bg-gray-50"
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
