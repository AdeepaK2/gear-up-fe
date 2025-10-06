"use client";

import React from "react";
import {
  Check,
  X,
  AlertCircle,
  Clock,
  Settings,
  Car,
  User,
  Filter,
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

// Dummy data for the summary cards
const statCardsData = [
  {
    title: "Pending Requests",
    value: 12,
    icon: Clock,
    color: "from-orange-500 to-orange-600",
  },
  {
    title: "In Progress Requests",
    value: 8,
    icon: Settings,
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Completed Requests",
    value: 3,
    icon: Check,
    color: "from-green-500 to-green-600",
  },
  {
    title: "Cancelled Requests",
    value: 3,
    icon: X,
    color: "from-red-500 to-red-600",
  },
];

// Dummy data for the tables
const requestsData = [
  {
    id: 1,
    customer: "Sophia Clark",
    vehicle: "BMW X5 2023",
    requestType: "Performance Upgrade",
    description: "Upgrade exhaust system and air intake",
    date: "2024-07-20",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    status: "Pending Approval",
    priority: "High",
  },
  {
    id: 2,
    customer: "Olivia Bennett",
    vehicle: "Toyota Camry 2020",
    requestType: "Audio System",
    description: "Install premium sound system",
    date: "2024-07-20",
    startTime: "11:00 AM",
    endTime: "12:00 PM",
    status: "In Progress",
    priority: "Medium",
  },
  {
    id: 3,
    customer: "Marcus Rodriguez",
    vehicle: "Ford F-150 2022",
    requestType: "Suspension Mod",
    description: "Lift kit installation",
    date: "2024-07-20",
    startTime: "2:00 PM",
    endTime: "4:00 PM",
    status: "Completed",
    priority: "Low",
  },
];

export default function ModificationRequestsPage() {
  const getStatusCounts = () => {
    return {
      pending: requestsData.filter((r) => r.status === "Pending Approval")
        .length,
      inProgress: requestsData.filter((r) => r.status === "In Progress").length,
      completed: requestsData.filter((r) => r.status === "Completed").length,
      cancelled: requestsData.filter((r) => r.status === "Cancelled").length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          Manage Modification Requests
        </h1>
        <p className="text-lg text-gray-600">
          Track and approve vehicle modification requests
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
                <Settings className="h-8 w-8 text-white" />
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

      {/* Filtered Modification Requests */}
      <div className="space-y-6 mt-16">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">
            Filtered Modification Requests
          </h2>
          <p className="text-lg text-gray-600">
            Manage modification requests by status
          </p>
        </div>

        {/* Tabs for different request statuses */}
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
            {/* We pass showActions={true} to render the Approve/Reject buttons */}
            <TableWrapper
              data={requestsData.filter((r) => r.status === "Pending Approval")}
              showActions={true}
              status="Pending Approval"
            />
          </TabsContent>
          <TabsContent value="in-progress" className="mt-6">
            <TableWrapper
              data={requestsData.filter((r) => r.status === "In Progress")}
              status="In Progress"
            />
          </TabsContent>
          <TabsContent value="completed" className="mt-6">
            <TableWrapper
              data={requestsData.filter((r) => r.status === "Completed")}
              status="Completed"
            />
          </TabsContent>
          <TabsContent value="cancelled" className="mt-6">
            <TableWrapper
              data={requestsData.filter((r) => r.status === "Cancelled")}
              status="Cancelled"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Reusable helper component for the table
function TableWrapper({
  data,
  showActions = false,
  status = "Modification Requests",
}: {
  data: typeof requestsData;
  showActions?: boolean;
  status?: string;
}) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending Approval":
        return <Clock className="h-5 w-5 text-orange-600" />;
      case "In Progress":
        return <Settings className="h-5 w-5 text-primary" />;
      case "Completed":
        return <Check className="h-5 w-5 text-green-600" />;
      case "Cancelled":
        return <X className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending Approval":
        return "text-orange-600";
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

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleApprove = (id: number) => {
    console.log(`Approving modification request ${id}`);
    // Here you would make an API call to approve the request
  };

  const handleReject = (id: number) => {
    console.log(`Rejecting modification request ${id}`);
    // Here you would make an API call to reject the request
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
            {status} Modification Requests
          </CardTitle>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select>
              <SelectTrigger className="w-80">
                <SelectValue placeholder="Filter by Customer/Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
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
                Request Type
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Vehicle
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Description
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Priority
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Date
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Time
              </TableHead>
              {showActions && (
                <TableHead className="text-center font-semibold text-gray-700">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((request) => (
                <TableRow
                  key={request.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="font-medium py-6 text-gray-900">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      {request.customer}
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <Badge
                      variant="outline"
                      className="bg-purple-50 text-purple-700 border-purple-200"
                    >
                      {request.requestType}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-6 text-gray-700">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-gray-500" />
                      {request.vehicle}
                    </div>
                  </TableCell>
                  <TableCell className="py-6 max-w-48">
                    <div className="text-sm text-gray-600 whitespace-normal break-words">
                      {request.description}
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <Badge
                      variant="outline"
                      className={getPriorityColor(request.priority)}
                    >
                      {request.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-6 text-gray-700">
                    {request.date}
                  </TableCell>
                  <TableCell className="py-6 text-gray-700">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-gray-500" />
                      {request.startTime} - {request.endTime}
                    </div>
                  </TableCell>
                  {showActions && (
                    <TableCell className="text-center py-6">
                      <div className="flex gap-3 justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleApprove(request.id)}
                          className="h-10 w-10 p-0 bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 border border-green-300 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <Check className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReject(request.id)}
                          className="h-10 w-10 p-0 bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800 border border-red-300 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={showActions ? 8 : 7}
                  className="text-center py-8 text-gray-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    {getStatusIcon(status)}
                    <span>
                      No {status.toLowerCase()} modification requests found.
                    </span>
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
