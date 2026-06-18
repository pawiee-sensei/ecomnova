import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

const SHIFTS = ["Day Shift", "Night Shift", "Mid Shift"];

const shiftStyles = {
    "Day Shift": {
        bg: "bg-amber-50",
        text: "text-amber-700",
        ring: "ring-amber-200",
        dot: "bg-amber-400",
    },
    "Night Shift": {
        bg: "bg-blue-50",
        text: "text-blue-700",
        ring: "ring-blue-200",
        dot: "bg-blue-400",
    },
    "Mid Shift": {
        bg: "bg-violet-50",
        text: "text-violet-700",
        ring: "ring-violet-200",
        dot: "bg-violet-400",
    },
};

const ShiftManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editShift, setEditShift] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const [shiftFilter, setShiftFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchTeam = async () => {
        try {
            setLoading(true);
            const response = await api.get("/manager/team");
            setEmployees(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeam();
    }, []);

    const handleUpdateShift = async (id) => {
        if (!editShift) return;
        try {
            setActionLoading(true);
            await api.put(`/manager/team/${id}/shift`, { shift: editShift });
            setEditingId(null);
            setEditShift("");
            fetchTeam();
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const filtered = employees.filter((e) => {
        const matchesSearch =
            e.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.job_title?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesShift =
            shiftFilter === "all" ||
            e.shift === shiftFilter ||
            (shiftFilter === "unassigned" && !e.shift);
        return matchesSearch && matchesShift;
    });

    const dayShift = employees.filter((e) => e.shift === "Day Shift");
    const nightShift = employees.filter((e) => e.shift === "Night Shift");
    const midShift = employees.filter((e) => e.shift === "Mid Shift");
    const unassigned = employees.filter((e) => !e.shift);

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
                        Manager Dashboard
                    </p>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Shift Management
                    </h1>
                    <p className="mt-1 text-slate-500">
                        View and reassign shifts for your team members.
                    </p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="mb-8 grid gap-4 sm:grid-cols-4">
                <div className="rounded-xl border border-amber-100 bg-amber-50 p-5">
                    <div className="mb-2 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-amber-400" />
                        <p className="text-xs font-semibold uppercase tracking-wide text-amber-500">
                            Day Shift
                        </p>
                    </div>
                    <p className="text-4xl font-bold text-amber-600">
                        {dayShift.length}
                    </p>
                    <p className="mt-1 text-xs text-amber-400">employees</p>
                </div>

                <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
                    <div className="mb-2 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-blue-400" />
                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">
                            Night Shift
                        </p>
                    </div>
                    <p className="text-4xl font-bold text-blue-600">
                        {nightShift.length}
                    </p>
                    <p className="mt-1 text-xs text-blue-400">employees</p>
                </div>

                <div className="rounded-xl border border-violet-100 bg-violet-50 p-5">
                    <div className="mb-2 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-violet-400" />
                        <p className="text-xs font-semibold uppercase tracking-wide text-violet-500">
                            Mid Shift
                        </p>
                    </div>
                    <p className="text-4xl font-bold text-violet-600">
                        {midShift.length}
                    </p>
                    <p className="mt-1 text-xs text-violet-400">employees</p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
                    <div className="mb-2 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-slate-400" />
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Unassigned
                        </p>
                    </div>
                    <p className="text-4xl font-bold text-slate-600">
                        {unassigned.length}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">employees</p>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
                <input
                    type="text"
                    placeholder="Search employee..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 rounded-lg border border-slate-200 p-2.5 text-sm focus:border-slate-400 focus:outline-none"
                />
                <div className="flex gap-2">
                    {["all", "Day Shift", "Night Shift", "Mid Shift", "unassigned"].map((s) => (
                        <button
                            key={s}
                            onClick={() => setShiftFilter(s)}
                            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                                shiftFilter === s
                                    ? "bg-slate-900 text-white"
                                    : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                            }`}
                        >
                            {s === "all" ? "All" : s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Team Table */}
            <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
                {loading ? (
                    <div className="flex h-40 items-center justify-center">
                        <p className="text-sm text-slate-400">Loading team...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex h-40 flex-col items-center justify-center text-center">
                        <p className="text-sm font-medium text-slate-600">No employees found</p>
                        <p className="mt-1 text-xs text-slate-400">
                            Try adjusting your search or filter.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px]">
                            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                <tr>
                                    <th className="px-5 py-3 text-left font-semibold">Employee</th>
                                    <th className="px-5 py-3 text-left font-semibold">Job Title</th>
                                    <th className="px-5 py-3 text-left font-semibold">Current Shift</th>
                                    <th className="px-5 py-3 text-left font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((employee) => {
                                    const style = shiftStyles[employee.shift] || null;
                                    return (
                                        <tr key={employee.id} className="hover:bg-slate-50">
                                            <td className="px-5 py-4">
                                                <p className="font-semibold text-slate-800">
                                                    {employee.fullname}
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    {employee.employee_id}
                                                </p>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-slate-600">
                                                {employee.job_title || "—"}
                                            </td>
                                            <td className="px-5 py-4">
                                                {employee.shift ? (
                                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${style?.bg} ${style?.text} ${style?.ring}`}>
                                                        <span className={`h-1.5 w-1.5 rounded-full ${style?.dot}`} />
                                                        {employee.shift}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-slate-400">
                                                        Not assigned
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4">
                                                {editingId === employee.id ? (
                                                    <div className="flex items-center gap-2">
                                                        <select
                                                            value={editShift}
                                                            onChange={(e) => setEditShift(e.target.value)}
                                                            className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm focus:outline-none"
                                                        >
                                                            <option value="">Select shift</option>
                                                            {SHIFTS.map((s) => (
                                                                <option key={s} value={s}>{s}</option>
                                                            ))}
                                                        </select>
                                                        <button
                                                            onClick={() => handleUpdateShift(employee.id)}
                                                            disabled={actionLoading || !editShift}
                                                            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                                                        >
                                                            {actionLoading ? "..." : "Save"}
                                                        </button>
                                                        <button
                                                            onClick={() => { setEditingId(null); setEditShift(""); }}
                                                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            setEditingId(employee.id);
                                                            setEditShift(employee.shift || "");
                                                        }}
                                                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                                                    >
                                                        Reassign
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ShiftManagement;