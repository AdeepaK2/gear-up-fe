"use client";
import React from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  Check,
  X,
  Calendar as CalendarIcon,
  Clock,
  User,
  Car,
  Filter,
} from "lucide-react";

// Dummy data for the tables
const appointmentsData = [
  {
    id: 1,
    customer: "Sophia Clark",
    vehicle: "BMW X5 2023",
    employee: "Alex Johnson",
    date: "2024-07-20",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    status: "Pending Approval",
    service: "Oil Change",
  },
  {
    id: 2,
    customer: "Olivia Bennett",
    vehicle: "Toyota Camry 2020",
    employee: "Sarah Wilson",
    date: "2024-07-22",
    startTime: "11:00 AM",
    endTime: "12:00 PM",
    status: "In Progress",
    service: "Brake Inspection",
  },
  {
    id: 3,
    customer: "Marcus Rodriguez",
    vehicle: "Ford F-150 2022",
    employee: "Michael Brown",
    date: "2024-07-22",
    startTime: "2:00 PM",
    endTime: "3:00 PM",
    status: "Completed",
    service: "Engine Diagnostic",
  },
  {
    id: 4,
    customer: "Emma Davis",
    vehicle: "Honda Civic 2021",
    employee: "Emily Johnson",
    date: "2024-10-15",
    startTime: "9:00 AM",
    endTime: "10:30 AM",
    status: "Pending Approval",
    service: "Tire Rotation",
  },
  {
    id: 5,
    customer: "James Wilson",
    vehicle: "Mercedes C-Class 2022",
    employee: "David Martinez",
    date: "2024-10-18",
    startTime: "2:00 PM",
    endTime: "4:00 PM",
    status: "In Progress",
    service: "Full Service",
  },
  {
    id: 6,
    customer: "Lisa Thompson",
    vehicle: "Audi Q7 2023",
    employee: "Sarah Wilson",
    date: "2024-11-05",
    startTime: "11:00 AM",
    endTime: "12:30 PM",
    status: "Pending Approval",
    service: "Battery Check",
  },
];

// Dummy data for calendar - dates with appointments
const appointmentDates = [
  new Date(2024, 9, 15), // October 15, 2024
  new Date(2024, 9, 18), // October 18, 2024
  new Date(2024, 9, 22), // October 22, 2024
  new Date(2024, 10, 5), // November 5, 2024
  new Date(2024, 10, 12), // November 12, 2024
  new Date(2024, 10, 20), // November 20, 2024
];

export default function AppointmentsPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  // Set initial month to October 2024 to match the mockup
  const [displayMonth, setDisplayMonth] = React.useState<Date>(
    new Date(2024, 9)
  );

  const getStatusCounts = () => {
    return {
      pending: appointmentsData.filter((a) => a.status === "Pending Approval")
        .length,
      inProgress: appointmentsData.filter((a) => a.status === "In Progress")
        .length,
      completed: appointmentsData.filter((a) => a.status === "Completed")
        .length,
      cancelled: appointmentsData.filter((a) => a.status === "Cancelled")
        .length,
    };
  };

  const statusCounts = getStatusCounts();

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
              data={appointmentsData.filter(
                (a) => a.status === "Pending Approval"
              )}
            />
          </TabsContent>
          <TabsContent value="in-progress" className="mt-6">
            <TableWrapper
              data={appointmentsData.filter((a) => a.status === "In Progress")}
              status="In Progress"
            />
          </TabsContent>
          <TabsContent value="completed" className="mt-6">
            <TableWrapper
              data={appointmentsData.filter((a) => a.status === "Completed")}
              status="Completed"
            />
          </TabsContent>
          <TabsContent value="cancelled" className="mt-6">
            <TableWrapper
              data={appointmentsData.filter((a) => a.status === "Cancelled")}
              status="Cancelled"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Pending Approval table component with action buttons
function PendingApprovalTable({ data }: { data: typeof appointmentsData }) {
  const handleApprove = (id: number) => {
    console.log(`Approving appointment ${id}`);
    // Here you would make an API call to approve the appointment
  };

  const handleReject = (id: number) => {
    console.log(`Rejecting appointment ${id}`);
    // Here you would make an API call to reject the appointment
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
                Customer
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Service
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Vehicle
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
              <TableHead className="text-center font-semibold text-gray-700">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((appointment) => (
                <TableRow
                  key={appointment.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="font-medium py-6 text-gray-900">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      {appointment.customer}
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {appointment.service}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-6 text-gray-700">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-gray-500" />
                      {appointment.vehicle}
                    </div>
                  </TableCell>
                  <TableCell className="py-6 text-gray-700">
                    {appointment.employee}
                  </TableCell>
                  <TableCell className="py-6 text-gray-700">
                    {appointment.date}
                  </TableCell>
                  <TableCell className="py-6 text-gray-700">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-gray-500" />
                      {appointment.startTime} - {appointment.endTime}
                    </div>
                  </TableCell>
                  <TableCell className="text-center py-6">
                    <div className="flex gap-3 justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleApprove(appointment.id)}
                        className="h-10 w-10 p-0 bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 border border-green-300 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <Check className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReject(appointment.id)}
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
                  colSpan={7}
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
function TableWrapper({
  data,
  status,
}: {
  data: typeof appointmentsData;
  status: string;
}) {
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
                Customer
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Service
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Vehicle
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((appointment) => (
                <TableRow
                  key={appointment.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="font-medium text-gray-900 py-6">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      {appointment.customer}
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {appointment.service}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-700 py-6">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-gray-500" />
                      {appointment.vehicle}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700 py-6">
                    {appointment.employee}
                  </TableCell>
                  <TableCell className="text-gray-700 py-6">
                    {appointment.date}
                  </TableCell>
                  <TableCell className="text-gray-700 py-6">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-gray-500" />
                      {appointment.startTime} - {appointment.endTime}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
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
