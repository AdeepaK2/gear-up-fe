import React from "react";
import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Button } from "@/components/ui/button";

// Dummy data for the summary cards
const statCardsData = [
  { title: "Pending Requests", value: 12 },
  { title: "In Progress Requests", value: 8 },
  { title: "Completed Requests", value: 3 },
  { title: "Cancelled Requests", value: 3 },
];

// Dummy data for the tables
const requestsData = [
  {
    customer: "Sophia Clark",
    vehicle: "Consultation",
    date: "2024-07-20",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
  },
  {
    customer: "Olivia Bennett",
    vehicle: "Support",
    date: "2024-07-20",
    startTime: "11:00 AM",
    endTime: "12:00 PM",
  },
  {
    customer: "Olivia Bennett",
    vehicle: "Support",
    date: "2024-07-20",
    startTime: "11:00 AM",
    endTime: "12:00 PM",
  },
];

export default function ModificationRequestsPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6 mt-6">
        Manage Modification Requests
      </h1>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCardsData.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">
        Filtered Modification Requests
      </h2>

      {/* Tabs for different request statuses */}
      <Tabs defaultValue="in-progress" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="pending-approval">Pending Approval</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        <TabsContent value="pending-approval">
          {/* We pass showActions={true} to render the Approve/Reject buttons */}
          <TableWrapper data={requestsData} showActions={true} />
        </TabsContent>
        <TabsContent value="in-progress">
          <TableWrapper data={requestsData} />
        </TabsContent>
        <TabsContent value="completed">
          <TableWrapper data={requestsData} />
        </TabsContent>
        <TabsContent value="cancelled">
          <TableWrapper data={requestsData} />
        </TabsContent>
      </Tabs>
    </>
  );
}

// Reusable helper component for the table
function TableWrapper({
  data,
  showActions = false,
}: {
  data: typeof requestsData;
  showActions?: boolean;
}) {
  return (
    <Card className="p-4">
      <div className="mb-4 w-full max-w-xs">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Filter by the Customer/ Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="customer">Customer</SelectItem>
            <SelectItem value="date">Date</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            {showActions && (
              <TableHead className="text-left w-28">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((request, index) => (
            <TableRow key={index} className="align-top">
              <TableCell className="font-medium py-4">
                {request.customer}
              </TableCell>
              <TableCell className="py-4">{request.vehicle}</TableCell>
              <TableCell className="py-4">{request.date}</TableCell>
              <TableCell className="py-4">{request.startTime}</TableCell>
              <TableCell className="py-4">{request.endTime}</TableCell>
              {showActions && (
                <TableCell className="text-right py-4 w-28">
                  <div className="flex gap-4 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-10 w-10 p-0 bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 border border-green-300 rounded-full"
                    >
                      <Check className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-10 w-10 p-0 bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800 border border-red-300 rounded-full"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
