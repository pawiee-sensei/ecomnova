import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

const formatDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("en-US", {
        month: "short", day: "numeric", year: "numeric",
    }).format(date);
};

const statusStyles = {
    present: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    late: "bg-amber-50 text-amber-700 ring-amber-200",
    absent: "bg-rose-50 text-rose-700 ring-rose-200",
    leave: "bg-sky-50 text-sky-700 ring-sky-200",
};

const PAGE_SIZE = 10;

const MyAttendance = () => {
    const [summary, setSummary] = useState(null);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);
    

    const fetchAttendance = async () => {
        try {
            setLoading(true);
            const response = await api.get("/agent/attendance");
            setSummary(response.data.summary);
            setRecords(response.data.records);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    useEffect(() => {
        setPage(1);
    }, [statusFilter]);

    const filtered = useMemo(() => {
        if (statusFilter === "all") return records;
        return records.filter((r) => r.status === statusFilter);
    }, [records, statusFilter]);

    const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const total = Number(summary?.presentCount || 0) +
        Number(summary?.lateCount || 0) +
        Number(summary?.absentCount || 0) +
        Number(summary?.leaveCount || 0);

    const attendanceRate = total === 0 ? 0 : Math.round(
        (Number(summary?.presentCount || 0) / total) * 100
    );

    return (
        <DashboardLayout>

            {/* Header */}
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
                        Agent Portal
                    </p>
                    <h1 className="text-3xl font-bold text-slate-800">
                        My Attendance
                    </h1>
                    <p className="mt-1 text-slate-500">
                        View your attendance records and history.
                    </p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Attendance Rate
                    </p>
                    <p className="mt-2 text-4xl font-bold text-slate-800">
                        {attendanceRate}%
                    </p>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                            className="h-2 rounded-full bg-slate-900 transition-all duration-700"
                            style={{ width: `${attendanceRate}%` }}
                        />
                    </div>
                </div>

                {[
                    { label: "Present", value: summary?.presentCount || 0, accent: "border-l-emerald-500" },
                    { label: "Late", value: summary?.lateCount || 0, accent: "border-l-amber-500" },
                    { label: "Absent", value: summary?.absentCount || 0, accent: "border-l-rose-500" },
                    { label: "Leave", value: summary?.leaveCount || 0, accent: "border-l-slate-400" },
                ].map((card) => (
                    <div key={card.label} className={`rounded-xl border border-slate-100 border-l-4 bg-white p-5 shadow-sm ${card.accent}`}>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{card.label}</p>
                        <p className="mt-2 text-4xl font-bold text-slate-800">{card.value}</p>
                        <p className="mt-1 text-xs text-slate-400">days</p>
                    </div>
                ))}
            </div>

            {/* Filter Tabs */}
            <div className="mb-4 flex flex-wrap gap-2">
                {["all", "present", "late", "absent", "leave"].map((s) => (
                    <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-all ${
                            statusFilter === s
                                ? "bg-slate-900 text-white"
                                : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                        }`}
                    >
                        {s === "all" ? "All Records" : s}
                    </button>
                ))}
            </div>

            {/* Records Table */}
            <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
                {loading ? (
                    <div className="flex h-40 items-center justify-center">
                        <p className="text-sm text-slate-400">Loading attendance...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex h-40 flex-col items-center justify-center text-center">
                        <p className="text-sm font-medium text-slate-600">No records found</p>
                        <p className="mt-1 text-xs text-slate-400">
                            No {statusFilter === "all" ? "" : statusFilter} attendance records yet.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[500px]">
<thead className="bg-slate-50 text-xs uppercase text-slate-500">
    <tr>
        <th className="px-5 py-3 text-left font-semibold">Date</th>
        <th className="px-5 py-3 text-left font-semibold">Day</th>
        <th className="px-5 py-3 text-left font-semibold">Clock In</th>
        <th className="px-5 py-3 text-left font-semibold">Clock Out</th>
        <th className="px-5 py-3 text-left font-semibold">Status</th>
    </tr>
</thead>
                                <tbody className="divide-y divide-slate-100">
{paginated.map((record) => (
    <tr key={record.id} className="hover:bg-slate-50">
        <td className="px-5 py-4 text-sm font-medium text-slate-800">
            {formatDate(record.attendance_date)}
        </td>
        <td className="px-5 py-4 text-sm text-slate-500">
            {new Date(record.attendance_date).toLocaleDateString("en-US", { weekday: "long" })}
        </td>
        <td className="px-5 py-4 text-sm text-slate-600">
            {record.time_in
                ? new Date(record.time_in).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
                : <span className="text-slate-300">—</span>
            }
        </td>
        <td className="px-5 py-4 text-sm text-slate-600">
            {record.time_out
                ? new Date(record.time_out).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
                : <span className="text-slate-300">—</span>
            }
        </td>
        <td className="px-5 py-4">
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ${statusStyles[record.status] || "bg-slate-100 text-slate-500 ring-slate-200"}`}>
                {record.status}
            </span>
        </td>
    </tr>
))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
                            <p className="text-sm text-slate-500">
                                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage((p) => p - 1)}
                                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    disabled={page === pageCount}
                                    onClick={() => setPage((p) => p + 1)}
                                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

        </DashboardLayout>
    );
};

export default MyAttendance;