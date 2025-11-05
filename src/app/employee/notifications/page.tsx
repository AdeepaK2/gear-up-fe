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
				return <AlertCircle className="w-4 h-4 text-blue-500" />;
			case 'project':
			case 'project_update':
				return <Clock className="w-4 h-4 text-purple-500" />;
			default:
				return <Bell className="w-4 h-4 text-gray-500" />;
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
			<div className="space-y-2">
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
					newNotifications.map((n, idx) => (
						<div
							key={n.id}
							className={`flex items-center bg-white rounded-lg px-4 py-3 shadow-sm border-l-4 ${getTypeColor(n.type, n.read)} hover:bg-blue-50 transition-all duration-200 cursor-pointer ${
								selectedIdx === idx ? "border-2 border-blue-500" : ""
							}`}
							onClick={() => handleMarkAsRead(n.id, idx)}
						>
							<div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 mr-4 flex-shrink-0">
								{getTypeIcon(n.type)}
							</div>
							<div className="flex-1">
								<div className="text-base font-medium">{n.title}</div>
								<div className="text-sm text-gray-600 mt-1">{n.message}</div>
								<div className="text-xs text-gray-400 mt-1">{n.timeAgo}</div>
							</div>
							<button
								className="text-gray-400 hover:text-gray-600 ml-4"
								onClick={(e) => {
									e.stopPropagation();
									handleDismiss(n.id);
								}}
							>
								<X className="w-5 h-5" />
							</button>
						</div>
					))
				)}

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

				{oldNotifications.map((n, idx) => (
					<div
						key={n.id}
						className={`flex items-center bg-white rounded-lg px-4 py-3 shadow-sm border-l-4 ${getTypeColor(n.type, n.read)} hover:bg-blue-50 transition-all duration-200 cursor-pointer`}
					>
						<div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 mr-4 flex-shrink-0">
							{getTypeIcon(n.type)}
						</div>
						<div className="flex-1">
							<div className="text-base">{n.title}</div>
							<div className="text-sm text-gray-600 mt-1">{n.message}</div>
							<div className="text-xs text-gray-400 mt-1">{n.timeAgo}</div>
						</div>
						<button
							className="text-gray-400 hover:text-gray-600 ml-4"
							onClick={(e) => {
								e.stopPropagation();
								handleDismiss(n.id);
							}}
						>
							<X className="w-5 h-5" />
						</button>
					</div>
				))}
			</div>
		</div>
	);
}
