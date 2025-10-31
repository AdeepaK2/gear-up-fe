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
  Appointment,
} from "@/lib/types/Appointment";
import { appointmentService } from "@/lib/services/appointmentService";
import { vehicleService } from "@/lib/services/vehicleService";
import type { Vehicle as BackendVehicle } from "@/lib/types/Vehicle";
import { useToast } from "@/contexts/ToastContext";

/**
 * Helper function to convert backend vehicle to UI vehicle format
 */
const convertVehicleToUIFormat = (vehicle: BackendVehicle): Vehicle => ({
  id: String(vehicle.id),
  name: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
  details: `License: ${vehicle.licensePlate} | VIN: ${vehicle.vin}`,
  make: vehicle.make,
  model: vehicle.model,
  year: vehicle.year,
  licensePlate: vehicle.licensePlate,
});

/**
 * Helper function to convert backend appointment to UI appointment format
 */
const convertAppointmentToUIFormat = (
  appointment: Appointment,
  vehicles: BackendVehicle[]
): AppointmentData => {
  const vehicle = vehicles.find((v) => v.id === appointment.vehicleId);
  const vehicleUI = vehicle ? convertVehicleToUIFormat(vehicle) : null;

  return {
    id: String(appointment.id),
    vehicleId: String(appointment.vehicleId),
    vehicleName: vehicleUI?.name || "Unknown Vehicle",
    vehicleDetails: vehicleUI?.details || "",
    consultationType: "general-checkup", // Default since backend doesn't have this field
    consultationTypeLabel: "General Service",
    appointmentDate: appointment.date,
    startTime: appointment.startTime || "09:00",
    endTime: appointment.endTime || "10:00",
    status: appointment.status as any,
    customerIssue: appointment.notes || "",
    notes: appointment.notes || "",
  };
};

/**
 * AppointmentsPage - Customer appointment management dashboard.
 *
 * @description Orchestrates state for appointment CRUD operations with validation.
 * Delegates presentation to AppointmentForm, AppointmentList, and NotificationCenter.
 * Implements business rules for overlap detection and time validation.
 */
export default function AppointmentsPage() {
  const toast = useToast();
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [backendVehicles, setBackendVehicles] = useState<BackendVehicle[]>([]);
  const [editingAppointment, setEditingAppointment] =
    useState<AppointmentFormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Ref to track the "Book New Appointment" button for focus management
  const bookButtonRef = useRef<HTMLButtonElement>(null);

  /**
   * Fetch vehicles and appointments from backend on mount
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setInitialLoading(true);

        // Fetch vehicles
        const vehiclesData = await vehicleService.getAllVehicles();
        setBackendVehicles(vehiclesData);
        const uiVehicles = vehiclesData.map(convertVehicleToUIFormat);
        setVehicles(uiVehicles);

        // Fetch appointments
        const appointmentsData = await appointmentService.getAllAppointments();
        const uiAppointments = appointmentsData.map((apt) =>
          convertAppointmentToUIFormat(apt, vehiclesData)
        );
        setAppointments(uiAppointments);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load appointments and vehicles");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [toast]);

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

        const vehicle = vehicles.find((v: Vehicle) => v.id === data.vehicleId);

        if (!vehicle) {
          addNotification(
            "error",
            "Booking Failed",
            "Invalid vehicle selected."
          );
          return;
        }

        // Call backend API to create appointment
        const createdAppointment = await appointmentService.createAppointment({
          date: data.appointmentDate,
          notes: data.notes || data.customerIssue,
          vehicleId: Number(data.vehicleId),
        });

        // Convert backend response to UI format
        const newAppointment = convertAppointmentToUIFormat(
          createdAppointment,
          backendVehicles
        );

        setAppointments((prev) => [...prev, newAppointment]);
        toast.success("Appointment booked successfully!");
        addNotification(
          "success",
          "Appointment Booked!",
          `Your appointment has been successfully scheduled.`
        );
        setShowForm(false);

        // Return focus to booking button after successful creation
        setTimeout(() => bookButtonRef.current?.focus(), 100);
      } catch (error: any) {
        const errorMessage = error.message || "An error occurred while booking your appointment. Please try again.";
        toast.error(errorMessage);
        addNotification(
          "error",
          "Booking Failed",
          errorMessage
        );
      } finally {
        setIsLoading(false);
      }
    },
    [findOverlappingAppointment, addNotification, vehicles, backendVehicles, toast]
  );

  /**
   * Updates an existing appointment after validation.
   */
  const updateAppointment = useCallback(
    async (data: AppointmentFormData) => {
      if (!editingAppointment) return;

      setIsLoading(true);
      try {
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

        // Call backend API to update appointment
        const updatedAppointment = await appointmentService.updateAppointment(
          Number(editingAppointment.id),
          {
            date: data.appointmentDate,
            notes: data.notes || data.customerIssue,
            startTime: data.startTime ? `${data.startTime}:00` : undefined,
            endTime: data.endTime ? `${data.endTime}:00` : undefined,
            status: data.status,
          }
        );

        // Convert backend response to UI format
        const updatedUIAppointment = convertAppointmentToUIFormat(
          updatedAppointment,
          backendVehicles
        );

        setAppointments((prev) =>
          prev.map((apt) =>
            apt.id === editingAppointment.id ? updatedUIAppointment : apt
          )
        );

        toast.success("Appointment updated successfully!");
        addNotification(
          "success",
          "Appointment Updated!",
          "Your appointment has been successfully updated."
        );
        setEditingAppointment(null);
        setShowForm(false);

        // Return focus to booking button after successful update
        setTimeout(() => bookButtonRef.current?.focus(), 100);
      } catch (error: any) {
        const errorMessage = error.message || "An error occurred while updating your appointment. Please try again.";
        toast.error(errorMessage);
        addNotification(
          "error",
          "Update Failed",
          errorMessage
        );
      } finally {
        setIsLoading(false);
      }
    },
    [editingAppointment, findOverlappingAppointment, addNotification, backendVehicles, toast]
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
        // Call backend API to delete appointment
        await appointmentService.deleteAppointment(Number(appointmentId));

        setAppointments((prev) =>
          prev.filter((apt) => apt.id !== appointmentId)
        );

        toast.success("Appointment cancelled successfully!");
        addNotification(
          "success",
          "Appointment Cancelled",
          "Your appointment has been successfully cancelled."
        );
      } catch (error: any) {
        const errorMessage = error.message || "An error occurred while cancelling your appointment. Please try again.";
        toast.error(errorMessage);
        addNotification(
          "error",
          "Cancellation Failed",
          errorMessage
        );
      } finally {
        setIsLoading(false);
      }
    },
    [addNotification, toast]
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

  // Show loading state while fetching initial data
  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

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
              vehicles={vehicles}
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
