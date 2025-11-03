"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  X,
  Calendar as CalendarIcon,
  Clock,
  User,
  Car,
  Filter,
  UserPlus,
} from "lucide-react";
import { appointmentService } from "@/lib/services/appointmentService";
import { employeeService, type Employee } from "@/lib/services/employeeService";
import type { Appointment } from "@/lib/types/Appointment";
import { useToast } from "@/contexts/ToastContext";

export default function AppointmentsPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [displayMonth, setDisplayMonth] = React.useState<Date>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const { showToast } = useToast();

  // Fetch appointments and employees on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appointmentsData, employeesData] = await Promise.all([
        appointmentService.searchAppointments(''), // Empty string fetches all
        employeeService.getAllEmployees(),
      ]);
      setAppointments(appointmentsData);
      setEmployees(employeesData);
    } catch (error: any) {
      showToast("Failed to load data: " + error.message, "error");
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusCounts = () => {
    return {
      pending: appointments.filter((a) => a.status === "PENDING").length,
      inProgress: appointments.filter((a) => a.status === "IN_PROGRESS").length,
      completed: appointments.filter((a) => a.status === "COMPLETED").length,
      cancelled: appointments.filter((a) => a.status === "CANCELLED").length,
    };
  };

  const handleAssignEmployee = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setSelectedEmployeeId(appointment.employeeId?.toString() || "");
    setAssignDialogOpen(true);
  };

  const confirmAssignEmployee = async () => {
    if (!selectedAppointment || !selectedEmployeeId) {
      showToast("Please select an employee", "error");
      return;
    }

    try {
      await appointmentService.assignEmployee(
        selectedAppointment.id,
        parseInt(selectedEmployeeId)
      );
      showToast("Employee assigned successfully", "success");
      setAssignDialogOpen(false);
      setSelectedAppointment(null);
      setSelectedEmployeeId("");
      fetchData(); // Refresh data
    } catch (error: any) {
      showToast("Failed to assign employee: " + error.message, "error");
      console.error('Error assigning employee:', error);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await appointmentService.updateAppointment(id, { status: "CONFIRMED" });
      showToast("Appointment approved successfully", "success");
      fetchData();
    } catch (error: any) {
      showToast("Failed to approve appointment: " + error.message, "error");
      console.error('Error approving appointment:', error);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await appointmentService.updateAppointment(id, { status: "CANCELLED" });
      showToast("Appointment rejected successfully", "success");
      fetchData();
    } catch (error: any) {
      showToast("Failed to reject appointment: " + error.message, "error");
      console.error('Error rejecting appointment:', error);
    }
  };

  const statusCounts = getStatusCounts();

  // Get dates that have appointments for calendar
  const appointmentDates = appointments.map(
    (a) => new Date(a.appointmentDate)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Manage Appointments
        </h1>
        <p className="text-lg text-gray-600">
          Review and track customer appointments
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 text-base font-semibold mb-1">
                  Pending Approval
                </p>
                <div className="text-4xl font-extrabold text-primary">
                  {statusCounts.pending}
                </div>
              </div>
              <div className="p-3 bg-primary rounded-lg shadow-sm">
                <Clock className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 text-base font-semibold mb-1">
                  In Progress
                </p>
                <div className="text-4xl font-extrabold text-primary">
                  {statusCounts.inProgress}
                </div>
              </div>
              <div className="p-3 bg-primary rounded-lg shadow-sm">
                <CalendarIcon className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 text-base font-semibold mb-1">
                  Completed
                </p>
                <div className="text-4xl font-extrabold text-primary">
                  {statusCounts.completed}
                </div>
              </div>
              <div className="p-3 bg-primary rounded-lg shadow-sm">
                <Check className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 text-base font-semibold mb-1">
                  Cancelled
                </p>
                <div className="text-4xl font-extrabold text-primary">
                  {statusCounts.cancelled}
                </div>
              </div>
              <div className="p-3 bg-primary rounded-lg shadow-sm">
                <X className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Section */}
      <div className="mt-16">
        <Card className="bg-white shadow-lg border-0">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-6">
              <CalendarIcon className="h-8 w-8 text-primary" />
              Calendar View
            </CardTitle>
            <p className="text-gray-600 text-base mt-2">
              View appointments scheduled across months
            </p>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="w-full relative">
              {/* Global Navigation Controls */}
              <div className="absolute top-20 left-4 right-4 flex justify-between items-center pointer-events-none z-10">
                <button
                  onClick={() => {
                    const newMonth = new Date(displayMonth);
                    newMonth.setMonth(newMonth.getMonth() - 1);
                    setDisplayMonth(newMonth);
                  }}
                  className="h-14 w-14 bg-white border-2 border-gray-400 rounded-lg hover:bg-gray-50 hover:border-gray-500 transition-all duration-200 flex items-center justify-center shadow-md pointer-events-auto"
                >
                  <svg
                    className="h-6 w-6 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    const newMonth = new Date(displayMonth);
                    newMonth.setMonth(newMonth.getMonth() + 1);
                    setDisplayMonth(newMonth);
                  }}
                  className="h-14 w-14 bg-white border-2 border-gray-400 rounded-lg hover:bg-gray-50 hover:border-gray-500 transition-all duration-200 flex items-center justify-center shadow-md pointer-events-auto"
                >
                  <svg
                    className="h-6 w-6 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              {/* Calendar Container with proper spacing */}
              <div className="px-16">
                <Calendar
                  mode="single"
                  selected={undefined}
                  onSelect={undefined}
                  month={displayMonth}
                  onMonthChange={setDisplayMonth}
                  numberOfMonths={3}
                  fixedWeeks
                  showOutsideDays={false}
                  className="rounded-lg border-0 bg-gray-50 p-6 w-full"
                  classNames={{
                    months:
                      "flex flex-col lg:flex-row space-y-4 lg:space-x-8 lg:space-y-0 w-full justify-between items-start",
                    month: "space-y-4 flex-1 min-w-0",
                    caption: "flex justify-center items-center mb-6 relative",
                    caption_label:
                      "text-lg font-semibold text-gray-700 text-center",
                    nav: "hidden", // Hide default navigation since we have global navigation
                    nav_button: "hidden",
                    nav_button_previous: "hidden",
                    nav_button_next: "hidden",
                    table: "w-full border-collapse",
                    head_row: "flex w-full mb-3",
                    head_cell:
                      "text-gray-500 w-full font-medium text-sm text-center py-2 mx-1",
                    row: "flex w-full mt-2",
                    cell: "h-12 w-full text-center text-sm p-0 relative mx-1",
                    day: "h-12 w-full p-0 font-normal hover:bg-gray-100 transition-colors cursor-default",
                    day_today: "bg-gray-200 text-gray-900 font-semibold",
                    day_outside: "text-gray-300 opacity-50",
                    day_disabled: "text-gray-300 opacity-50",
                    day_hidden: "invisible",
                  }}
                  modifiers={{
                    appointment: appointmentDates,
                  }}
                  modifiersClassNames={{
                    appointment:
                      "bg-primary text-white font-semibold hover:bg-primary",
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments Tables */}
      <div className="space-y-6 mt-16">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">
            Filtered Appointments
          </h2>
          <p className="text-lg text-gray-600">Manage appointments by status</p>
        </div>

        <Tabs defaultValue="in-progress" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100">
            <TabsTrigger
              value="pending-approval"
              className="data-[state=active]:bg-white data-[state=active]:text-orange-600"
            >
              Pending Approval
            </TabsTrigger>
            <TabsTrigger
              value="in-progress"
              className="data-[state=active]:bg-white data-[state=active]:text-primary"
            >
              In Progress
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="data-[state=active]:bg-white data-[state=active]:text-green-600"
            >
              Completed
            </TabsTrigger>
            <TabsTrigger
              value="cancelled"
              className="data-[state=active]:bg-white data-[state=active]:text-red-600"
            >
              Cancelled
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending-approval" className="mt-6">
            <PendingApprovalTable
              data={appointments.filter((a) => a.status === "PENDING")}
              onApprove={handleApprove}
              onReject={handleReject}
              onAssignEmployee={handleAssignEmployee}
              employees={employees}
            />
          </TabsContent>
          <TabsContent value="in-progress" className="mt-6">
            <TableWrapper
              data={appointments.filter((a) => a.status === "IN_PROGRESS")}
              status="In Progress"
              onAssignEmployee={handleAssignEmployee}
              employees={employees}
            />
          </TabsContent>
          <TabsContent value="completed" className="mt-6">
            <TableWrapper
              data={appointments.filter((a) => a.status === "COMPLETED")}
              status="Completed"
              onAssignEmployee={handleAssignEmployee}
              employees={employees}
            />
          </TabsContent>
          <TabsContent value="cancelled" className="mt-6">
            <TableWrapper
              data={appointments.filter((a) => a.status === "CANCELLED")}
              status="Cancelled"
              onAssignEmployee={handleAssignEmployee}
              employees={employees}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Employee Assignment Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Employee to Appointment</DialogTitle>
            <DialogDescription>
              Select an employee to assign to this appointment. This will change the appointment status to CONFIRMED.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="block text-sm font-medium mb-2">
              Select Employee
            </label>
            <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp.employeeId} value={emp.employeeId.toString()}>
                    {emp.name} - {emp.specialization}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmAssignEmployee}>
              Assign Employee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Pending Approval table component with action buttons
