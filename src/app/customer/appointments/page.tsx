"use client";

import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import AppointmentForm from "@/components/customer/AppointmentForm";
import AppointmentList from "@/components/customer/AppointmentList";
import NotificationCenter, {
  createNotification,
  type Notification,
  type NotificationType,
} from "@/components/customer/NotificationCenter";
import {
  timeRangesOverlap,
  getConsultationLabel,
  type ConsultationType,
} from "@/lib/utils/appointments";
import {
  AppointmentData,
  AppointmentFormData,
  Vehicle,
} from "@/lib/types/Appointment";

/**
 * Mock vehicle data - acts as initial state until backend integration.
 * Keep this structure stable to maintain UI contract with future API endpoints.
 */
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

/**
 * Mock appointment data - acts as initial state until backend integration.
 */
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

/**
 * AppointmentsPage - Customer appointment management dashboard.
 *
 * @description Orchestrates state for appointment CRUD operations with validation.
 * Delegates presentation to AppointmentForm, AppointmentList, and NotificationCenter.
 * Implements business rules for overlap detection and time validation.
 */
export default function AppointmentsPage() {
  const [appointments, setAppointments] =
    useState<AppointmentData[]>(mockAppointments);
  const [editingAppointment, setEditingAppointment] =
    useState<AppointmentFormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Ref to track the "Book New Appointment" button for focus management
  const bookButtonRef = useRef<HTMLButtonElement>(null);

  /**
   * Adds a notification to the queue.
   * Uses factory function to ensure consistent notification structure.
   */
  const addNotification = useCallback(
    (type: NotificationType, title: string, message: string) => {
      const notification = createNotification(type, title, message);
      setNotifications((prev) => [...prev, notification]);
    },
    []
  );

  /**
   * Removes a notification by ID.
   */
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  /**
   * Checks if a new appointment overlaps with existing appointments.
   * Uses minute-based time comparison for precision.
   *
   * @returns The overlapping appointment or undefined if no overlap
   */
  const findOverlappingAppointment = useCallback(
    (
      vehicleId: string,
      appointmentDate: string,
      startTime: string,
      endTime: string,
      excludeId?: string
    ): AppointmentData | undefined => {
      return appointments.find(
        (apt) =>
          apt.id !== excludeId &&
          apt.vehicleId === vehicleId &&
          apt.appointmentDate === appointmentDate &&
          apt.status !== "cancelled" &&
          timeRangesOverlap(startTime, endTime, apt.startTime, apt.endTime)
      );
    },
    [appointments]
  );

  /**
   * Creates a new appointment after validation.
   */
  const createAppointment = useCallback(
    async (data: AppointmentFormData) => {
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Validate no overlapping appointments
        const overlapping = findOverlappingAppointment(
          data.vehicleId,
          data.appointmentDate,
          data.startTime,
          data.endTime
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
          addNotification(
            "error",
            "Booking Failed",
            "Invalid vehicle selected."
          );
          return;
        }

        const newAppointment: AppointmentData = {
          id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
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

        // Return focus to booking button after successful creation
        setTimeout(() => bookButtonRef.current?.focus(), 100);
      } catch (error) {
        addNotification(
          "error",
          "Booking Failed",
          "An error occurred while booking your appointment. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [findOverlappingAppointment, addNotification]
  );

  /**
   * Updates an existing appointment after validation.
   */
  const updateAppointment = useCallback(
    async (data: AppointmentFormData) => {
      if (!editingAppointment) return;

      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Check for overlapping appointments (excluding the current one)
        if (data.appointmentDate && data.startTime && data.endTime) {
          const overlapping = findOverlappingAppointment(
            editingAppointment.vehicleId,
            data.appointmentDate,
            data.startTime,
            data.endTime,
            editingAppointment.id
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

        setAppointments((prev) =>
          prev.map((apt) =>
            apt.id === editingAppointment.id
              ? {
                  ...apt,
                  appointmentDate: data.appointmentDate ?? apt.appointmentDate,
                  startTime: data.startTime ?? apt.startTime,
                  endTime: data.endTime ?? apt.endTime,
                  consultationType:
                    data.consultationType ?? apt.consultationType,
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

        // Return focus to booking button after successful update
        setTimeout(() => bookButtonRef.current?.focus(), 100);
      } catch (error) {
        addNotification(
          "error",
          "Update Failed",
          "An error occurred while updating your appointment. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [editingAppointment, findOverlappingAppointment, addNotification]
  );

  /**
   * Prepares appointment for editing by converting to form data.
   */
  const editAppointment = useCallback((appointment: AppointmentData) => {
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
  }, []);

  /**
   * Deletes an appointment after confirmation.
   */
  const deleteAppointment = useCallback(
    async (appointmentId: string) => {
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setAppointments((prev) =>
          prev.filter((apt) => apt.id !== appointmentId)
        );
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
    },
    [addNotification]
  );

  /**
   * Handles form submission, routing to create or update.
   */
  const submitForm = useCallback(
    async (data: AppointmentFormData) => {
      if (editingAppointment) {
        await updateAppointment(data);
      } else {
        await createAppointment(data);
      }
    },
    [editingAppointment, updateAppointment, createAppointment]
  );

  /**
   * Cancels form and resets editing state.
   * Returns focus to the booking button.
   */
  const cancelForm = useCallback(() => {
    setEditingAppointment(null);
    setShowForm(false);

    // Return focus to booking button when form is cancelled
    setTimeout(() => bookButtonRef.current?.focus(), 100);
  }, []);

  /**
   * Opens the form to create a new appointment.
   */
  const openCreateForm = useCallback(() => {
    setEditingAppointment(null);
    setShowForm(true);
  }, []);

  /**
   * Sorted appointments by date and time (most recent first).
   * Memoized to avoid recalculation on every render.
   */
  const sortedAppointments = useMemo(() => {
    return [...appointments].sort((a, b) => {
      const dateCompare = b.appointmentDate.localeCompare(a.appointmentDate);
      if (dateCompare !== 0) return dateCompare;
      return b.startTime.localeCompare(a.startTime);
    });
  }, [appointments]);

  return (
    <div className="min-h-screen space-y-6">
      {/* Notification Center */}
      <NotificationCenter
        notifications={notifications}
        onRemove={removeNotification}
      />

      {/* Page Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">My Appointments</h1>
          <p className="text-gray-600 mt-1">Manage your service appointments</p>
        </div>

        {!showForm && (
          <Button
            ref={bookButtonRef}
            onClick={openCreateForm}
            className="bg-primary hover:bg-primary/90 text-white font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Book new appointment"
          >
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            Book New Appointment
          </Button>
        )}
      </header>

      <div className="space-y-8">
        {/* Appointment Form */}
        {showForm && (
          <section aria-labelledby="form-heading" className="max-w-3xl mx-auto">
            <h2 id="form-heading" className="sr-only">
              {editingAppointment
                ? "Edit Appointment"
                : "Create New Appointment"}
            </h2>
            <AppointmentForm
              vehicles={mockVehicles}
              onSubmit={submitForm}
              onCancel={cancelForm}
              editingAppointment={editingAppointment || undefined}
              isLoading={isLoading}
            />
          </section>
        )}

        {/* Appointment List or Empty State */}
        {sortedAppointments.length === 0 ? (
          <section
            aria-labelledby="empty-heading"
            className="flex flex-col items-center justify-center py-16 px-4"
          >
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center border border-gray-100">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-primary" aria-hidden="true" />
              </div>
              <h2
                id="empty-heading"
                className="text-xl font-bold text-gray-900 mb-2"
              >
                No Appointments Yet
              </h2>
              <p className="text-gray-600 mb-6">
                Get started by booking your first service appointment
              </p>
              <Button
                onClick={openCreateForm}
                className="bg-primary hover:bg-primary/90 text-white font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                Book Your First Appointment
              </Button>
            </div>
          </section>
        ) : (
          <section aria-labelledby="appointments-heading">
            <h2 id="appointments-heading" className="sr-only">
              Your Appointments
            </h2>
            <AppointmentList
              appointments={sortedAppointments}
              onEdit={editAppointment}
              onDelete={deleteAppointment}
              isLoading={isLoading}
            />
          </section>
        )}
      </div>
    </div>
  );
}
