"use client";
import React from "react";
import { Calendar } from '@/components/ui/calendar';
import { CalendarEvent } from '@/components/ui/calendar-event';
import { Search, HelpCircle, ChevronLeft, ChevronRight, Filter, Calendar as CalendarIcon } from "lucide-react";

const appointmentsList = [
	{
		name: "Emily Johnson",
		service: "oil change",
		time: "10.00-11.00",
		link: "#"
	},
	{
		name: "Michael Lee",
		service: "Lube Service",
		time: "10.00-11.00",
		link: "#"
	}
];

const calendarEvents = [
	{
		date: new Date(2025, 7, 20), // August 20, 2025
		title: "Drain oil engine",
		description: "Oil\n10.00AM - 11.00AM",
		color: "#e1e0e8ff"
	}
];

export default function EmployeeAppointments() {
	const [selectedDay, setSelectedDay] = React.useState<number | null>(7);
	const [activeTab, setActiveTab] = React.useState<"pending" | "inprogress" | "completed">("pending");
	const [miniDate, setMiniDate] = React.useState<Date | undefined>(new Date(2025, 0, 7)); // January 7, 2025
	const [calendarMonth, setCalendarMonth] = React.useState<Date>(new Date(2025, 7)); // August 2025

	return (
		<div className="min-h-screen space-y-8 p-6">
			<h1 className="text-3xl font-bold text-primary mb-6">Appointments</h1>
			<div className="flex gap-8">
				{/* Left Sidebar - Fixed width on large screens, full width on mobile */}
				<div className="flex flex-col gap-4 w-full lg:w-[320px] lg:flex-shrink-0">
					{/* Filter and Month */}
					<div className="flex gap-2">
						<button className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border font-medium text-sm">
							<Filter className="w-4 h-4" /> Filter
						</button>
						<button className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border font-medium text-sm">
							<CalendarIcon className="w-4 h-4" /> Monthly
						</button>
					</div>
					{/* Mini Calendar */}
					<div className="bg-white rounded-xl p-4">
						<Calendar
							mode="single"
							selected={miniDate}
							onSelect={setMiniDate}
							month={miniDate}
							onMonthChange={setMiniDate}
							numberOfMonths={1}
							fixedWeeks
							className="rounded-md border-none shadow-none"
						/>
					</div>
					{/* Appointment List */}
					<div className="bg-white rounded-xl p-4 mt-2">
						<div className="font-semibold mb-2">My Appointment List</div>
						<div className="flex flex-col gap-2">
							{appointmentsList.map((a, i) => (
								<div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
									<div>
										<div className="font-medium text-sm">{a.name}</div>
										<a href={a.link} className="text-blue-600 text-xs underline">{a.service}</a>
									</div>
									<div className="text-xs font-medium">{a.time}</div>
									<button className="ml-2 w-4 h-4 rounded-full border border-gray-400"></button>
								</div>
							))}
						</div>
						<button className="w-full mt-4 py-2 rounded-full bg-primary hover:bg-secondary text-white font-semibold text-sm">See All</button>
					</div>
				</div>
				{/* Right Calendar Grid */}
				<div className="flex-1">
					{/* Top Controls */}
					<div className="flex justify-between items-center mb-2">
						<div className="flex items-center gap-2">
							{/* Month/Year Picker - only show month/year and navigation, no days */}
							<div className="bg-white rounded-xl px-4 py-2 flex items-center min-w-[220px] justify-between">
								<button
									className="p-1 rounded hover:bg-gray-100"
									onClick={() =>
										setCalendarMonth(prev =>
											new Date(prev.getFullYear(), prev.getMonth() - 1)
										)
									}
									aria-label="Previous Month"
								>
									<ChevronLeft className="w-5 h-5" />
								</button>
								<span className="font-semibold text-lg">
									{calendarMonth.toLocaleString("default", { month: "long", year: "numeric" })}
								</span>
								<button
									className="p-1 rounded hover:bg-gray-100"
									onClick={() =>
										setCalendarMonth(prev =>
											new Date(prev.getFullYear(), prev.getMonth() + 1)
										)
									}
									aria-label="Next Month"
								>
									<ChevronRight className="w-5 h-5" />
								</button>
							</div>
							{/* ...existing code for Today button... */}
							
						</div>
						<div className="flex items-center gap-2">
							<div className="flex items-center bg-white rounded-full px-3 py-1 border">
								<Search className="w-4 h-4 mr-2 text-gray-400" />
								<input className="bg-transparent outline-none text-sm w-24" placeholder="Search" />
							</div>
							<button className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border font-medium text-sm">
								<HelpCircle className="w-4 h-4" /> Support
							</button>
						</div>
					</div>
					{/* Status Tabs */}
					<div className="flex gap-2 mb-2">
						<button
							className={`px-4 py-2 rounded-full font-medium text-sm ${activeTab === "pending" ? "bg-gray-200" : "bg-white"}`}
							onClick={() => setActiveTab("pending")}
						>
							Pending
						</button>
						<button
							className={`px-4 py-2 rounded-full font-medium text-sm ${activeTab === "inprogress" ? "bg-gray-200" : "bg-white"}`}
							onClick={() => setActiveTab("inprogress")}
						>
							In progress
						</button>
						<button
							className={`px-4 py-2 rounded-full font-medium text-sm ${activeTab === "completed" ? "bg-gray-200" : "bg-white"}`}
							onClick={() => setActiveTab("completed")}
						>
							Completed
						</button>
					</div>
					{/* Calendar Grid */}
					<div className="bg-white rounded-xl p-4">
						<CalendarEvent
							month={calendarMonth}
							events={calendarEvents}
							onDayClick={date => setCalendarMonth(new Date(date.getFullYear(), date.getMonth()))}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}


