"use client";
import React from "react";

const initialNotifications = [
	{
		message:
			"A new service appointment has been scheduled for vehicle [Vehicle ID] on [Date] at [Time].",
		date: "Sep 5 2025",
		time: "18.00",
		read: false,
	},
	{
		message:
			"A new service appointment has been scheduled for vehicle [Vehicle ID] on [Date] at [Time].",
		date: "Sep 6 2025",
		time: "16.30",
		read: false,
	},
	{
		message:
			"A new service appointment has been scheduled for vehicle [Vehicle ID] on [Date] at [Time].",
		date: "Sep 6 2025",
		time: "12.45",
		read: false,
	},
	{
		message:
			"A new service appointment has been scheduled for vehicle [Vehicle ID] on [Date] at [Time].",
		date: "Sep 5 2025",
		time: "18.00",
		read: true,
	},
	{
		message:
			"A new service appointment has been scheduled for vehicle [Vehicle ID] on [Date] at [Time].",
		date: "Sep 5 2025",
		time: "18.00",
		read: true,
	},
	{
		message:
			"A new service appointment has been scheduled for vehicle [Vehicle ID] on [Date] at [Time].",
		date: "Sep 5 2025",
		time: "18.00",
		read: true,
	},
	{
		message:
			"A new service appointment has been scheduled for vehicle [Vehicle ID] on [Date] at [Time].",
		date: "Sep 5 2025",
		time: "18.00",
		read: true,
	},
	{
		message:
			"A new service appointment has been scheduled for vehicle [Vehicle ID] on [Date] at [Time].",
		date: "Sep 3 2025",
		time: "14.30",
		read: true,
	},
	{
		message:
			"A new service appointment has been scheduled for vehicle [Vehicle ID] on [Date] at [Time].",
		date: "Sep 2 2025",
		time: "10.15",
		read: true,
	},
];

export default function EmployeeNotifications() {
	const [notifications, setNotifications] = React.useState(initialNotifications);
	const [selectedIdx, setSelectedIdx] = React.useState<number | null>(null);

	// Split notifications into new (unread) and old (read)
	const newNotifications = notifications.filter((n) => !n.read);
	const oldNotifications = notifications.filter((n) => n.read);

	const handleDismiss = (idx: number) => {
		setNotifications((prev) => prev.filter((_, i) => i !== idx));
		if (selectedIdx === idx) setSelectedIdx(null);
	};

	const handleMarkAllAsRead = () => {
		setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
		setSelectedIdx(null);
	};

	return (
		<div className="min-h-screen space-y-8 p-6">
			<div className="flex justify-between items-center mb-6">
				<div className="flex items-center gap-3">
					<h1 className="text-3xl font-bold text-primary">Notifications</h1>
					<div className="w-8 h-8 bg-primary text-white text-lg rounded-full flex items-center justify-center font-semibold">
						{notifications.length}
					</div>
				</div>
				<button
					className="text-sm font-medium text-gray-600 hover:underline"
					onClick={handleMarkAllAsRead}
				>
					Mark all as read
				</button>
			</div>
			<div className="space-y-2">
				{/* New Notifications Divider */}
				<div className="flex items-center my-6">
					<div className="flex-1 h-px bg-gray-300"></div>
					<div className="flex items-center gap-2 px-4">
						<span className="text-sm font-medium text-gray-600">New</span>
						<div className="w-6 h-6 bg-primary text-white text-xs rounded-full flex items-center justify-center font-semibold">
							{newNotifications.length}
						</div>
					</div>
					<div className="flex-1 h-px bg-gray-300"></div>
				</div>

				{newNotifications.length === 0 ? (
					<div className="flex items-center justify-center py-4">
						<span className="text-gray-500 text-lg">No new notifications</span>
					</div>
				) : (
					newNotifications.map((n, idx) => {
						const originalIdx = notifications.findIndex(
							(notification) => notification === n
						);
						return (
							<div
								key={originalIdx}
								className={`flex items-center bg-white rounded px-4 py-3 shadow-sm hover:bg-blue-50 transition-all duration-200 cursor-pointer ${
									selectedIdx === originalIdx ? "border-2 border-blue-500" : ""
								}`}
								onClick={() => setSelectedIdx(originalIdx)}
							>
								<div className="w-10 h-10 rounded-full bg-gray-200 mr-8 flex-shrink-0" />
								<div className="flex-1">
									<div className="text-base">{n.message}</div>
									<div className="text-xs text-gray-400 mt-1">{n.date}</div>
								</div>
								<div className="flex flex-col items-end ml-4">
									<span className="text-xs text-gray-400">{n.time}</span>
									<button
										className="text-gray-400 hover:text-gray-600 text-lg leading-none mt-2"
										aria-label="Dismiss"
										onClick={(e) => {
											e.stopPropagation();
											handleDismiss(originalIdx);
										}}
									>
										×
									</button>
								</div>
							</div>
						);
					})
				)}

				{/* Old Notifications Divider */}
				<div className="flex items-center my-6">
					<div className="flex-1 h-px bg-gray-300"></div>
					<div className="flex items-center gap-2 px-4">
						<span className="text-sm font-medium text-gray-600">Old</span>
						<div className="w-6 h-6 bg-gray-400 text-white text-xs rounded-full flex items-center justify-center font-semibold">
							{oldNotifications.length}
						</div>
					</div>
					<div className="flex-1 h-px bg-gray-300"></div>
				</div>

				{oldNotifications.map((n, idx) => {
					const originalIdx = notifications.findIndex(
						(notification) => notification === n
					);
					return (
						<div
							key={originalIdx}
							className={`flex items-center bg-white rounded px-4 py-3 shadow-sm hover:bg-blue-50 transition-all duration-200 cursor-pointer ${
								selectedIdx === originalIdx ? "border-2 border-blue-500" : ""
							}`}
							onClick={() => setSelectedIdx(originalIdx)}
						>
							<div className="w-10 h-10 rounded-full bg-gray-200 mr-8 flex-shrink-0" />
							<div className="flex-1">
								<div className="text-base">{n.message}</div>
								<div className="text-xs text-gray-400 mt-1">{n.date}</div>
							</div>
							<div className="flex flex-col items-end ml-4">
								<span className="text-xs text-gray-400">{n.time}</span>
								<button
									className="text-gray-400 hover:text-gray-600 text-lg leading-none mt-2"
									aria-label="Dismiss"
									onClick={(e) => {
										e.stopPropagation();
										handleDismiss(originalIdx);
									}}
								>
									×
								</button>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
