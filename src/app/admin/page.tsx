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
import {
  Users,
  FolderOpen,
  Calendar,
  UserCheck,
  Wrench,
  AlertCircle,
} from "lucide-react";

// Data for the components
const statsData = [
  { title: "Total Employees", value: "12", icon: Users },
  { title: "Active Projects", value: "8", icon: FolderOpen },
  { title: "Upcoming Appointments", value: "3", icon: Calendar },
  { title: "Total Customers", value: "12", icon: UserCheck },
  { title: "Total Services", value: "8", icon: Wrench },
  { title: "Modification Requests", value: "3", icon: AlertCircle },
];

const projectsStatusData = [
  { status: "Active", count: 8, percentage: 40, fill: "#163172" }, // primary color
  { status: "Completed", count: 15, percentage: 60, fill: "#10b981" }, // emerald-500
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
  active: { label: "Active", color: "#163172" },
  completed: { label: "Completed", color: "#10b981" },
  pending: { label: "Pending", color: "#f59e0b" },
  cancelled: { label: "Cancelled", color: "#ef4444" },
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          Admin Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Welcome to the admin dashboard!!
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statsData.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card
              key={stat.title}
              className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-700 text-base font-semibold mb-1">
                      {stat.title}
                    </p>
                    <div className="text-4xl font-extrabold text-primary">
                      {stat.value}
                    </div>
                  </div>
                  <div className="p-3 bg-primary rounded-lg shadow-sm">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Projects by Status - Doughnut Chart */}
      <Card className="bg-white shadow-lg border-0">
        <CardHeader className="pb-6">
          <CardTitle className="text-3xl font-bold text-gray-900">
            Projects by Status
          </CardTitle>
          <CardDescription className="text-gray-600 text-base">
            Overview of current project statuses and distribution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-16">
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
                  strokeWidth={3}
                />
              </PieChart>
            </ChartContainer>
            <div className="space-y-4">
              {projectsStatusData.map((item) => (
                <div key={item.status} className="flex items-center gap-4">
                  <div
                    className="w-6 h-6 rounded-full shadow-sm"
                    style={{ backgroundColor: item.fill }}
                  ></div>
                  <div className="flex-1">
                    <div className="text-lg font-bold text-gray-900">
                      {item.status}
                    </div>
                    <div className="text-base text-gray-600">
                      {item.percentage}% ({item.count} projects)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Line Charts Section */}
      <div className="space-y-10">
        <Card className="bg-white shadow-lg border-0">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl font-bold text-gray-900">
              Registered Customers
            </CardTitle>
            <CardDescription className="text-gray-600 text-base">
              Monthly registered customers in this year
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

        <Card className="bg-white shadow-lg border-0">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl font-bold text-gray-900">
              Completed Projects
            </CardTitle>
            <CardDescription className="text-gray-600 text-base">
              Monthly completed projects in this year
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
    </div>
  );
}
