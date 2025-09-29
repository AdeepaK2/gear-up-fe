"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const statCards = [
  { title: "Assigned Services", value: "12" },
  { title: "In progress", value: "4" },
  { title: "Completed Today", value: "7" },
];

const dailyProgress = {
  completed: 7,
  total: 11,
};

const appointments = [
  {
    customer: "John Smith",
    service: "Oil change",
    date: "2025-06-13",
    time: "10:00 AM",
    status: "Scheduled",
  },
  {
    customer: "Ann Mary",
    service: "Lube Service",
    date: "2025-06-14",
    time: "2:00 PM",
    status: "Confirmed",
  },
  {
    customer: "Ben Geller",
    service: "Tyre Service",
    date: "2025-06-15",
    time: "11:00 AM",
    status: "Pending",
  },
];

const projectsStatusData = [
  { status: 'Active', value: 40 },
  { status: 'Completed', value: 75 },
  { status: 'Pending', value: 20 },
  { status: 'Cancelled', value: 90 },
];

const recentActivity = [
  {
    text: "Project 'Alpha' updated",
    date: "2025-06-08 14:30",
  },
  {
    text: "New customer 'Liam Harper' added",
    date: "2025-06-07 09:15",
  },
  {
    text: "Appointment with 'Ava Morgan' scheduled",
    date: "2025-06-06 16:45",
  },
];

export default function EmployeeDashboard() {
  return (
    <div className="min-h-screen px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

      {/* Stat Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.title} className="bg-white rounded-xl border p-6 flex flex-col items-start">
            <div className="text-base font-medium mb-2">{stat.title}</div>
            <div className="text-3xl font-bold">{stat.value}</div>
          </div>
        ))}
        {/* Daily Progress Card */}
        <div className="bg-white rounded-xl border p-6 flex flex-col items-start">
          <div className="text-base font-medium mb-2">Daily Progress</div>
          <div className="text-sm mb-2">{dailyProgress.completed} of {dailyProgress.total} Appointments</div>
          <Progress value={Math.round((dailyProgress.completed / dailyProgress.total) * 100)} className="h-2 w-full bg-gray-200" />
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="mb-8">
        <div className="text-xl font-semibold mb-4">Upcoming Appointments</div>
        <div className="bg-white rounded-xl border overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left font-medium">Customer</th>
                <th className="px-4 py-3 text-left font-medium">Service</th>
                <th className="px-4 py-3 text-left font-medium">Date</th>
                <th className="px-4 py-3 text-left font-medium">Time</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="px-4 py-3">{a.customer}</td>
                  <td className="px-4 py-3">{a.service}</td>
                  <td className="px-4 py-3">{a.date}</td>
                  <td className="px-4 py-3">{a.time}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-4 py-1 text-xs font-semibold bg-gray-100 text-gray-800`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Projects by Status */}
      <div className="mb-8">
        <div className="text-xl font-semibold mb-4">Projects by Status</div>
        <div className="bg-white rounded-xl border p-6">
          <div className="text-base font-medium mb-4">Projects by Status</div>
          <div className="space-y-4">
            {projectsStatusData.map((item) => (
              <div key={item.status}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{item.status}</span>
                </div>
                <Progress value={item.value} className="h-2 bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="text-xl font-semibold mb-4">Recent Activity</div>
        <div className="bg-white rounded-xl border p-6">
          {recentActivity.map((activity, idx) => (
            <div key={idx} className="mb-4 last:mb-0">
              <div className="font-medium">{activity.text}</div>
              <div className="text-xs text-gray-500">{activity.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}