"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Car,
  Clock,
  MessageCircle,
  Plus,
  Settings,
  Bell,
  User,
  CheckCircle,
  AlertCircle,
  Wrench,
  FileText,
  Phone,
  LogOut,
  ChevronRight,
  Edit,
  Star,
} from "lucide-react";

// Mock data - replace with actual API calls
const mockData = {
  customer: {
    name: "John Smith",
    email: "john.smith@email.com",
    membershipLevel: "Gold",
    loyaltyPoints: 2340,
    profileImage: "/public/image.jpg",
  },
  summary: {
    upcomingAppointments: { count: 2, nextDate: "2025-10-02" },
    ongoingProjects: { count: 1, status: "In Progress" },
    completedServices: { count: 15 },
    pendingRequests: { count: 3 },
  },
  notifications: [
    {
      id: 1,
      message: "Your appointment on Oct 2nd has been confirmed",
      type: "info",
      time: "2 hours ago",
      urgent: false,
    },
    {
      id: 2,
      message: 'Project #1234 status updated to "In Progress"',
      type: "success",
      time: "5 hours ago",
      urgent: false,
    },
    {
      id: 3,
      message: "Payment required for completed service",
      type: "warning",
      time: "1 day ago",
      urgent: true,
    },
  ],
  recentActivity: [
    {
      id: 1,
      action: "Appointment booked",
      description: "General checkup scheduled for Oct 2nd",
      time: "2 days ago",
      icon: Calendar,
    },
    {
      id: 2,
      action: "Service accepted",
      description: "Brake pad replacement approved",
      time: "3 days ago",
      icon: CheckCircle,
    },
    {
      id: 3,
      action: "Status updated",
      description: 'Project #1234 moved to "In Progress"',
      time: "5 days ago",
      icon: Wrench,
    },
    {
      id: 4,
      action: "File uploaded",
      description: "Vehicle inspection report submitted",
      time: "1 week ago",
      icon: FileText,
    },
  ],
  vehicles: [
    {
      id: 1,
      make: "Toyota",
      model: "Camry",
      year: 2020,
      licensePlate: "ABC-123",
      nextService: "2025-11-15",
    },
    {
      id: 2,
      make: "Honda",
      model: "Civic",
      year: 2019,
      licensePlate: "XYZ-789",
      nextService: null,
    },
  ],
};

