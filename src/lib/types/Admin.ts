export interface AdminStats {
  totalEmployees: number;
  activeProjects: number;
  upcomingAppointments: number;
  totalCustomers: number;
  totalServices: number;
}

export interface ProjectStatusSegment {
  status: string;
  count: number;
  percentage: number;
}

export interface MonthlyMetric {
  month: string;
  count: number;
}

export interface AdminDashboardResponse {
  stats: AdminStats;
  projectStatus: ProjectStatusSegment[];
  customerRegistrations: MonthlyMetric[];
  projectCompletions: MonthlyMetric[];
}

