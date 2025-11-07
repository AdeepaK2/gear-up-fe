"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  Car,
  Edit,
  X,
  AlertCircle,
  HelpCircle,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AppointmentData,
  AppointmentStatus,
  ConsultationType,
} from "@/lib/types/Appointment";

interface AppointmentListProps {
  appointments: AppointmentData[];
  onEdit: (appointment: AppointmentData) => void;
  onDelete: (appointmentId: string) => Promise<void>;
  isLoading?: boolean;
}

const statusColors: Record<AppointmentStatus, string> = {
  PENDING:
    "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-300 shadow-sm",
  CONFIRMED:
    "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-300 shadow-sm",
  IN_PROGRESS:
    "bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-orange-300 shadow-sm",
  COMPLETED:
    "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300 shadow-sm",
  CANCELED:
    "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-300 shadow-sm",
};

const statusLabels: Record<AppointmentStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELED: "Cancelled",
};

const consultationTypeLabels: Record<ConsultationType, string> = {
  GENERAL_CHECKUP: "General Checkup",
  SPECIFIC_ISSUE: "Specific Issue",
  MAINTENANCE_ADVICE: "Maintenance Advice",
  PERFORMANCE_ISSUE: "Performance Issue",
  SAFETY_CONCERN: "Safety Concern",
  OTHER: "Other",
};

