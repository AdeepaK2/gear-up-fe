"use client"; // Chart components require this

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

// Data for the components
const statsData = [
  { title: "Total Employees", value: "12" },
  { title: "Active Projects", value: "8" },
  { title: "Upcoming appointments", value: "3" },
  { title: "Total Customers", value: "12" },
  { title: "Total Services", value: "8" },
  { title: "Modification Requests", value: "3" },
];

const projectsStatusData = [
  { status: "Active", count: 8, percentage: 40, fill: "#10b981" }, // emerald-500
  { status: "Completed", count: 15, percentage: 60, fill: "#3b82f6" }, // blue-500
  { status: "Pending", count: 3, percentage: 15, fill: "#f59e0b" }, // amber-500
  { status: "Cancelled", count: 2, percentage: 10, fill: "#ef4444" }, // red-500
];

const customersChartData = [
  { month: "Sep", value: 45 },
  { month: "Oct", value: 62 },
  { month: "Nov", value: 38 },
  { month: "Dec", value: 71 },
  { month: "Jan", value: 55 },
  { month: "Feb", value: 83 },
];

const projectsChartData = [
  { month: "Sep", value: 12 },
  { month: "Oct", value: 18 },
  { month: "Nov", value: 15 },
  { month: "Dec", value: 22 },
  { month: "Jan", value: 19 },
  { month: "Feb", value: 25 },
];

const chartConfig = {
  projects: { label: "Projects" },
  active: { label: "Active", color: "#10b981" },
  completed: { label: "Completed", color: "#3b82f6" },
  pending: { label: "Pending", color: "#f59e0b" },
  cancelled: { label: "Cancelled", color: "#ef4444" },
};

export default function AdminDashboardPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6 mt-6">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {statsData.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Projects by Status - Doughnut Chart */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Projects by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-8">
              <ChartContainer
                config={chartConfig}
                className="aspect-square h-[300px]"
              >
                <PieChart>
                  <ChartTooltip
                    content={<ChartTooltipContent nameKey="count" hideLabel />}
                  />
                  <Pie
                    data={projectsStatusData}
                    dataKey="count"
                    nameKey="status"
                    innerRadius={60}
                    outerRadius={120}
                    strokeWidth={2}
                  />
                </PieChart>
              </ChartContainer>
              <div className="space-y-4">
                {projectsStatusData.map((item) => (
                  <div key={item.status} className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    ></div>
                    <span className="text-sm font-medium">
                      {item.status} - {item.percentage}% ({item.count} projects)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Line Charts Section */}
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Registered Customers</CardTitle>
            <CardDescription>
              Monthly registered customers in the last year.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[280px] w-full">
              <LineChart
                data={customersChartData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#163172"
                  strokeWidth={2}
                  dot={{ fill: "#163172", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completed Projects</CardTitle>
            <CardDescription>
              Monthly completed projects in the last year.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[280px] w-full">
              <LineChart
                data={projectsChartData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#163172"
                  strokeWidth={2}
                  dot={{ fill: "#163172", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
