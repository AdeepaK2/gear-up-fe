"use client";
import React from "react";
import { Edit } from "lucide-react";

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
];

const statusOptions = [
	"New",
	"In Progress",
	"On Hold",
	"Completed",
	"Cancelled",
];

const statusStyles: Record<string, string> = {
	New: "bg-gray-100 text-gray-800",
	In_Progress: "bg-gray-200 text-gray-800",
	"On Hold": "bg-gray-100 text-gray-800",
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
		<div className="min-h-screen px-8 py-8">
			<h1 className="text-3xl font-bold mb-8">Assigned Projects</h1>
			<div className="bg-white rounded-xl border overflow-x-auto">
				<table className="min-w-full text-sm">
					<thead>
						<tr className="border-b">
							<th className="px-4 py-3 text-left font-medium">Title</th>
							<th className="px-4 py-3 text-left font-medium">Customer</th>
							<th className="px-4 py-3 text-left font-medium">Vehicle</th>
							<th className="px-4 py-3 text-left font-medium">Due Date</th>
							<th className="px-4 py-3 text-left font-medium">
								Estimated Time
							</th>
							<th className="px-4 py-3 text-left font-medium">Status</th>
							<th className="px-4 py-3 text-left font-medium">Edit</th>
						</tr>
					</thead>
					<tbody>
						{assignedProjects.map((p, i) => (
							<tr key={i} className="border-b last:border-0">
								<td className="px-4 py-3">{p.title}</td>
								<td className="px-4 py-3">{p.customer}</td>
								<td className="px-4 py-3 text-gray-500">{p.vehicle}</td>
								<td className="px-4 py-3">{p.dueDate}</td>
								<td className="px-4 py-3">{p.time}</td>
								<td className="px-4 py-3">
									<span
										className={`inline-block rounded-full px-6 py-1 text-xs font-semibold ${
											statusStyles[p.status] ||
											"bg-gray-100 text-gray-800"
										}`}
									>
										{p.status.replace("_", " ")}
									</span>
								</td>
								<td className="px-4 py-3">
									<button
										type="button"
										className="p-1 rounded hover:bg-gray-100"
										aria-label="Edit"
										onClick={() => handleEditClick(i)}
									>
										<Edit className="w-4 h-4 text-gray-500" />
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
							className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto mx-4 relative"
							onClick={e => e.stopPropagation()}
						>
							<h2 className="text-3xl font-bold mb-8">Update Logs</h2>
							<form onSubmit={handleSave}>
								<div className="mb-6">
									<label className="block mb-2 font-medium text-lg" htmlFor="start">Start time</label>
									<input
										id="start"
										name="start"
										type="text"
										value={form.start}
										onChange={handleChange}
										className="w-full bg-gray-200 rounded px-4 py-3 text-lg"
										autoComplete="off"
									/>
								</div>
								<div className="mb-6">
									<label className="block mb-2 font-medium text-lg" htmlFor="end">End time</label>
									<input
										id="end"
										name="end"
										type="text"
										value={form.end}
										onChange={handleChange}
										className="w-full bg-gray-200 rounded px-4 py-3 text-lg"
										autoComplete="off"
									/>
								</div>
								<div className="mb-8">
									<label className="block mb-2 font-medium text-lg" htmlFor="status">Status</label>
									<select
										id="status"
										name="status"
										value={form.status}
										onChange={handleChange}
										className="w-full bg-gray-200 rounded px-4 py-3 text-lg"
									>
										<option value="">Select Status</option>
										{statusOptions.map(opt => (
											<option key={opt} value={opt}>{opt}</option>
										))}
									</select>
								</div>
								<div className="flex justify-end">
									<button
										type="submit"
										className="bg-gray-300 rounded px-6 py-2 font-medium text-lg"
									>
										Save
									</button>
								</div>
							</form>
							<button
								type="button"
								className="absolute top-5 right-6 text-gray-400 hover:text-gray-600 text-2xl"
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