export default function AppointmentList({
  appointments,
  onEdit,
  onDelete,
  isLoading = false,
}: AppointmentListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewingAppointment, setViewingAppointment] =
    useState<AppointmentData | null>(null);

  const handleDelete = async (appointmentId: string) => {
    try {
      setDeletingId(appointmentId);
      await onDelete(appointmentId);
    } catch (error) {
      console.error("Error deleting appointment:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Allow editing only for PENDING appointments; deleting still only allowed when PENDING
  const canEdit = (status: AppointmentStatus) => {
    return status === "PENDING";
  };

  const canDelete = (status: AppointmentStatus) => {
    return status === "PENDING";
  };

  if (appointments.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader className="bg-secondary text-white">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            My Consultation Appointments
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <HelpCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 mb-2">
            No consultation appointments scheduled yet
          </p>
          <p className="text-sm text-gray-500">
            Book your first consultation using the form above
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {
                appointments.filter(
                  (apt) =>
                    apt.status === "PENDING" || apt.status === "CONFIRMED"
                ).length
              }
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {appointments.filter((apt) => apt.status === "COMPLETED").length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {
                appointments.filter((apt) => apt.status === "IN_PROGRESS")
                  .length
              }
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments List */}
      <Card className="w-full shadow-lg border-0 overflow-hidden">
        <CardContent className="p-0">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary hover:bg-primary/90 border-b-2 border-gray-200">
                  <TableHead className="font-bold text-white py-3 px-4 pl-6 text-left text-base">
                    Vehicle
                  </TableHead>
                  <TableHead className="font-bold text-white py-3 px-4 text-left text-base">
                    Consultation
                  </TableHead>
                  <TableHead className="font-bold text-white py-3 px-4 text-left text-base">
                    Date & Time
                  </TableHead>
                  <TableHead className="font-bold text-white py-3 px-4 text-left text-base">
                    Status
                  </TableHead>
                  <TableHead className="font-bold text-white py-3 px-4 pr-6 text-center text-base">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow
                    key={appointment.id}
                    className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 border-b border-gray-200 group"
                  >
                    <TableCell className="py-8 px-4 pl-6">
                      <p className="font-semibold text-gray-900 text-base">
                        {appointment.vehicleName}
                      </p>
                    </TableCell>

                    <TableCell className="py-8 px-4">
                      <p className="font-semibold text-gray-900 text-base">
                        {consultationTypeLabels[appointment.consultationType]}
                      </p>
                    </TableCell>

                    <TableCell className="py-8 px-4">
                      <div>
                        <p className="font-semibold text-gray-900 text-base">
                          {new Date(
                            appointment.appointmentDate
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatTime(appointment.startTime)} -{" "}
                          {formatTime(appointment.endTime)}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="py-8 px-4">
                      <div className="flex justify-start">
                        <Badge
                          className={cn(
                            "border-2 px-4 py-2 text-sm font-semibold rounded-full",
                            statusColors[appointment.status]
                          )}
                          variant="outline"
                        >
                          {statusLabels[appointment.status]}
                        </Badge>
                      </div>
                    </TableCell>

                    <TableCell className="py-8 px-4 pr-6">
                      <div className="flex justify-start gap-2">
                        {/* View Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setViewingAppointment(appointment)}
                          className="hover:bg-green-50 hover:border-green-300 transition-all duration-200 shadow-sm hover:shadow-md border-2"
                          disabled={isLoading}
                        >
                          <Eye className="h-4 w-4 text-green-600" />
                        </Button>

                        {canEdit(appointment.status) && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onEdit(appointment)}
                              className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md border-2"
                              disabled={isLoading}
                            >
                              <Edit className="h-4 w-4 text-blue-600" />
                            </Button>
                            {canDelete(appointment.status) && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="hover:bg-red-50 hover:border-red-300 transition-all duration-200 shadow-sm hover:shadow-md border-2"
                                    disabled={
                                      isLoading || deletingId === appointment.id
                                    }
                                  >
                                    <X className="h-4 w-4 text-red-600" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                      <AlertCircle className="h-5 w-5 text-red-500" />
                                      Cancel Consultation?
                                    </DialogTitle>
                                    <DialogDescription>
                                      Are you sure you want to cancel this
                                      consultation appointment? This action
                                      cannot be undone.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="bg-gray-50 p-3 rounded-lg mt-4">
                                    <p className="text-sm text-gray-600">
                                      <strong>Vehicle:</strong>{" "}
                                      {appointment.vehicleName}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      <strong>Date:</strong>{" "}
                                      {formatDate(appointment.appointmentDate)}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      <strong>Time:</strong>{" "}
                                      {formatTime(appointment.startTime)} -{" "}
                                      {formatTime(appointment.endTime)}
                                    </p>
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      variant="destructive"
                                      onClick={() =>
                                        handleDelete(appointment.id)
                                      }
                                      disabled={deletingId === appointment.id}
                                    >
                                      {deletingId === appointment.id
                                        ? "Cancelling..."
                                        : "Yes, Cancel Appointment"}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="block md:hidden space-y-4 p-6">
            {appointments.map((appointment) => (
              <Card
                key={appointment.id}
                className="border-l-4 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-white to-gray-50 overflow-hidden"
                style={{
                  borderLeftColor:
                    appointment.status === "PENDING"
                      ? "#f59e0b"
                      : appointment.status === "CONFIRMED"
                      ? "#3b82f6"
                      : appointment.status === "COMPLETED"
                      ? "#10b981"
                      : appointment.status === "CANCELED"
                      ? "#ef4444"
                      : "#f97316",
                }}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <Badge
                      className={cn(
                        "border-2 px-3 py-1 text-sm font-semibold rounded-full shadow-sm",
                        statusColors[appointment.status]
                      )}
                      variant="outline"
                    >
                      {statusLabels[appointment.status]}
                    </Badge>

                    <div className="flex gap-2">
                      {canEdit(appointment.status) && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(appointment)}
                            disabled={isLoading}
                            className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm"
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>

                          {canDelete(appointment.status) && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={
                                    isLoading || deletingId === appointment.id
                                  }
                                  className="hover:bg-red-50 hover:border-red-300 transition-all duration-200 shadow-sm"
                                >
                                  <X className="h-4 w-4 text-red-600" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    Cancel Consultation?
                                  </DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to cancel this
                                    consultation appointment?
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleDelete(appointment.id)}
                                    disabled={deletingId === appointment.id}
                                  >
                                    {deletingId === appointment.id
                                      ? "Cancelling..."
                                      : "Cancel Appointment"}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                      <div className="p-2 bg-primary/20 rounded-lg">
                        <Car className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 text-base">
                          {appointment.vehicleName}
                        </span>
                        <p className="text-sm text-gray-600 mt-1">
                          {appointment.vehicleDetails}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <HelpCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-gray-900 block">
                          {consultationTypeLabels[appointment.consultationType]}
                        </span>
                        {appointment.customerIssue && (
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Issue:</span>{" "}
                            {appointment.customerIssue}
                          </p>
                        )}
                        {appointment.employeeName && (
                          <p className="text-sm text-blue-600 mt-1">
                            <span className="font-medium">Assigned to:</span>{" "}
                            {appointment.employeeName}
                          </p>
                        )}
                        {appointment.status === "COMPLETED" &&
                          appointment.recommendedServices &&
                          appointment.recommendedServices.length > 0 && (
                            <p className="text-sm text-green-600 mt-1">
                              <span className="font-medium">
                                Services recommended:
                              </span>{" "}
                              {appointment.recommendedServices.length} items
                            </p>
                          )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Calendar className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">
                          {formatDate(appointment.appointmentDate)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                      <div className="p-2 bg-orange-500/20 rounded-lg">
                        <Clock className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">
                          {formatTime(appointment.startTime)} -{" "}
                          {formatTime(appointment.endTime)}
                        </span>
                      </div>
                    </div>

                    {appointment.customerIssue && (
                      <div className="mt-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-l-4 border-blue-400">
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold text-blue-600">
                            Issue:
                          </span>{" "}
                          {appointment.customerIssue}
                        </p>
                      </div>
                    )}

                    {appointment.notes && (
                      <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-l-4 border-cyan-400">
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold text-cyan-600">
                            Notes:
                          </span>{" "}
                          {appointment.notes}
                        </p>
                      </div>
                    )}

                    {appointment.status === "CANCELED" && appointment.notes && appointment.notes.startsWith("REJECTED:") && (
                      <div className="mt-3 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border-l-4 border-red-500">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-red-900 mb-1">
                              Appointment Rejected
                            </p>
                            <p className="text-sm text-red-700">
                              <span className="font-medium">Reason:</span>{" "}
                              {appointment.notes.replace("REJECTED: ", "")}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed View Modal */}
      {/* Detailed View Modal */}
      <Dialog
        open={!!viewingAppointment}
        onOpenChange={() => setViewingAppointment(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col [&>button]:hidden">
          <DialogHeader className="sticky top-0 bg-white z-10 pb-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Appointment Details
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewingAppointment(null)}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="overflow-y-auto flex-1 pt-4">
            {viewingAppointment && (
              <div className="space-y-6">
                {/* Vehicle Information */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    Vehicle Information
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Vehicle:</span>{" "}
                      {viewingAppointment.vehicleName}
                    </p>
                    <p>
                      <span className="font-medium">Details:</span>{" "}
                      {viewingAppointment.vehicleDetails}
                    </p>
                  </div>
                </div>

                {/* Appointment Information */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    Appointment Information
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Consultation Type:</span>{" "}
                      {
                        consultationTypeLabels[
                          viewingAppointment.consultationType
                        ]
                      }
                    </p>
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {formatDate(viewingAppointment.appointmentDate)}
                    </p>
                    <p>
                      <span className="font-medium">Time:</span>{" "}
                      {formatTime(viewingAppointment.startTime)} -{" "}
                      {formatTime(viewingAppointment.endTime)}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Status:</span>
                      <Badge
                        className={cn(
                          "border-2 px-3 py-1 text-sm font-semibold rounded-full",
                          statusColors[viewingAppointment.status]
                        )}
                        variant="outline"
                      >
                        {statusLabels[viewingAppointment.status]}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Issue & Notes */}
                {(viewingAppointment.customerIssue ||
                  viewingAppointment.notes) && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      Additional Information
                    </h3>
                    <div className="space-y-3">
                      {viewingAppointment.customerIssue && (
                        <div>
                          <p className="font-medium text-gray-900">
                            Customer Issue:
                          </p>
                          <p className="text-gray-700 mt-1">
                            {viewingAppointment.customerIssue}
                          </p>
                        </div>
                      )}
                      {viewingAppointment.status === "CANCELED" && viewingAppointment.notes && viewingAppointment.notes.startsWith("REJECTED:") ? (
                        <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border-l-4 border-red-500">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-semibold text-red-900 mb-1">
                                Rejection Reason
                              </p>
                              <p className="text-red-800">
                                {viewingAppointment.notes.replace("REJECTED: ", "")}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : viewingAppointment.notes && (
                        <div>
                          <p className="font-medium text-gray-900">Notes:</p>
                          <p className="text-gray-700 mt-1">
                            {viewingAppointment.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Employee & Services (if applicable) */}
                {(viewingAppointment.employeeName ||
                  (viewingAppointment.recommendedServices &&
                    viewingAppointment.recommendedServices.length > 0)) && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      Service Information
                    </h3>
                    <div className="space-y-2">
                      {viewingAppointment.employeeName && (
                        <p>
                          <span className="font-medium">
                            Assigned Employee:
                          </span>{" "}
                          {viewingAppointment.employeeName}
                        </p>
                      )}
                      {viewingAppointment.recommendedServices &&
                        viewingAppointment.recommendedServices.length > 0 && (
                          <div>
                            <p className="font-medium">Recommended Services:</p>
                            <ul className="mt-1 ml-4 list-disc text-gray-700">
                              {viewingAppointment.recommendedServices.map(
                                (service, index) => (
                                  <li key={index}>{service}</li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
