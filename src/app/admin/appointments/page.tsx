"use client";
import React from "react";
import { Card } from "@/components/ui/card";
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
import { Check, X } from "lucide-react";

// Dummy data for the tables
const appointmentsData = [
  {
    customer: "Sophia Clark",
    vehicle: "Consultation",
    employee: "Support",
    date: "2024-07-20",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
  },
  {
    customer: "Olivia Bennett",
    vehicle: "Support",
    employee: "Support",
    date: "2024-07-22",
    startTime: "11:00 AM",
    endTime: "12:00 PM",
  },
  {
    customer: "Olivia Bennett",
    vehicle: "Support",
    employee: "Support",
    date: "2024-07-22",
    startTime: "11:00 AM",
    endTime: "12:00 PM",
  },
];

export default function AppointmentsPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  // Set initial month to October 2024 to match the mockup
  const [displayMonth, setDisplayMonth] = React.useState<Date>(
    new Date(2024, 9)
  );

  const handlePrevMonth = () => {
    setDisplayMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setDisplayMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1)
    );
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-6 mt-6">Manage Appointments</h1>

      <div className="mb-8">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          month={displayMonth}
          onMonthChange={setDisplayMonth}
          numberOfMonths={2}
          fixedWeeks
          className="rounded-md border p-4"
        />
      </div>

      <h2 className="text-xl font-semibold mb-4">Filtered Appointments</h2>

      <Tabs defaultValue="in-progress" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="pending-approval">Pending Approval</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        <TabsContent value="pending-approval">
          <PendingApprovalTable data={appointmentsData} />
        </TabsContent>
        <TabsContent value="in-progress">
          <TableWrapper data={appointmentsData} />
        </TabsContent>
        <TabsContent value="completed">
          <TableWrapper data={appointmentsData} />
        </TabsContent>
        <TabsContent value="cancelled">
          <TableWrapper data={appointmentsData} />
        </TabsContent>
      </Tabs>
    </>
  );
}

// Pending Approval table component with action buttons
function PendingApprovalTable({ data }: { data: typeof appointmentsData }) {
  const handleApprove = (index: number) => {
    console.log(`Approving appointment ${index}`);
    // Here you would make an API call to approve the appointment
  };

  const handleReject = (index: number) => {
    console.log(`Rejecting appointment ${index}`);
    // Here you would make an API call to reject the appointment
  };

  return (
    <Card className="p-4">
      <div className="mb-4 w-full max-w-xs">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Filter by the Customer/ Employee/ Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="customer">Customer</SelectItem>
            <SelectItem value="employee">Employee</SelectItem>
            <SelectItem value="date">Date</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Employee</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead className="text-left w-28">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((appointment, index) => (
            <TableRow key={index} className="align-top">
              <TableCell className="font-medium py-4">
                {appointment.customer}
              </TableCell>
              <TableCell className="py-4">{appointment.vehicle}</TableCell>
              <TableCell className="py-4">{appointment.employee}</TableCell>
              <TableCell className="py-4">{appointment.date}</TableCell>
              <TableCell className="py-4">{appointment.startTime}</TableCell>
              <TableCell className="py-4">{appointment.endTime}</TableCell>
              <TableCell className="text-right py-4 w-28">
                <div className="flex gap-4 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleApprove(index)}
                    className="h-10 w-10 p-0 bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 border border-green-300 rounded-full"
                  >
                    <Check className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReject(index)}
                    className="h-10 w-10 p-0 bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800 border border-red-300 rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

// Helper component for the table to avoid repetition
function TableWrapper({ data }: { data: typeof appointmentsData }) {
  return (
    <Card className="p-4">
      <div className="mb-4 w-full max-w-xs">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Filter by the Customer/ Employee/ Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="customer">Customer</SelectItem>
            <SelectItem value="employee">Employee</SelectItem>
            <SelectItem value="date">Date</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Employee</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((appointment, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                {appointment.customer}
              </TableCell>
              <TableCell>{appointment.vehicle}</TableCell>
              <TableCell>{appointment.employee}</TableCell>
              <TableCell>{appointment.date}</TableCell>
              <TableCell>{appointment.startTime}</TableCell>
              <TableCell>{appointment.endTime}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
