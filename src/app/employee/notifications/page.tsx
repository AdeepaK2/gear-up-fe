"use client";
import React, { useState } from "react";
import { Bell, Clock, AlertCircle, Loader2, X } from "lucide-react";
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';

export default function EmployeeNotifications() {
	const { notifications, loading, markAsRead, markAllAsRead, deleteNotification, connectionStatus } = useNotifications();
	const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

	const handleMarkAsRead = async (id: string, index: number) => {
		await markAsRead(id);
		setSelectedIdx(index);
	};

	const handleDismiss = async (id: string) => {
		await deleteNotification(id);
		if (selectedIdx !== null) setSelectedIdx(null);
	};

	const newNotifications = notifications.filter((n) => !n.read);
	const oldNotifications = notifications.filter((n) => n.read);

	const getTypeIcon = (type: string) => {
		switch (type.toLowerCase()) {
			case 'appointment':
				return <AlertCircle className="w-5 h-5 text-blue-500" />;
			case 'project':
			case 'project_update':
				return <Clock className="w-5 h-5 text-purple-500" />;
			default:
				return <Bell className="w-5 h-5 text-gray-500" />;
		}
	};

	const getTypeColor = (type: string, read: boolean) => {
		const baseOpacity = read ? 'opacity-60' : '';
		switch (type.toLowerCase()) {
			case 'appointment':
				return `border-l-blue-500 bg-blue-50 ${baseOpacity}`;
			case 'project':
			case 'project_update':
				return `border-l-purple-500 bg-purple-50 ${baseOpacity}`;
			default:
				return `border-l-gray-500 bg-gray-50 ${baseOpacity}`;
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen space-y-8 p-6">
				<h1 className="text-3xl font-bold text-primary mb-6">Notifications</h1>
				<div className="flex items-center justify-center py-12">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
					<span className="ml-2 text-lg">Loading notifications...</span>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen space-y-8 p-6">
			<div className="flex justify-between items-center mb-6">
				<div className="flex items-center gap-3">
					<h1 className="text-3xl font-bold text-primary">Notifications</h1>
					<div className="w-8 h-8 bg-primary text-white text-lg rounded-full flex items-center justify-center font-semibold">
						{notifications.length}
					</div>
					{connectionStatus === 'CONNECTED' && (
						<span className="text-xs text-green-600 flex items-center gap-1">
							<span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
							Live
						</span>
					)}
				</div>
				<button
					className="text-sm font-medium text-gray-600 hover:underline"
					onClick={markAllAsRead}
				>
					Mark all as read
				</button>
			</div>
		<div className="space-y-3">
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
				<div className="flex items-center justify-center py-8">
					<span className="text-gray-500 text-lg">No new notifications</span>
				</div>
			) : (
				newNotifications.map((n, idx) => (
					<div
						key={n.id}
						className={`group relative flex items-start gap-4 bg-gradient-to-r from-white to-blue-50/30 rounded-xl px-5 py-4 shadow-sm hover:shadow-md border border-gray-100 hover:border-blue-200 transition-all duration-300 cursor-pointer ${
							selectedIdx === idx ? "ring-2 ring-blue-400 shadow-md" : ""
						}`}
						onClick={() => handleMarkAsRead(n.id, idx)}
					>
						{/* Unread indicator */}
						<div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-blue-500 to-blue-600 rounded-r-full"></div>
						
						{/* Icon */}
						<div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center ring-1 ring-blue-200">
							{getTypeIcon(n.type)}
						</div>
						
						{/* Content */}
						<div className="flex-1 min-w-0">
							<div className="flex items-start justify-between gap-2">
								<h3 className="text-base font-semibold text-gray-900 line-clamp-1">{n.title}</h3>
								<span className="flex-shrink-0 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
									{n.timeAgo}
								</span>
							</div>
							<p className="text-sm text-gray-600 mt-1.5 line-clamp-2">{n.message}</p>
						</div>
						
						{/* Delete button */}
						<button
							className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 hover:bg-red-50 rounded-lg"
							onClick={(e) => {
								e.stopPropagation();
								handleDismiss(n.id);
							}}
						>
							<X className="w-4 h-4 text-gray-400 hover:text-red-500" />
						</button>
					</div>
				))
			)}				<div className="flex items-center my-6">
					<div className="flex-1 h-px bg-gray-300"></div>
					<div className="flex items-center gap-2 px-4">
						<span className="text-sm font-medium text-gray-600">Old</span>
						<div className="w-6 h-6 bg-gray-400 text-white text-xs rounded-full flex items-center justify-center font-semibold">
							{oldNotifications.length}
						</div>
					</div>
					<div className="flex-1 h-px bg-gray-300"></div>
				</div>

				{oldNotifications.map((n, idx) => (
					<div
						key={n.id}
						className="group relative flex items-start gap-4 bg-white rounded-xl px-5 py-4 shadow-sm hover:shadow border border-gray-100 hover:border-gray-200 transition-all duration-300 cursor-pointer opacity-75 hover:opacity-100"
					>
						{/* Icon */}
						<div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center ring-1 ring-gray-200">
							{getTypeIcon(n.type)}
						</div>
						
						{/* Content */}
						<div className="flex-1 min-w-0">
							<div className="flex items-start justify-between gap-2">
								<h3 className="text-base font-medium text-gray-800 line-clamp-1">{n.title}</h3>
								<span className="flex-shrink-0 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
									{n.timeAgo}
								</span>
							</div>
							<p className="text-sm text-gray-500 mt-1.5 line-clamp-2">{n.message}</p>
						</div>
						
						{/* Delete button */}
						<button
							className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 hover:bg-red-50 rounded-lg"
							onClick={(e) => {
								e.stopPropagation();
								handleDismiss(n.id);
							}}
						>
							<X className="w-4 h-4 text-gray-400 hover:text-red-500" />
						</button>
					</div>
				))}
			</div>
		</div>
	);
}
