"use client";
import React from "react";
import { Edit, ChevronDown } from "lucide-react";

// Sample data for assigned projects
const assignedProjects = [
	{
		title: "Oil Change",
		customer: "John Smith",
		vehicle: "Range Rover",
		dueDate: "2025-06-13",
		time: "10:00 AM",
		status: "New",
	},
	{
		title: "Lube Service",
		customer: "Ann Mary",
		vehicle: "Honda Navi",
		dueDate: "2025-06-14",
		time: "2:00 PM",
		status: "In_Progress",
	},
	{
		title: "Tyre Service",
		customer: "Ben Geller",
		vehicle: "BMW",
		dueDate: "2025-06-15",
		time: "11:00 AM",
		status: "On Hold",
	},
	{
		title: "Brake Inspection",
		customer: "Sarah Johnson",
		vehicle: "Toyota Corolla",
		dueDate: "2025-06-16",
		time: "9:00 AM",
		status: "New",
	},
	{
		title: "Engine Diagnostic",
		customer: "Mike Wilson",
		vehicle: "Ford Mustang",
		dueDate: "2025-06-17",
		time: "3:30 PM",
		status: "On Hold",
	},
	{
		title: "Battery Replacement",
		customer: "Emma Davis",
		vehicle: "Nissan Altima",
		dueDate: "2025-06-18",
		time: "1:00 PM",
		status: "Completed",
	},
];

const statusOptions = [
	"New",
	"In Progress",
	"On Hold",
	"Completed",
	"Cancelled",
];

const getStatusBadgeStyle = (status: string) => {
	switch (status.toLowerCase()) {
		case "new":
			return "bg-yellow-50 text-yellow-800 border-yellow-200";
		case "in_progress":
		case "in progress":
			return "bg-blue-50 text-blue-800 border-blue-200";
		case "on hold":
			return "bg-orange-100 text-orange-800 border-orange-200";
		case "completed":
			return "bg-green-50 text-green-800 border-green-200";
		case "cancelled":
			return "bg-red-50 text-red-800 border-red-200";
		default:
			return "bg-gray-50 text-gray-800 border-gray-200";
	}
};

const statusStyles: Record<string, string> = {
	New: "bg-yellow-50 text-yellow-800 border-yellow-200",
	In_Progress: "bg-blue-50 text-blue-800 border-blue-200",
	"On Hold": "bg-orange-100 text-orange-800 border-orange-200",
	Completed: "bg-green-50 text-green-800 border-green-200",
	Cancelled: "bg-red-50 text-red-800 border-red-200",
};

export default function EmployeeProjects() {
	const [modalOpen, setModalOpen] = React.useState(false);
	const [editIndex, setEditIndex] = React.useState<number | null>(null);
	const [form, setForm] = React.useState({
		start: "",
		end: "",
		status: "",
	});

	const handleEditClick = (idx: number) => {
		setEditIndex(idx);
		setModalOpen(true);
		setForm({
			start: "",
			end: "",
			status: "",
		});
	};

	const handleClose = () => {
		setModalOpen(false);
		setEditIndex(null);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSave = (e: React.FormEvent) => {
		e.preventDefault();
		// Save logic here
		handleClose();
	};

	return (
		<div className="min-h-screen space-y-8 p-6">
			<h1 className="text-3xl font-bold mb-8 text-primary">Assigned Projects</h1>
			<div className="bg-white rounded-xl border overflow-x-auto">
				<table className="min-w-full text-sm">
					<thead>
						<tr className="border-b">
							<th className="px-4 py-3 text-left font-bold">Title</th>
							<th className="px-4 py-3 text-left font-bold">Customer</th>
							<th className="px-4 py-3 text-left font-bold">Vehicle</th>
							<th className="px-4 py-3 text-left font-bold">Due Date</th>
							<th className="px-4 py-3 text-left font-bold">
								Estimated Time
							</th>
							<th className="px-4 py-3 text-left font-bold">Status</th>
							<th className="px-4 py-3 text-left font-bold">Edit</th>
						</tr>
					</thead>
					<tbody>
						{assignedProjects.map((p, i) => (
							<tr key={i} className="border-b last:border-0 hover:bg-blue-50 transition-colors duration-200 cursor-pointer">
								<td className="px-4 py-3">{p.title}</td>
								<td className="px-4 py-3">{p.customer}</td>
								<td className="px-4 py-3 ">{p.vehicle}</td>
								<td className="px-4 py-3">{p.dueDate}</td>
								<td className="px-4 py-3">{p.time}</td>
								<td className="px-4 py-3">
									<span
										className={`inline-block rounded-full px-6 py-1 text-xs font-semibold border w-32 text-center ${
											statusStyles[p.status] ||
											"bg-gray-50 text-gray-800 border-gray-200"
										}`}
									>
										{p.status.replace("_", " ")}
									</span>
								</td>
								<td className="px-4 py-3">
									<button
										type="button"
										className="p-2 rounded-lg bg-white border border-blue-200 text-blue-900 hover:bg-blue-100 transition-colors duration-200"
										aria-label="Edit"
										onClick={() => handleEditClick(i)}
									>
										<Edit className="w-4 h-4" />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			{/* Modal */}
			{modalOpen && (
				<>
					{/* Overlay */}
					<div className="fixed inset-0 bg-transparent z-40" onClick={handleClose} />
					{/* Dialog */}
					<div className="fixed inset-0 flex items-center justify-center z-50">
						<div
							className="bg-white rounded-lg p-8 shadow-2xl w-[26rem] min-h-[20rem] relative"
							onClick={e => e.stopPropagation()}
						>
							<h2 className="text-xl font-bold mb-6">Update Logs</h2>
							<form onSubmit={handleSave} className="space-y-6">
								<div>
									<label className="block mb-2 font-medium text-base text-gray-700" htmlFor="start">Start time</label>
									<input
										id="start"
										name="start"
										type="text"
										value={form.start}
										onChange={handleChange}
										className="w-full border border-gray-300 rounded px-4 py-3 text-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
										autoComplete="off"
									/>
								</div>
								<div>
									<label className="block mb-2 font-medium text-base text-gray-700" htmlFor="end">End time</label>
									<input
										id="end"
										name="end"
										type="text"
										value={form.end}
										onChange={handleChange}
										className="w-full border border-gray-300 rounded px-4 py-3 text-base focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
										autoComplete="off"
									/>
								</div>
								<div>
									<label className="block mb-2 font-medium text-base text-gray-700" htmlFor="status">Status</label>
									<div className="relative">
										<select
											id="status"
											name="status"
											value={form.status}
											onChange={handleChange}
											className="w-full border border-gray-300 rounded px-4 py-3 pr-10 text-base text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
										>
											<option value="" className="text-gray-400">Select Status</option>
											{statusOptions.map(opt => (
												<option key={opt} value={opt} className="text-gray-700">{opt}</option>
											))}
										</select>
										<ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
									</div>
								</div>
								<div className="flex justify-end pt-4">
									<button
										type="submit"
										className="bg-primary hover:bg-secondary text-white rounded px-6 py-3 font-medium text-base transition-colors duration-200"
									>
										Save
									</button>
								</div>
							</form>
							<button
								type="button"
								className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-xl"
								onClick={handleClose}
								aria-label="Close"
							>
								×
							</button>
						</div>
					</div>
				</>
			)}
		</div>
	);
}

