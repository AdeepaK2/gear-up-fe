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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/customer/appointments">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Upcoming Appointments</p>
                  <p className="text-2xl font-bold">
                    {mockData.summary.upcomingAppointments.count}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Next: {mockData.summary.upcomingAppointments.nextDate}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/customer/projects">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ongoing Projects</p>
                  <p className="text-2xl font-bold">
                    {mockData.summary.ongoingProjects.count}
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    {mockData.summary.ongoingProjects.status}
                  </p>
                </div>
                <Wrench className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card className="cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Services</p>
                <p className="text-2xl font-bold">
                  {mockData.summary.completedServices.count}
                </p>
                <p className="text-xs text-green-600 mt-1">All time</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold">
                  {mockData.summary.pendingRequests.count}
                </p>
                <p className="text-xs text-red-600 mt-1">Awaiting response</p>
              </div>
              <Clock className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Notifications and Quick Actions */}
        <div className="space-y-6">
          {/* Notifications & Alerts */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notifications
                </CardTitle>
                <Link href="/customer/notifications">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockData.notifications.slice(0, 3).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border-l-4 ${
                    notification.urgent
                      ? "bg-red-50 border-red-500"
                      : notification.type === "success"
                      ? "bg-green-50 border-green-500"
                      : notification.type === "warning"
                      ? "bg-yellow-50 border-yellow-500"
                      : "bg-blue-50 border-blue-500"
                  }`}
                >
                  <p className="text-sm font-medium">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {notification.time}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/customer/appointments" className="block">
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book New Appointment
                </Button>
              </Link>
              <Button className="w-full justify-start" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Request Custom Service
              </Button>
              <Link href="/customer/projects" className="block">
                <Button className="w-full justify-start" variant="outline">
                  <Wrench className="w-4 h-4 mr-2" />
                  Track Ongoing Projects
                </Button>
              </Link>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => setShowChatbot(true)}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat with Support
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column - Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-shrink-0">
                    <activity.icon className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.action}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Vehicle Snapshot */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Car className="w-5 h-5 mr-2" />
                My Vehicles
              </CardTitle>
              <Link href="/customer/vehicles">
                <Button variant="ghost" size="sm">
                  Manage
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockData.vehicles.map((vehicle) => (
              <div key={vehicle.id} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">
                    {vehicle.make} {vehicle.model}
                  </h3>
                  <span className="text-sm text-gray-500">{vehicle.year}</span>
                </div>
                <p className="text-sm text-gray-600">
                  License: {vehicle.licensePlate}
                </p>
                {vehicle.nextService ? (
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 mr-1 text-orange-500" />
                    <span className="text-orange-600">
                      Next service: {vehicle.nextService}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                    <span className="text-green-600">Up to date</span>
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
