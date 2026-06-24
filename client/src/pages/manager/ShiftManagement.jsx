import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

const SHIFTS = ["Day Shift", "Night Shift", "Mid Shift"];

const shiftStyles = {
    "Day Shift": { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200", dot: "bg-amber-400", accent: "border-l-amber-500" },
    "Night Shift": { bg: "bg-blue-50", text: "text-blue-700", ring: "ring-blue-200", dot: "bg-blue-400", accent: "border-l-blue-500" },
    "Mid Shift": { bg: "bg-violet-50", text: "text-violet-700", ring: "ring-violet-200", dot: "bg-violet-400", accent: "border-l-violet-500" },
};

const formatTime = (time) => {
    if (!time) return "—";
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
};

const ShiftManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [schedulesLoading, setSchedulesLoading] = useState(true);

    const [editingShiftId, setEditingShiftId] = useState(null);
    const [editShift, setEditShift] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const [shiftFilter, setShiftFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const [editingScheduleId, setEditingScheduleId] = useState(null);
    const [editScheduleData, setEditScheduleData] = useState({});
    const [scheduleSaving, setScheduleSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

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

    const fetchSchedules = async () => {
        try {
            setSchedulesLoading(true);
            const response = await api.get("/manager/shift-schedules");
            setSchedules(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setSchedulesLoading(false);
        }
    };

    useEffect(() => {
        fetchTeam();
        fetchSchedules();
    }, []);

    const handleUpdateShift = async (id) => {
        if (!editShift) return;
        try {
            setActionLoading(true);
            await api.put(`/manager/team/${id}/shift`, { shift: editShift });
            setEditingShiftId(null);
            setEditShift("");
            setEmployees((prev) =>
                prev.map((e) => e.id === id ? { ...e, shift: editShift } : e)
            );
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleSaveSchedule = async (id) => {
        try {
            setScheduleSaving(true);
            await api.put(`/manager/shift-schedules/${id}`, {
                startTime: editScheduleData.startTime,
                endTime: editScheduleData.endTime,
                gracePeriod: Number(editScheduleData.gracePeriod),
            });
            setEditingScheduleId(null);
            setSuccessMessage("Shift schedule updated!");
            setTimeout(() => setSuccessMessage(""), 3000);
            fetchSchedules();
        } catch (error) {
            console.error(error);
        } finally {
            setScheduleSaving(false);
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
                        Configure shift schedules and manage team assignments.
                    </p>
                </div>
            </div>

            {successMessage && (
                <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    ✓ {successMessage}
                </div>
            )}

            {/* Shift Schedules Section */}
            <div className="mb-8">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold text-slate-700">Shift Schedules</h2>
                        <p className="text-xs text-slate-400">
                            Configure start time, end time, and grace period per shift.
                        </p>
                    </div>
                </div>

                <div className="mb-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                    <p className="text-xs text-blue-700">
                        <span className="font-semibold">Grace Period</span> — agents who clock in within this many minutes after shift start are marked <span className="font-semibold">Present</span>. After that, they are marked <span className="font-semibold">Late</span>.
                    </p>
                </div>

                {schedulesLoading ? (
                    <div className="flex h-24 items-center justify-center">
                        <p className="text-sm text-slate-400">Loading schedules...</p>
                    </div>
                ) : (
                    <div className="grid gap-4 lg:grid-cols-3">
                        {schedules.map((schedule) => {
                            const style = shiftStyles[schedule.shift_name];
                            return (
                                <div
                                    key={schedule.id}
                                    className={`rounded-xl border border-slate-100 border-l-4 bg-white p-5 shadow-sm ${style?.accent || "border-l-slate-300"}`}
                                >
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="font-semibold text-slate-800">{schedule.shift_name}</h3>
                                        {editingScheduleId !== schedule.id && (
                                            <button
                                                onClick={() => {
                                                    setEditingScheduleId(schedule.id);
                                                    setEditScheduleData({
                                                        startTime: schedule.start_time,
                                                        endTime: schedule.end_time,
                                                        gracePeriod: schedule.grace_period_minutes,
                                                    });
                                                }}
                                                className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                                            >
                                                Edit
                                            </button>
                                        )}
                                    </div>

                                    {editingScheduleId === schedule.id ? (
                                        <div className="space-y-3">
                                            <div>
                                                <label className="mb-1 block text-xs font-semibold text-slate-400">Start Time</label>
                                                <input
                                                    type="time"
                                                    value={editScheduleData.startTime}
                                                    onChange={(e) => setEditScheduleData({ ...editScheduleData, startTime: e.target.value })}
                                                    className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:border-slate-400 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-xs font-semibold text-slate-400">End Time</label>
                                                <input
                                                    type="time"
                                                    value={editScheduleData.endTime}
                                                    onChange={(e) => setEditScheduleData({ ...editScheduleData, endTime: e.target.value })}
                                                    className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:border-slate-400 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-xs font-semibold text-slate-400">Grace Period (minutes)</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="60"
                                                    value={editScheduleData.gracePeriod}
                                                    onChange={(e) => setEditScheduleData({ ...editScheduleData, gracePeriod: e.target.value })}
                                                    className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:border-slate-400 focus:outline-none"
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleSaveSchedule(schedule.id)}
                                                    disabled={scheduleSaving}
                                                    className="flex-1 rounded-lg bg-slate-900 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
                                                >
                                                    {scheduleSaving ? "Saving..." : "Save"}
                                                </button>
                                                <button
                                                    onClick={() => setEditingScheduleId(null)}
                                                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-slate-100 rounded-xl border border-slate-100">
                                            <div className="flex items-center justify-between px-4 py-3">
                                                <span className="text-sm text-slate-500">Start Time</span>
                                                <span className="text-sm font-semibold text-slate-800">{formatTime(schedule.start_time)}</span>
                                            </div>
                                            <div className="flex items-center justify-between px-4 py-3">
                                                <span className="text-sm text-slate-500">End Time</span>
                                                <span className="text-sm font-semibold text-slate-800">{formatTime(schedule.end_time)}</span>
                                            </div>
                                            <div className="flex items-center justify-between px-4 py-3">
                                                <span className="text-sm text-slate-500">Grace Period</span>
                                                <span className="text-sm font-semibold text-slate-800">{schedule.grace_period_minutes} mins</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Divider */}
            <div className="mb-8 border-t border-slate-100" />

            {/* Team Assignment Section */}
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="font-semibold text-slate-700">Team Shift Assignment</h2>
                    <p className="text-xs text-slate-400">Reassign shifts for your team members.</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="mb-6 grid gap-4 sm:grid-cols-4">
                {[
                    { label: "Day Shift", count: dayShift.length, accent: "border-l-amber-500", text: "text-amber-600" },
                    { label: "Night Shift", count: nightShift.length, accent: "border-l-blue-500", text: "text-blue-600" },
                    { label: "Mid Shift", count: midShift.length, accent: "border-l-violet-500", text: "text-violet-600" },
                    { label: "Unassigned", count: unassigned.length, accent: "border-l-slate-300", text: "text-slate-600" },
                ].map((card) => (
                    <div key={card.label} className={`rounded-xl border border-slate-100 border-l-4 bg-white p-4 shadow-sm ${card.accent}`}>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{card.label}</p>
                        <p className={`mt-1 text-3xl font-bold ${card.text}`}>{card.count}</p>
                        <p className="text-xs text-slate-400">employees</p>
                    </div>
                ))}
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
                <div className="flex flex-wrap gap-2">
                    {["all", "Day Shift", "Night Shift", "Mid Shift", "unassigned"].map((s) => (
                        <button
                            key={s}
                            onClick={() => setShiftFilter(s)}
                            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                                shiftFilter === s
                                    ? "bg-slate-900 text-white"
                                    : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
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
                        <p className="mt-1 text-xs text-slate-400">Try adjusting your search or filter.</p>
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
                                                <p className="font-semibold text-slate-800">{employee.fullname}</p>
                                                <p className="text-xs text-slate-400">{employee.employee_id}</p>
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
                                                    <span className="text-xs text-slate-400">Not assigned</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4">
                                                {editingShiftId === employee.id ? (
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
                                                            onClick={() => { setEditingShiftId(null); setEditShift(""); }}
                                                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            setEditingShiftId(employee.id);
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