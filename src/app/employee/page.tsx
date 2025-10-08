"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { User, Edit, Calendar, Wrench, CheckCircle, Clock, X } from 'lucide-react';
import Link from 'next/link';

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

const getStatusBadgeStyle = (status: string) => {
	switch (status.toLowerCase()) {
		case "scheduled":
      return "bg-yellow-50 text-yellow-800 border-yellow-200";
		case "pending":
			return "bg-orange-100 text-orange-800 border-orange-200";
		case "confirmed":
			return "bg-green-50 text-green-800 border-green-200";
		case "completed":
			return "bg-blue-50 text-blue-800 border-blue-200";
		case "cancelled":
			return "bg-red-50 text-red-800 border-red-200";
		default:
			return "bg-gray-50 text-gray-800 border-gray-200";
	}
};

export default function EmployeeDashboard() {
	const [activities, setActivities] = React.useState(recentActivity);

	const handleRemoveActivity = (idx: number) => {
		setActivities(prev => prev.filter((_, i) => i !== idx));
	};

	return (
		<div className="min-h-screen bg-gray-50 p-4 space-y-6">
			{/* Welcome Card */}
			<Card className="mb-8 bg-gradient-to-r from-primary to-primary/90 text-white border-0">
				<CardContent className="p-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
								<User className="w-8 h-8 text-white" />
							</div>
							<div>
								<h1 className="text-2xl font-bold">
									Welcome back, John Smith!
								</h1>
								<p className="text-white/80 mt-1">
									Here's what's happening with your work today.
								</p>
							</div>
						</div>
						<Link href="/employee/profile">
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

			{/* Stat Cards */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
				<Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-700 font-medium">
									Assigned Services
								</p>
								<p className="text-3xl font-bold text-primary mt-2">
									12
								</p>
								<p className="text-xs text-primary/70 mt-2 bg-white/50 px-2 py-1 rounded-full inline-block">
									Active tasks
								</p>
							</div>
							<div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg">
								<Calendar className="w-8 h-8 text-white" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-700 font-medium">
									In progress
								</p>
								<p className="text-3xl font-bold text-primary mt-2">
									4
								</p>
								<p className="text-xs text-primary/70 mt-2 bg-white/50 px-2 py-1 rounded-full inline-block">
									Currently working
								</p>
							</div>
							<div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg">
								<Wrench className="w-8 h-8 text-white" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-700 font-medium">
									Completed Today
								</p>
								<p className="text-3xl font-bold text-primary mt-2">
									7
								</p>
								<p className="text-xs text-primary/70 mt-2 bg-white/50 px-2 py-1 rounded-full inline-block">
									Today's work
								</p>
							</div>
							<div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg">
								<CheckCircle className="w-8 h-8 text-white" />
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Daily Progress Card */}
				<Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-700 font-medium">
									Daily Progress
								</p>
								<p className="text-3xl font-bold text-primary mt-2">
									{Math.round((dailyProgress.completed / dailyProgress.total) * 100)}%
								</p>
								<p className="text-xs text-primary/70 mt-2 bg-white/50 px-2 py-1 rounded-full inline-block">
									{dailyProgress.completed} of {dailyProgress.total} Appointments
								</p>
							</div>
							<div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg">
								<Clock className="w-8 h-8 text-white" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Upcoming Appointments */}
			<Card className="mb-8 shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
				<CardHeader className="bg-[#2c3e82] border-b border-gray-100 py-4 px-6">
					<CardTitle className="text-xl font-semibold text-white">Upcoming Appointments</CardTitle>
				</CardHeader>
				<CardContent className="overflow-x-auto p-6">
					<table className="min-w-full text-sm">
						<thead>
							<tr className="border-b">
								<th className="px-4 py-3 text-left font-bold">Customer</th>
								<th className="px-4 py-3 text-left font-bold">Service</th>
								<th className="px-4 py-3 text-left font-bold">Date</th>
								<th className="px-4 py-3 text-left font-bold">Time</th>
								<th className="px-4 py-3 text-left font-bold">Status</th>
							</tr>
						</thead>
						<tbody>
							{appointments.map((a, i) => (
								<tr key={i} className="border-b last:border-0 hover:bg-blue-50 hover:backdrop-blur-sm hover:shadow-md transition-all duration-200 cursor-pointer">
									<td className="px-4 py-3">{a.customer}</td>
									<td className="px-4 py-3">{a.service}</td>
									<td className="px-4 py-3">{a.date}</td>
									<td className="px-4 py-3">{a.time}</td>
									<td className="px-4 py-3">
										<span className={`inline-block rounded-full px-4 py-1 text-xs font-semibold border w-28 text-center ${getStatusBadgeStyle(a.status)}`}>
											{a.status}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</CardContent>
			</Card>

			{/* Projects by Status */}
			<Card className="mb-8 shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
				<CardHeader className="bg-[#2c3e82] border-b border-gray-100 py-4 px-6">
					<CardTitle className="text-xl font-semibold text-white">Projects by Status</CardTitle>
				</CardHeader>
				<CardContent className="p-6">
					<div className="space-y-4">
						{projectsStatusData.map((item) => (
							<div key={item.status}>
								<div className="flex justify-between mb-1">
									<span className="text-sm font-medium">{item.status}</span>
								</div>
								<Progress value={item.value} className="h-2 bg-gray-200 [&>div]:bg-blue-500" />
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Recent Activity */}
			<Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
				<CardHeader className="bg-[#2c3e82] border-b border-gray-100 py-4 px-6">
					<CardTitle className="text-xl font-semibold text-white">Recent Activity</CardTitle>
				</CardHeader>
				<CardContent className="p-6">
					{activities.map((activity, idx) => (
						<div key={idx} className="mb-4 last:mb-0 p-3 rounded-lg hover:bg-blue-50 hover:backdrop-blur-sm hover:shadow-md transition-all duration-200 cursor-pointer relative group">
							<div className="font-medium">{activity.text}</div>
							<div className="text-xs text-gray-500">{activity.date}</div>
							<button
								onClick={(e) => {
									e.stopPropagation();
									handleRemoveActivity(idx);
								}}
								className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
								aria-label="Remove activity"
							>
								<X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
							</button>
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}