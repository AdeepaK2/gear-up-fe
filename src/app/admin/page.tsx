"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
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
import type { LucideIcon } from "lucide-react";
import { adminService } from "@/lib/services/adminService";
import type { AdminDashboardResponse, AdminStats } from "@/lib/types/Admin";

const STAT_ITEMS: { key: keyof AdminStats; title: string; icon: LucideIcon }[] = [
  { key: "totalEmployees", title: "Total Employees", icon: Users },
  { key: "activeProjects", title: "Active Projects", icon: FolderOpen },
  { key: "upcomingAppointments", title: "Upcoming Appointments", icon: Calendar },
  { key: "totalCustomers", title: "Total Customers", icon: UserCheck },
  { key: "totalServices", title: "Total Services", icon: Wrench },
];

const PROJECT_STATUS_META: Record<string, { label: string; color: string }> = {
  CREATED: { label: "Created", color: "#6366f1" },
  RECOMMENDED: { label: "Recommended", color: "#8b5cf6" },
  CONFIRMED: { label: "Confirmed", color: "#0ea5e9" },
  IN_PROGRESS: { label: "In Progress", color: "#163172" },
  COMPLETED: { label: "Completed", color: "#10b981" },
  CANCELLED: { label: "Cancelled", color: "#ef4444" },
};

const chartConfig = {
  projects: { label: "Projects" },
  active: { label: "Active", color: "#163172" },
  completed: { label: "Completed", color: "#10b981" },
  pending: { label: "Pending", color: "#f59e0b" },
  cancelled: { label: "Cancelled", color: "#ef4444" },
};

const formatStatusLabel = (status: string) => {
  const meta = PROJECT_STATUS_META[status];
  if (meta) {
    return meta.label;
  }
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const dashboard = await adminService.getDashboard();
        if (mounted) {
          setData(dashboard);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to load dashboard");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const statsData = useMemo(() => {
    if (!data) {
      return STAT_ITEMS.map((item) => ({
        title: item.title,
        value: "-",
        icon: item.icon,
      }));
    }

    return STAT_ITEMS.map((item) => ({
      title: item.title,
      value: data.stats[item.key].toString(),
      icon: item.icon,
    }));
  }, [data]);

  const projectsStatusData = useMemo(() => {
    const source = data?.projectStatus ?? [];
    return source.map((item) => {
      const meta = PROJECT_STATUS_META[item.status] ?? { label: formatStatusLabel(item.status), color: "#94a3b8" };
      return {
        status: meta.label,
        count: item.count,
        percentage: item.percentage,
        fill: meta.color,
      };
    });
  }, [data]);

  const customersChartData = useMemo(
    () => (data?.customerRegistrations ?? []).map((entry) => ({ month: entry.month, value: entry.count })),
    [data],
  );

  const projectsChartData = useMemo(
    () => (data?.projectCompletions ?? []).map((entry) => ({ month: entry.month, value: entry.count })),
    [data],
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-lg text-primary">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-lg text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Admin Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Welcome to the admin dashboard !
        </p>
      </div>

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

      <Card className="bg-white shadow-lg border-0">
        <CardHeader className="bg-[#2c3e82] border-b border-gray-100 py-4 px-6">
          <CardTitle className="text-2xl font-bold text-white">
            Projects by Status
          </CardTitle>
          <CardDescription className="text-white  text-base">
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
                      {item.percentage.toFixed(0)}% ({item.count} projects)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-10">
        <Card className="bg-white shadow-lg border-0">
          <CardHeader className= "bg-[#2c3e82] border-b border-gray-100 py-4 px-6">
            <CardTitle className="text-2xl font-bold text-white">
              Registered Customers
            </CardTitle>
            <CardDescription className="text-white text-base">
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
          <CardHeader className="bg-[#2c3e82] border-b border-gray-100 py-4 px-6">
            <CardTitle className="text-2xl font-bold text-white">
              Completed Projects
            </CardTitle>
            <CardDescription className="text-white text-base">
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