export default function DashboardPage() {
  const [showChatbot, setShowChatbot] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-6">
      {/* Greeting and Overview Section */}
      <Card className="bg-gradient-to-r from-primary to-primary/90 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  Welcome back, {mockData.customer.name}!
                </h1>
                <p className="text-white/80 mt-1">
                  Ready to keep your vehicles in top shape?
                </p>
              </div>
            </div>
            <Link href="/customer/profile">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white text-primary hover:bg-white/90"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/customer/appointments">
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700 font-medium">
                    Upcoming Appointments
                  </p>
                  <p className="text-3xl font-bold text-primary mt-2">
                    {mockData.summary.upcomingAppointments.count}
                  </p>
                  <p className="text-xs text-primary/70 mt-2 bg-white/50 px-2 py-1 rounded-full inline-block">
                    Next: {mockData.summary.upcomingAppointments.nextDate}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/customer/projects">
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700 font-medium">
                    Ongoing Projects
                  </p>
                  <p className="text-3xl font-bold text-primary mt-2">
                    {mockData.summary.ongoingProjects.count}
                  </p>
                  <p className="text-xs text-primary/70 mt-2 bg-white/50 px-2 py-1 rounded-full inline-block">
                    {mockData.summary.ongoingProjects.status}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg">
                  <Wrench className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 font-medium">
                  Completed Services
                </p>
                <p className="text-3xl font-bold text-primary mt-2">
                  {mockData.summary.completedServices.count}
                </p>
                <p className="text-xs text-primary/70 mt-2 bg-white/50 px-2 py-1 rounded-full inline-block">
                  All time
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 font-medium">
                  Pending Requests
                </p>
                <p className="text-3xl font-bold text-primary mt-2">
                  {mockData.summary.pendingRequests.count}
                </p>
                <p className="text-xs text-primary/70 mt-2 bg-white/50 px-2 py-1 rounded-full inline-block">
                  Awaiting response
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg">
                <Clock className="w-8 h-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Notifications and Quick Actions */}
        <div className="space-y-6">
          {/* Notifications & Alerts */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="bg-[#2c3e82] border-b border-gray-100 py-4 px-6">
              <div className="flex items-center justify-between min-h-[32px]">
                <CardTitle className="flex items-center text-white font-semibold">
                  Notifications
                </CardTitle>
                <Link href="/customer/notifications">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 hover:text-white"
                  >
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              {mockData.notifications.slice(0, 3).map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 rounded-xl border-l-4 bg-secondary/10 border-primary shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <p className="text-sm font-semibold text-gray-800">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    {notification.time}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="bg-[#2c3e82] border-b border-gray-100 py-4 px-6">
              <div className="flex items-center justify-between min-h-[32px]">
                <CardTitle className="flex items-center text-white font-semibold">
                  Quick Actions
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <Link href="/customer/appointments" className="block">
                <Button
                  className="w-full justify-start h-12 bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary transition-all duration-200 shadow-md"
                  variant="default"
                >
                  <Calendar className="w-5 h-5 mr-3" />
                  Book New Appointment
                </Button>
              </Link>
              <Link
                href="/customer/projects#additional-service-request"
                className="block"
              >
                <Button
                  className="w-full justify-start h-12 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200"
                  variant="outline"
                >
                  <Plus className="w-5 h-5 mr-3" />
                  Request Custom Service
                </Button>
              </Link>
              <Link href="/customer/projects" className="block">
                <Button
                  className="w-full justify-start h-12 border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white transition-all duration-200"
                  variant="outline"
                >
                  <Wrench className="w-5 h-5 mr-3" />
                  Track Ongoing Projects
                </Button>
              </Link>
              <Link href="/customer/chatbot" className="block">
                <Button
                  className="w-full justify-start h-12 border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white transition-all duration-200"
                  variant="outline"
                >
                  <MessageCircle className="w-5 h-5 mr-3" />
                  Chat with Support
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column - Recent Activity */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="bg-[#2c3e82] border-b border-gray-100 py-4 px-6">
            <div className="flex items-center justify-between min-h-[32px]">
              <CardTitle className="flex items-center text-white font-semibold">
                Recent Activity
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {mockData.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-200 cursor-pointer border border-gray-100 hover:border-gray-200 hover:shadow-md"
                >
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-sm">
                      <activity.icon className="w-5 h-5 text-gray-700" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {activity.time}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Vehicle Snapshot */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="bg-[#2c3e82] border-b border-gray-100 py-4 px-6">
            <div className="flex items-center justify-between min-h-[32px]">
              <CardTitle className="flex items-center text-white font-semibold">
                My Vehicles
              </CardTitle>
              <Link href="/customer/vehicles">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 hover:text-white"
                >
                  Manage
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {mockData.vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="p-4 border-2 border-gray-100 rounded-xl space-y-3 hover:border-gray-200 hover:shadow-md transition-all duration-200 bg-gradient-to-r from-white to-gray-50"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">
                    {vehicle.make} {vehicle.model}
                  </h3>
                  <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                    {vehicle.year}
                  </span>
                </div>
                <p className="text-sm text-gray-700 font-medium">
                  License:{" "}
                  <span className="text-primary">{vehicle.licensePlate}</span>
                </p>
                {vehicle.nextService ? (
                  <div className="flex items-center text-sm bg-orange-50 p-2 rounded-lg">
                    <Clock className="w-4 h-4 mr-2 text-orange-500" />
                    <span className="text-orange-700 font-medium">
                      Next service: {vehicle.nextService}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center text-sm bg-green-50 p-2 rounded-lg">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    <span className="text-green-700 font-medium">
                      Up to date
                    </span>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Footer Links */}
      <Card className="mt-8">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-center space-x-6 text-sm">
            <Link
              href="/customer/profile"
              className="flex items-center text-gray-600 hover:text-blue-600"
            >
              <Settings className="w-4 h-4 mr-1" />
              Profile Settings
            </Link>
            <Link
              href="/contact"
              className="flex items-center text-gray-600 hover:text-blue-600"
            >
              <Phone className="w-4 h-4 mr-1" />
              Support Center
            </Link>
            <Link
              href="#"
              className="flex items-center text-gray-600 hover:text-blue-600"
            >
              <FileText className="w-4 h-4 mr-1" />
              Terms & Policies
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-800"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Floating Chatbot Button */}
      {!showChatbot && (
        <Button
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg"
          onClick={() => setShowChatbot(true)}
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {/* Chatbot Widget (simplified overlay) */}
      {showChatbot && (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-lg shadow-xl border z-50">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Support Chat</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowChatbot(false)}
            >
              ×
            </Button>
          </div>
          <div className="p-4 h-72 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Chat functionality will be integrated here</p>
              <Link href="/customer/chatbot">
                <Button className="mt-3" size="sm">
                  Open Full Chat
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