interface PendingApprovalTableProps {
  data: Appointment[];
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onAssignEmployee: (appointment: Appointment) => void;
  employees: Employee[];
}

function PendingApprovalTable({ 
  data, 
  onApprove, 
  onReject, 
  onAssignEmployee,
  employees 
}: PendingApprovalTableProps) {
  
  const getEmployeeName = (employeeId: number | null) => {
    if (!employeeId) return "Unassigned";
    const employee = employees.find(e => e.employeeId === employeeId);
    return employee ? employee.name : "Unknown";
  };

  const formatTime = (time: string | null) => {
    if (!time) return "N/A";
    return time.substring(0, 5); // Convert HH:MM:SS to HH:MM
  };

  return (
    <Card className="bg-white shadow-lg border-0">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-orange-600 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Appointments Pending Approval
          </CardTitle>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select>
              <SelectTrigger className="w-80">
                <SelectValue placeholder="Filter by Customer/Employee/Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="date">Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200">
              <TableHead className="font-semibold text-gray-700">
                ID
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Customer ID
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Vehicle ID
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Employee
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Date
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Time
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Notes
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-700">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((appointment: Appointment) => (
                <TableRow
                  key={appointment.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="font-medium py-6 text-gray-900">
                    {appointment.id}
                  </TableCell>
                  <TableCell className="py-6">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      {appointment.customerId}
                    </div>
                  </TableCell>
                  <TableCell className="py-6 text-gray-700">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-gray-500" />
                      {appointment.vehicleId}
                    </div>
                  </TableCell>
                  <TableCell className="py-6 text-gray-700">
                    {getEmployeeName(appointment.employeeId)}
                  </TableCell>
                  <TableCell className="py-6 text-gray-700">
                    {appointment.appointmentDate}
                  </TableCell>
                  <TableCell className="py-6 text-gray-700">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-gray-500" />
                      {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                    </div>
                  </TableCell>
                  <TableCell className="py-6 text-gray-700 max-w-xs truncate">
                    {appointment.notes || "N/A"}
                  </TableCell>
                  <TableCell className="text-center py-6">
                    <div className="flex gap-3 justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onAssignEmployee(appointment)}
                        className="h-10 px-3 bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800 border border-blue-300"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Assign
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onApprove(appointment.id)}
                        className="h-10 w-10 p-0 bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 border border-green-300 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <Check className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onReject(appointment.id)}
                        className="h-10 w-10 p-0 bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800 border border-red-300 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-gray-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Clock className="h-8 w-8 text-gray-300" />
                    <span>No appointments pending approval.</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// Helper component for the table to avoid repetition
interface TableWrapperProps {
  data: Appointment[];
  status: string;
  onAssignEmployee: (appointment: Appointment) => void;
  employees: Employee[];
}

function TableWrapper({
  data,
  status,
  onAssignEmployee,
  employees,
}: TableWrapperProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "In Progress":
        return <CalendarIcon className="h-5 w-5 text-primary" />;
      case "Completed":
        return <Check className="h-5 w-5 text-green-600" />;
      case "Cancelled":
        return <X className="h-5 w-5 text-red-600" />;
      default:
        return <CalendarIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "text-primary";
      case "Completed":
        return "text-green-600";
      case "Cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getEmployeeName = (employeeId: number | null) => {
    if (!employeeId) return "Unassigned";
    const employee = employees.find(e => e.employeeId === employeeId);
    return employee ? employee.name : "Unknown";
  };

  const formatTime = (time: string | null) => {
    if (!time) return "N/A";
    return time.substring(0, 5); // Convert HH:MM:SS to HH:MM
  };

  return (
    <Card className="bg-white shadow-lg border-0">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle
            className={`text-xl font-bold flex items-center gap-2 ${getStatusColor(
              status
            )}`}
          >
            {getStatusIcon(status)}
            {status} Appointments
          </CardTitle>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select>
              <SelectTrigger className="w-80">
                <SelectValue placeholder="Filter by Customer/Employee/Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="date">Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200">
              <TableHead className="font-semibold text-gray-700">
                ID
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Customer ID
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Vehicle ID
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Employee
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Date
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Time
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Notes
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-700">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((appointment: Appointment) => (
                <TableRow
                  key={appointment.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="font-medium text-gray-900 py-6">
                    {appointment.id}
                  </TableCell>
                  <TableCell className="py-6">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      {appointment.customerId}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700 py-6">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-gray-500" />
                      {appointment.vehicleId}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700 py-6">
                    {getEmployeeName(appointment.employeeId)}
                  </TableCell>
                  <TableCell className="text-gray-700 py-6">
                    {appointment.appointmentDate}
                  </TableCell>
                  <TableCell className="text-gray-700 py-6">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-gray-500" />
                      {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700 py-6 max-w-xs truncate">
                    {appointment.notes || "N/A"}
                  </TableCell>
                  <TableCell className="text-center py-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onAssignEmployee(appointment)}
                      className="h-10 px-3 bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800 border border-blue-300"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      {appointment.employeeId ? "Reassign" : "Assign"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-gray-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    {getStatusIcon(status)}
                    <span>No {status.toLowerCase()} appointments found.</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
