"use client";
import React from "react";
import { Card } from "@/components/ui/card";
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
import {} from "lucide-react";

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
          <TableWrapper data={appointmentsData} />
          <p className="text-sm text-gray-500 mt-4">
            // For pending approval, there should be a column to approve or
            reject appointments
          </p>
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
