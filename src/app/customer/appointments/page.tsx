"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AppointmentForm from "@/components/customer/AppointmentForm";
import AppointmentList from "@/components/customer/AppointmentList";
import {
  ArrowLeft,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import {
  AppointmentStatus,
  AppointmentData,
  AppointmentFormData,
  Vehicle,
  ConsultationType,
} from "@/lib/types/Appointment";

// Mock data - Replace with your actual data
const mockVehicles: Vehicle[] = [
  {
    id: "1",
    name: "2020 Toyota Camry",
    details: "License: ABC-123 | Silver | Gasoline",
  },
  {
    id: "2",
    name: "2019 Honda CR-V",
    details: "License: XYZ-789 | Blue | Gasoline",
  },
  {
    id: "3",
    name: "2021 Tesla Model 3",
    details: "License: EV-456 | White | Electric",
  },
];

const mockAppointments: AppointmentData[] = [
  {
    id: "1",
    vehicleId: "1",
    vehicleName: "2020 Toyota Camry",
    vehicleDetails: "License: ABC-123",
    consultationType: "general-checkup",
    consultationTypeLabel: "General Vehicle Checkup",
    appointmentDate: "2025-10-15",
    startTime: "09:00",
    endTime: "09:30",
    status: "pending",
    customerIssue: "Regular maintenance check",
    notes: "Please check tire pressure as well",
  },
  {
    id: "2",
    vehicleId: "2",
    vehicleName: "2019 Honda CR-V",
    vehicleDetails: "License: XYZ-789",
    consultationType: "specific-issue",
    consultationTypeLabel: "Specific Issue Consultation",
    appointmentDate: "2025-10-20",
    startTime: "14:00",
    endTime: "15:00",
    status: "confirmed",
    customerIssue: "Brake pedal feels soft",
  },
];

type NotificationType = "success" | "error" | "info";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] =
    useState<AppointmentData[]>(mockAppointments);
  const [editingAppointment, setEditingAppointment] =
    useState<AppointmentFormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (
    type: NotificationType,
    title: string,
    message: string
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const notification = { id, type, title, message };
    setNotifications((prev) => [...prev, notification]);

    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleCreateAppointment = async (data: AppointmentFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Validate no overlapping appointments
      const overlapping = appointments.find(
        (apt) =>
          apt.vehicleId === data.vehicleId &&
          apt.appointmentDate === data.appointmentDate &&
          apt.status !== "cancelled" &&
          ((data.startTime >= apt.startTime && data.startTime < apt.endTime) ||
            (data.endTime > apt.startTime && data.endTime <= apt.endTime) ||
            (data.startTime <= apt.startTime && data.endTime >= apt.endTime))
      );

      if (overlapping) {
        addNotification(
          "error",
          "Booking Failed",
          "There is already an appointment for this vehicle at the selected time."
        );
        return;
      }

      const vehicle = mockVehicles.find((v) => v.id === data.vehicleId);

      if (!vehicle) {
        addNotification("error", "Booking Failed", "Invalid vehicle selected.");
        return;
      }

      // Get consultation type label
      const getConsultationLabel = (type: ConsultationType): string => {
        switch (type) {
          case "general-checkup":
            return "General Vehicle Checkup";
          case "specific-issue":
            return "Specific Issue Consultation";
          case "maintenance-advice":
            return "Maintenance Advice";
          case "performance-issue":
            return "Performance Issue";
          case "safety-concern":
            return "Safety Concern";
          case "other":
            return "Other Consultation";
          default:
            return "General Consultation";
        }
      };

      const newAppointment: AppointmentData = {
        id: Math.random().toString(36).substr(2, 9),
        vehicleId: data.vehicleId,
        vehicleName: vehicle.name,
        vehicleDetails: vehicle.details,
        consultationType: data.consultationType,
        consultationTypeLabel: getConsultationLabel(data.consultationType),
        appointmentDate: data.appointmentDate,
        startTime: data.startTime,
        endTime: data.endTime,
        status: "pending",
        customerIssue: data.customerIssue,
        notes: data.notes,
      };

      setAppointments((prev) => [...prev, newAppointment]);
      addNotification(
        "success",
        "Appointment Booked!",
        `Your ${getConsultationLabel(
          data.consultationType
        )} appointment has been successfully scheduled.`
      );
      setShowForm(false);
    } catch (error) {
      addNotification(
        "error",
        "Booking Failed",
        "An error occurred while booking your appointment. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAppointment = async (data: AppointmentFormData) => {
    if (!editingAppointment) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check for overlapping appointments (excluding the current one)
      if (data.appointmentDate && data.startTime && data.endTime) {
        const overlapping = appointments.find(
          (apt) =>
            apt.id !== editingAppointment.id &&
            apt.vehicleId === editingAppointment.vehicleId &&
            apt.appointmentDate === data.appointmentDate &&
            apt.status !== "cancelled" &&
            ((data.startTime! >= apt.startTime &&
              data.startTime! < apt.endTime) ||
              (data.endTime! > apt.startTime && data.endTime! <= apt.endTime) ||
              (data.startTime! <= apt.startTime &&
                data.endTime! >= apt.endTime))
        );

        if (overlapping) {
          addNotification(
            "error",
            "Update Failed",
            "There is already an appointment for this vehicle at the selected time."
          );
          return;
        }
      }

      // Get consultation type label
      const getConsultationLabel = (type: ConsultationType): string => {
        switch (type) {
          case "general-checkup":
            return "General Vehicle Checkup";
          case "specific-issue":
            return "Specific Issue Consultation";
          case "maintenance-advice":
            return "Maintenance Advice";
          case "performance-issue":
            return "Performance Issue";
          case "safety-concern":
            return "Safety Concern";
          case "other":
            return "Other Consultation";
          default:
            return "General Consultation";
        }
      };

      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === editingAppointment.id
            ? {
                ...apt,
                appointmentDate: data.appointmentDate ?? apt.appointmentDate,
                startTime: data.startTime ?? apt.startTime,
                endTime: data.endTime ?? apt.endTime,
                consultationType: data.consultationType ?? apt.consultationType,
                consultationTypeLabel: data.consultationType
                  ? getConsultationLabel(data.consultationType)
                  : apt.consultationTypeLabel,
                customerIssue: data.customerIssue ?? apt.customerIssue,
                notes: data.notes ?? apt.notes,
              }
            : apt
        )
      );

      addNotification(
        "success",
        "Appointment Updated!",
        "Your appointment has been successfully updated."
      );
      setEditingAppointment(null);
      setShowForm(false);
    } catch (error) {
      addNotification(
        "error",
        "Update Failed",
        "An error occurred while updating your appointment. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAppointment = (appointment: AppointmentData) => {
    const formData: AppointmentFormData = {
      id: appointment.id,
      vehicleId: appointment.vehicleId,
      consultationType: appointment.consultationType,
      appointmentDate: appointment.appointmentDate,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      status: appointment.status,
      customerIssue: appointment.customerIssue,
      notes: appointment.notes,
    };
    setEditingAppointment(formData);
    setShowForm(true);
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setAppointments((prev) => prev.filter((apt) => apt.id !== appointmentId));
      addNotification(
        "success",
        "Appointment Cancelled",
        "Your appointment has been successfully cancelled."
      );
    } catch (error) {
      addNotification(
        "error",
        "Cancellation Failed",
        "An error occurred while cancelling your appointment. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (data: AppointmentFormData) => {
    if (editingAppointment) {
      await handleUpdateAppointment(data);
    } else {
      await handleCreateAppointment(data);
    }
  };

  const handleCancelForm = () => {
    setEditingAppointment(null);
    setShowForm(false);
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5" />;
      case "error":
        return <XCircle className="h-5 w-5" />;
      case "info":
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getNotificationColors = (type: NotificationType) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  return (
    <div className="min-h-screen bg-custom p-6">
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`w-96 border-2 ${getNotificationColors(
                notification.type
              )} animate-in slide-in-from-right`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <h4 className="font-semibold">{notification.title}</h4>
                    <p className="text-sm mt-1">{notification.message}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeNotification(notification.id)}
                    className="text-current hover:bg-black/10"
                  >
                    ×
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">My Appointments</h1>
            <p className="text-gray-600 mt-1">
              Manage your service appointments
            </p>
          </div>

          {!showForm && (
            <Button
              onClick={() => setShowForm(true)}
              className="bg-primary hover:bg-primary/90 text-white font-medium"
            >
              <Plus className="h-4 w-4 mr-2" />
              Book New Appointment
            </Button>
          )}
        </div>

        <div className="space-y-8">
          {/* Appointment Form */}
          {showForm && (
            <div className="max-w-3xl mx-auto">
              <AppointmentForm
                vehicles={mockVehicles}
                onSubmit={handleFormSubmit}
                onCancel={handleCancelForm}
                editingAppointment={editingAppointment || undefined}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* Appointment List */}
          <AppointmentList
            appointments={appointments}
            onEdit={handleEditAppointment}
            onDelete={handleDeleteAppointment}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
