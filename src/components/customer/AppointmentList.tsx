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
  MessageSquare,
  Edit,
  X,
  AlertCircle,
  HelpCircle,
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
  pending:
    "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-300 shadow-sm",
  confirmed:
    "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-300 shadow-sm",
  "in-progress":
    "bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-orange-300 shadow-sm",
  completed:
    "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300 shadow-sm",
  cancelled:
    "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-300 shadow-sm",
};

const statusLabels: Record<AppointmentStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  "in-progress": "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const consultationTypeLabels: Record<ConsultationType, string> = {
  "general-checkup": "General Checkup",
  "specific-issue": "Specific Issue",
  "maintenance-advice": "Maintenance Advice",
  "performance-issue": "Performance Issue",
  "safety-concern": "Safety Concern",
  other: "Other",
};

export default function AppointmentList({
  appointments,
  onEdit,
  onDelete,
  isLoading = false,
}: AppointmentListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const canEditOrDelete = (status: AppointmentStatus) => {
    return status === "pending" || status === "confirmed";
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
                    apt.status === "pending" || apt.status === "confirmed"
                ).length
              }
            </div>
            <div className="text-sm text-gray-600">Upcoming</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {appointments.filter((apt) => apt.status === "completed").length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {
                appointments.filter((apt) => apt.status === "in-progress")
                  .length
              }
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments List */}
      <Card className="w-full shadow-lg border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-secondary to-primary text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/5"></div>
          <CardTitle className="flex items-center gap-3 text-lg relative z-10">
            <div className="p-2 bg-white/20 rounded-lg">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-bold">
                My Consultation Appointments
              </div>
              <div className="text-sm text-white/90 font-normal">
                {appointments.length}{" "}
                {appointments.length === 1 ? "appointment" : "appointments"}{" "}
                scheduled
              </div>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-150 border-b-2 border-gray-200">
                  <TableHead className="font-bold text-gray-800 py-4 text-left">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-primary" />
                      Vehicle
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-800 py-4 text-left">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-primary" />
                      Consultation
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-800 py-4 text-left">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      Date & Time
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-800 py-4 text-left">
                    Status
                  </TableHead>
                  <TableHead className="font-bold text-gray-800 py-4 text-center">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow
                    key={appointment.id}
                    className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 border-b border-gray-100 group"
                  >
                    <TableCell className="py-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-200">
                          <Car className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-base">
                            {appointment.vehicleName}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {appointment.vehicleDetails}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl group-hover:from-green-200 group-hover:to-emerald-200 transition-all duration-200">
                          <HelpCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-base">
                            {
                              consultationTypeLabels[
                                appointment.consultationType
                              ]
                            }
                          </p>
                          {appointment.customerIssue && (
                            <p className="text-sm text-gray-600 mt-1 max-w-xs truncate">
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
                          {appointment.status === "completed" &&
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
                    </TableCell>

                    <TableCell className="py-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl group-hover:from-blue-200 group-hover:to-cyan-200 transition-all duration-200">
                          <Clock className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-base">
                            {formatDate(appointment.appointmentDate)}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {formatTime(appointment.startTime)} -{" "}
                            {formatTime(appointment.endTime)}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-6">
                      <div className="flex justify-center">
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

                    <TableCell className="py-6">
                      <div className="flex justify-center gap-3">
                        {canEditOrDelete(appointment.status) && (
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
                                    consultation appointment? This action cannot
                                    be undone.
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
                                    onClick={() => handleDelete(appointment.id)}
                                    disabled={deletingId === appointment.id}
                                  >
                                    {deletingId === appointment.id
                                      ? "Cancelling..."
                                      : "Yes, Cancel Appointment"}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </>
                        )}

                        {!canEditOrDelete(appointment.status) && (
                          <span className="text-sm text-gray-500 italic">
                            Cannot modify
                          </span>
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
                    appointment.status === "pending"
                      ? "#f59e0b"
                      : appointment.status === "confirmed"
                      ? "#3b82f6"
                      : appointment.status === "completed"
                      ? "#10b981"
                      : appointment.status === "cancelled"
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
                      {canEditOrDelete(appointment.status) && (
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
                                <DialogTitle>Cancel Consultation?</DialogTitle>
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
                        {appointment.status === "completed" &&
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
