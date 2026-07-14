import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatDate = (value) => {
    if (!value) return "—";
    const d = new Date(value);
    return isNaN(d) ? value : new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(d);
};

const formatStatus = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : "—";

const PAGE_SIZE = 8;

// Minimal, left-border status badges — no coloured backgrounds
const statusBadge = {
    present: "border border-emerald-400 text-emerald-700",
    late:    "border border-amber-400  text-amber-700",
    absent:  "border border-rose-400   text-rose-700",
    leave:   "border border-sky-400    text-sky-700",
};

const riskBadge = {
    Critical: "border border-rose-400 text-rose-700",
    Warning:  "border border-amber-400 text-amber-700",
    Good:     "border border-emerald-400 text-emerald-700",
};

// ─── Sub-components ──────────────────────────────────────────────────────────

const StatCard = ({ label, value, sub, accent }) => (
    <div className={`rounded-lg border-l-4 border border-slate-100 bg-white px-5 py-4 shadow-sm ${accent}`}>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">{label}</p>
        <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
        {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
    </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────

const Attendance = () => {
    const [summary, setSummary]         = useState(null);
    const [records, setRecords]         = useState([]);
    const [analytics, setAnalytics]     = useState([]);
    const [leaders, setLeaders]         = useState([]);
    const [concerns, setConcerns]       = useState([]);
    const [alerts, setAlerts]           = useState([]);

    const [search, setSearch]           = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage]               = useState(1);

    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [employeeHistory, setEmployeeHistory]   = useState([]);
    const [historyLoading, setHistoryLoading]     = useState(false);
    const [showModal, setShowModal]               = useState(false);

    // ── Fetch helpers ────────────────────────────────────────────────────────

    const load = useCallback(async () => {
        try {
            const [sumRes, recRes, anaRes] = await Promise.all([
                api.get("/manager/attendance-summary"),
                api.get("/manager/attendance"),
                api.get("/manager/attendance-analytics"),
            ]);
            setSummary(sumRes.data);
            setRecords(recRes.data);

            const data = anaRes.data;
            const sorted = [...data].sort((a, b) =>
                Number(b.attendanceRate ?? b.score ?? 0) - Number(a.attendanceRate ?? a.score ?? 0)
            );
            setLeaders(sorted.slice(0, 3));
            setConcerns([...sorted].reverse().slice(0, 3));
            setAnalytics(data);

            // build alerts
            const built = [];
            data.forEach((emp) => {
                const tags = [];
                if (Number(emp.consecutiveAbsences) >= 3) tags.push(`${emp.consecutiveAbsences} consecutive absences`);
                if (Number(emp.consecutiveLate)     >= 3) tags.push(`${emp.consecutiveLate} consecutive late records`);
                if (Number(emp.attendanceRate)       < 75) tags.push(`Attendance rate below 75% (${emp.attendanceRate}%)`);
                if (tags.length) built.push({ employee: emp.fullname, tags, priority: "High" });
            });
            setAlerts(built);
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    // ── Attendance Records filtering / pagination ────────────────────────────

    const filtered = records.filter((r) => {
        const matchName   = r.fullname?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = !statusFilter || r.status === statusFilter;
        return matchName && matchStatus;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleStatusFilter = (val) => { setStatusFilter(val); setPage(1); };

    // ── Employee detail modal ────────────────────────────────────────────────

    const openDetail = async (emp) => {
        setSelectedEmployee(emp);
        setShowModal(true);
        setHistoryLoading(true);
        try {
            const res = await api.get(`/manager/attendance/employee/${emp.employee_id}`);
            setEmployeeHistory(res.data);
        } catch { setEmployeeHistory([]); }
        finally { setHistoryLoading(false); }
    };

    // ─── Render ──────────────────────────────────────────────────────────────

    return (
        <DashboardLayout>

            {/* ── Header ──────────────────────────────────────────────── */}
            <div className="mb-8">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Manager Dashboard</p>
                <h1 className="text-3xl font-bold text-slate-900">Attendance</h1>
                <p className="mt-1 text-sm text-slate-500">Monitor team attendance, risks, and records.</p>
            </div>

            {/* ── Summary Cards ───────────────────────────────────────── */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Present"  value={summary?.presentCount  ?? 0} sub="On time"       accent="border-l-emerald-500" />
                <StatCard label="Late"     value={summary?.lateCount     ?? 0} sub="Needs follow-up" accent="border-l-amber-500"  />
                <StatCard label="Absent"   value={summary?.absentCount   ?? 0} sub="Missed records" accent="border-l-rose-500"   />
                <StatCard label="Leave"    value={summary?.leaveCount    ?? 0} sub="Approved leave" accent="border-l-sky-500"    />
            </div>

            {/* ── Leaderboard + Concerns ──────────────────────────────── */}
            <div className="mb-8 grid gap-6 lg:grid-cols-2">

                {/* Leaderboard */}
                <div className="rounded-lg border border-slate-100 bg-white p-6 shadow-sm">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">Attendance Leaderboard</p>
                    <p className="mb-5 text-sm text-slate-500">Highest attendance rate this period.</p>
                    <div className="space-y-4">
                        {leaders.map((emp, i) => (
                            <div key={emp.employee_id}>
                                <div className="mb-1.5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="w-5 text-right text-xs font-bold text-slate-300">{i + 1}</span>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">{emp.fullname}</p>
                                            <p className="text-xs text-slate-400">Score {emp.score}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-slate-700">{emp.attendanceRate}%</span>
                                </div>
                                <div className="ml-8 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                                    <div className="h-full rounded-full bg-slate-800 transition-all duration-500" style={{ width: `${emp.attendanceRate}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Concerns */}
                <div className="rounded-lg border border-slate-100 bg-white p-6 shadow-sm">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">Attendance Concerns</p>
                    <p className="mb-5 text-sm text-slate-500">Lowest attendance rate — needs attention.</p>
                    <div className="space-y-4">
                        {concerns.map((emp) => (
                            <div key={emp.employee_id}>
                                <div className="mb-1.5 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">{emp.fullname}</p>
                                        <p className="text-xs text-rose-500">{emp.risk} risk</p>
                                    </div>
                                    <span className="text-sm font-bold text-rose-600">{emp.attendanceRate}%</span>
                                </div>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                                    <div className="h-full rounded-full bg-rose-400 transition-all duration-500" style={{ width: `${emp.attendanceRate}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Alerts ──────────────────────────────────────────────── */}
            {alerts.length > 0 && (
                <div className="mb-8 rounded-lg border border-slate-100 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Attendance Alerts</p>
                            <p className="mt-0.5 text-sm text-slate-500">One row per employee. Click to view details.</p>
                        </div>
                        <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-600 ring-1 ring-rose-200">
                            {alerts.length}
                        </span>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {alerts.map((alert, i) => (
                            <div key={i} className="flex items-start justify-between gap-4 px-6 py-4">
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">{alert.employee}</p>
                                    <div className="mt-1.5 flex flex-wrap gap-2">
                                        {alert.tags.map((tag, j) => (
                                            <span key={j} className="rounded border border-rose-200 bg-rose-50 px-2 py-0.5 text-xs text-rose-700">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <span className="mt-0.5 shrink-0 rounded border border-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
                                    {alert.priority} priority
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Records Table ────────────────────────────────────────── */}
            <div className="mb-8 rounded-lg border border-slate-100 bg-white shadow-sm">
                {/* toolbar */}
                <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Attendance Records</p>
                        <p className="mt-0.5 text-sm text-slate-500">Showing {(page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE, filtered.length)} of {filtered.length}</p>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Search employee…"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="rounded border border-slate-200 px-3 py-1.5 text-sm focus:border-slate-400 focus:outline-none"
                        />
                        <select
                            value={statusFilter}
                            onChange={(e) => handleStatusFilter(e.target.value)}
                            className="rounded border border-slate-200 px-3 py-1.5 text-sm focus:border-slate-400 focus:outline-none"
                        >
                            <option value="">All statuses</option>
                            <option value="present">Present</option>
                            <option value="late">Late</option>
                            <option value="absent">Absent</option>
                            <option value="leave">Leave</option>
                        </select>
                    </div>
                </div>

                {/* table */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[560px] text-sm">
                        <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            <tr>
                                <th className="px-6 py-3 text-left">Employee</th>
                                <th className="px-6 py-3 text-left">Date</th>
                                <th className="px-6 py-3 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {paged.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-10 text-center text-slate-400">No records found.</td>
                                </tr>
                            ) : paged.map((r) => (
                                <tr key={r.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-3 font-medium text-slate-800">{r.fullname}</td>
                                    <td className="px-6 py-3 text-slate-500">{formatDate(r.attendance_date)}</td>
                                    <td className="px-6 py-3">
                                        <span className={`inline-flex rounded px-2.5 py-0.5 text-xs font-semibold ${statusBadge[r.status] || "border border-slate-200 text-slate-500"}`}>
                                            {formatStatus(r.status)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* pagination */}
                <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3">
                    <p className="text-xs text-slate-400">Page {page} of {totalPages}</p>
                    <div className="flex gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="rounded border border-slate-200 px-3 py-1 text-sm text-slate-600 disabled:opacity-40 hover:bg-slate-50"
                        >
                            Previous
                        </button>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className="rounded border border-slate-200 px-3 py-1 text-sm text-slate-600 disabled:opacity-40 hover:bg-slate-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Analytics Table ──────────────────────────────────────── */}
            <div className="rounded-lg border border-slate-100 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Attendance Analytics</p>
                    <p className="mt-0.5 text-sm text-slate-500">Attendance health per employee. Click View Details to inspect.</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[680px] text-sm">
                        <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            <tr>
                                <th className="px-6 py-3 text-left">Employee</th>
                                <th className="px-6 py-3 text-left">Rate</th>
                                <th className="px-6 py-3 text-left">Score</th>
                                <th className="px-6 py-3 text-left">Risk</th>
                                <th className="px-6 py-3 text-left">Breakdown</th>
                                <th className="px-6 py-3 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {analytics.map((emp) => (
                                <tr key={emp.employee_id} className="hover:bg-slate-50">
                                    <td className="px-6 py-3 font-medium text-slate-800">{emp.fullname}</td>
                                    <td className="px-6 py-3 text-slate-600">{emp.attendanceRate}%</td>
                                    <td className="px-6 py-3 text-slate-600">{emp.score}</td>
                                    <td className="px-6 py-3">
                                        <span className={`inline-flex rounded px-2.5 py-0.5 text-xs font-semibold ${riskBadge[emp.risk] || "border border-slate-200 text-slate-500"}`}>
                                            {emp.risk}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-3 text-xs text-slate-500">
                                            <span>P <strong className="text-slate-800">{emp.presentCount}</strong></span>
                                            <span>L <strong className="text-slate-800">{emp.lateCount}</strong></span>
                                            <span>A <strong className="text-slate-800">{emp.absentCount}</strong></span>
                                            <span>LV <strong className="text-slate-800">{emp.leaveCount}</strong></span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <button
                                            onClick={() => openDetail(emp)}
                                            className="rounded border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Employee Detail Modal ────────────────────────────────── */}
            {showModal && selectedEmployee && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">

                        {/* modal header */}
                        <div className="border-b border-slate-100 bg-slate-900 px-6 py-5 text-white">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Attendance Detail</p>
                                    <h2 className="mt-1 text-lg font-bold">{selectedEmployee.fullname}</h2>
                                    <div className="mt-2 flex gap-3 text-xs text-slate-400">
                                        <span>Rate: <strong className="text-white">{selectedEmployee.attendanceRate}%</strong></span>
                                        <span>Score: <strong className="text-white">{selectedEmployee.score}</strong></span>
                                        <span>Risk: <strong className="text-white">{selectedEmployee.risk}</strong></span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="rounded bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/20"
                                >
                                    Close
                                </button>
                            </div>
                        </div>

                        {/* breakdown */}
                        <div className="grid grid-cols-4 divide-x divide-slate-100 border-b border-slate-100">
                            {[
                                { label: "Present", value: selectedEmployee.presentCount, color: "text-emerald-600" },
                                { label: "Late",    value: selectedEmployee.lateCount,    color: "text-amber-600"  },
                                { label: "Absent",  value: selectedEmployee.absentCount,  color: "text-rose-600"   },
                                { label: "Leave",   value: selectedEmployee.leaveCount,   color: "text-sky-600"    },
                            ].map((item) => (
                                <div key={item.label} className="py-4 text-center">
                                    <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                                    <p className="mt-0.5 text-xs text-slate-400">{item.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* history */}
                        <div className="max-h-64 overflow-y-auto">
                            {historyLoading ? (
                                <p className="py-8 text-center text-sm text-slate-400">Loading history…</p>
                            ) : employeeHistory.length === 0 ? (
                                <p className="py-8 text-center text-sm text-slate-400">No records found.</p>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                        <tr>
                                            <th className="px-6 py-2 text-left">Date</th>
                                            <th className="px-6 py-2 text-left">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {employeeHistory.map((h) => (
                                            <tr key={h.id} className="hover:bg-slate-50">
                                                <td className="px-6 py-2.5 text-slate-600">{formatDate(h.attendance_date)}</td>
                                                <td className="px-6 py-2.5">
                                                    <span className={`inline-flex rounded px-2.5 py-0.5 text-xs font-semibold ${statusBadge[h.status] || "border border-slate-200 text-slate-500"}`}>
                                                        {formatStatus(h.status)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                    </div>
                </div>
            )}

        </DashboardLayout>
    );
};

export default Attendance;