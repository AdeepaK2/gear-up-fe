'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Calendar,
  Clock,
  Car,
  MessageSquare,
  FileText,
  Save,
  X,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AppointmentFormData,
  ConsultationType,
  Vehicle,
} from '@/lib/types/Appointment';
import { shopSettingsService, type ShopSettings } from '@/lib/services/shopSettingsService';

// Consultation options with realistic durations (in minutes)
const consultationTypes: {
  value: ConsultationType;
  label: string;
  description: string;
  duration: number;
}[] = [
  {
    value: 'GENERAL_CHECKUP',
    label: 'General Vehicle Checkup',
    description: 'Overall health check and maintenance advice',
    duration: 60,
  },
  {
    value: 'SPECIFIC_ISSUE',
    label: 'Specific Problem/Issue',
    description: 'I have a specific problem that needs diagnosis',
    duration: 90,
  },
  {
    value: 'MAINTENANCE_ADVICE',
    label: 'Maintenance Consultation',
    description: 'Advice on maintenance schedule and recommendations',
    duration: 90,
  },
  {
    value: 'PERFORMANCE_ISSUE',
    label: 'Performance Issue',
    description: 'Vehicle not performing as expected',
    duration: 120,
  },
  {
    value: 'SAFETY_CONCERN',
    label: 'Safety Concern',
    description: 'Safety-related issues or concerns',
    duration: 90,
  },
  {
    value: 'OTHER',
    label: 'Other',
    description: 'Other consultation needs',
    duration: 60,
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
    vehicleId: editingAppointment?.vehicleId || '',
    consultationType:
      editingAppointment?.consultationType || ('' as ConsultationType),
    appointmentDate: editingAppointment?.appointmentDate || '',
    startTime: editingAppointment?.startTime || '',
    endTime: editingAppointment?.endTime || '',
    customerIssue: editingAppointment?.customerIssue || '',
    notes: editingAppointment?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shopSettings, setShopSettings] = useState<ShopSettings | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);

  // Load shop settings on mount
  useEffect(() => {
    const loadShopSettings = async () => {
      try {
        const settings = await shopSettingsService.getShopSettings();
        setShopSettings(settings);
      } catch (error) {
        console.error('Failed to load shop settings:', error);
      }
    };
    loadShopSettings();
  }, []);

  // Generate available time slots based on shop settings
  useEffect(() => {
    if (!shopSettings) return;

    const slots: string[] = [];
    const [openHour, openMinute] = shopSettings.openingTime.split(':').map(Number);
    const [closeHour, closeMinute] = shopSettings.closingTime.split(':').map(Number);

    // Generate 30-minute intervals
    let currentHour = openHour;
    let currentMinute = openMinute;

    while (
      currentHour < closeHour ||
      (currentHour === closeHour && currentMinute < closeMinute)
    ) {
      const timeString = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
      slots.push(timeString);

      // Increment by 30 minutes
      currentMinute += 30;
      if (currentMinute >= 60) {
        currentMinute = 0;
        currentHour += 1;
      }
    }

    setAvailableTimeSlots(slots);
  }, [shopSettings]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.vehicleId) {
      newErrors.vehicleId = 'Please select a vehicle';
    }

    if (!formData.consultationType) {
      newErrors.consultationType = 'Please select a consultation type';
    }

    if (!formData.appointmentDate) {
      newErrors.appointmentDate = 'Please select an appointment date';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Please enter a start time';
    }

    // Validate that appointment is not in the past
    if (formData.appointmentDate && formData.startTime) {
      const appointmentDateTime = new Date(
        `${formData.appointmentDate}T${formData.startTime}`
      );

      if (appointmentDateTime < new Date()) {
        newErrors.appointmentDate = 'Appointment cannot be in the past';
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
          vehicleId: '',
          consultationType: '' as ConsultationType,
          appointmentDate: '',
          startTime: '',
          endTime: '',
          customerIssue: '',
          notes: '',
        });
      }
    } catch (error) {
      console.error('Error submitting appointment:', error);
    }
  };

  const selectedVehicle = vehicles.find((v) => v.id === formData.vehicleId);
  const selectedConsultationType = consultationTypes.find(
    (c) => c.value === formData.consultationType
  );

  // Get today's date for min attribute
  const today = new Date().toISOString().split('T')[0];

  const calculateEndTime = (startTime: string, duration: number): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const start = new Date();
    start.setHours(hours, minutes, 0, 0);
    const end = new Date(start.getTime() + duration * 60000);

    // Return in HH:mm format
    return end.toTimeString().slice(0, 5);
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-primary text-white">
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          {editingAppointment
            ? 'Edit Consultation Appointment'
            : 'Book Consultation Appointment'}
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
                    'border-2',
                    errors.vehicleId && 'border-red-500'
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
              onValueChange={(value: ConsultationType) => {
                const selectedType = consultationTypes.find(
                  (c) => c.value === value
                );
                let endTime = formData.endTime;

                if (formData.startTime && selectedType) {
                  endTime = calculateEndTime(
                    formData.startTime,
                    selectedType.duration
                  );
                }

                setFormData({
                  ...formData,
                  consultationType: value,
                  endTime,
                });
              }}
            >
              <SelectTrigger
                className={cn(
                  'border-2',
                  errors.consultationType && 'border-red-500'
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
                'border-2',
                errors.appointmentDate && 'border-red-500'
              )}
            />
            {errors.appointmentDate && (
              <p className="text-red-500 text-sm">{errors.appointmentDate}</p>
            )}
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label
              htmlFor="startTime"
              className="text-primary font-medium flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Preferred Start Time
            </Label>
            {availableTimeSlots.length > 0 ? (
              <Select
                value={formData.startTime}
                onValueChange={(value) => {
                  const selectedType = consultationTypes.find(
                    (c) => c.value === formData.consultationType
                  );
                  let endTime = formData.endTime;

                  if (selectedType) {
                    endTime = calculateEndTime(value, selectedType.duration);
                  }

                  setFormData({ ...formData, startTime: value, endTime });
                }}
              >
                <SelectTrigger
                  className={cn(
                    'border-2',
                    errors.startTime && 'border-red-500'
                  )}
                >
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => {
                  const startTime = e.target.value;
                  const selectedType = consultationTypes.find(
                    (c) => c.value === formData.consultationType
                  );
                  let endTime = formData.endTime;

                  if (selectedType) {
                    endTime = calculateEndTime(startTime, selectedType.duration);
                  }

                  setFormData({ ...formData, startTime, endTime });
                }}
                className={cn('border-2', errors.startTime && 'border-red-500')}
              />
            )}

            {errors.startTime && (
              <p className="text-red-500 text-sm">{errors.startTime}</p>
            )}
            {shopSettings && (
              <p className="text-xs text-gray-500">
                Available hours: {shopSettings.openingTime} - {shopSettings.closingTime}
              </p>
            )}
            <p className="text-xs text-gray-500">
              The duration will be determined by our service team based on your
              needs
            </p>
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
                'Processing...'
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {editingAppointment
                    ? 'Update Consultation'
                    : 'Book Consultation'}
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
