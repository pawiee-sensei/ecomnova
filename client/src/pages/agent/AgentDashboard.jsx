import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const formatDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("en-US", {
        month: "short", day: "numeric", year: "numeric",
    }).format(date);
};

const formatLabel = (value) => {
    if (!value) return "—";
    return value.replaceAll("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

const statusStyles = {
    present: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    late: "bg-amber-50 text-amber-700 ring-amber-200",
    absent: "bg-rose-50 text-rose-700 ring-rose-200",
    leave: "bg-sky-50 text-sky-700 ring-sky-200",
};

const announcementStyles = {
    upcoming: "bg-amber-50 text-amber-700 ring-amber-200",
    active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    implemented: "bg-blue-50 text-blue-700 ring-blue-200",
};

const AgentDashboard = () => {
    const navigate = useNavigate();
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            const response = await api.get("/agent/dashboard");
            setDashboard(response.data);
        } catch (error) {
            console.error("Failed to load dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex h-64 items-center justify-center">
                    <p className="text-sm text-slate-400">Loading dashboard...</p>
                </div>
            </DashboardLayout>
        );
    }

    const { profile, attendance, leave, announcements, recentAttendance } = dashboard || {};

    const quickLinks = [
        { label: "Attendance", path: "/agent/attendance", icon: "📋", badge: 0 },
        { label: "Leave", path: "/agent/leave", icon: "🗓️", badge: Number(leave?.pendingCount || 0) },
        { label: "Tickets", path: "/agent/tickets", icon: "🎫", badge: 0 },
        { label: "Performance", path: "/agent/performance", icon: "📊", badge: 0 },
    ];

    return (
        <DashboardLayout>

            {/* Header */}
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
                        Agent Portal
                    </p>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Welcome back, {profile?.fullname?.split(" ")[0] || "Agent"} 👋
                    </h1>
                    <p className="mt-1 text-slate-500">
                        Here's your overview for today.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {profile?.team_name && (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                                {profile.team_name}
                            </span>
                        )}
                        {profile?.department_name && (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                                {profile.department_name}
                            </span>
                        )}
                        {profile?.shift && (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                                {profile.shift}
                            </span>
                        )}
                    </div>
                </div>

                {/* Avatar */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xl font-bold text-white">
                    {profile?.fullname
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase() || "AG"}
                </div>
            </div>

            {/* Attendance Summary Cards */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "Present", value: attendance?.presentCount || 0, accent: "border-l-emerald-500" },
                    { label: "Late", value: attendance?.lateCount || 0, accent: "border-l-amber-500" },
                    { label: "Absent", value: attendance?.absentCount || 0, accent: "border-l-rose-500" },
                    { label: "Leave", value: attendance?.leaveCount || 0, accent: "border-l-slate-400" },
                ].map((card) => (
                    <div key={card.label} className={`rounded-xl border border-slate-100 border-l-4 bg-white p-5 shadow-sm ${card.accent}`}>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{card.label}</p>
                        <p className="mt-2 text-4xl font-bold text-slate-800">{card.value}</p>
                        <p className="mt-1 text-xs text-slate-400">Total days</p>
                    </div>
                ))}
            </div>

            {/* Quick Links */}
            <div className="mb-8">
                <h2 className="mb-4 font-semibold text-slate-700">Quick Access</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                {quickLinks.map((link) => (
                    <button
                        key={link.path}
                        onClick={() => navigate(link.path)}
                        className="relative flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
                    >
                        {link.badge > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">
                                {link.badge}
                            </span>
                        )}
                        <span className="text-3xl">{link.icon}</span>
                        <span className="text-sm font-semibold text-slate-700">{link.label}</span>
                    </button>
                ))}
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">

                {/* Profile Card */}
                <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 font-semibold text-slate-700">My Profile</h2>

                    <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4 mb-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-900 text-base font-bold text-white">
                            {profile?.fullname?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "AG"}
                        </div>
                        <div>
                            <p className="font-bold text-slate-800">{profile?.fullname}</p>
                            <p className="text-sm text-slate-500">{profile?.job_title || "No job title"}</p>
                            <p className="text-xs text-slate-400">{profile?.employee_id}</p>
                        </div>
                    </div>

                    <div className="divide-y divide-slate-100 rounded-xl border border-slate-100">
                        {[
                            { label: "Email", value: profile?.email },
                            { label: "Employment Type", value: formatLabel(profile?.employment_type) },
                            { label: "Hire Date", value: formatDate(profile?.hire_date) },
                            { label: "Work Location", value: profile?.work_location || "—" },
                            { label: "Shift", value: profile?.shift || "—" },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center justify-between px-4 py-3">
                                <span className="text-sm text-slate-500">{item.label}</span>
                                <span className="text-sm font-medium text-slate-800">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">

                    {/* Leave Summary */}
                    <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="font-semibold text-slate-700">Leave Summary</h2>
                            <button
                                onClick={() => navigate("/agent/leave")}
                                className="text-xs font-semibold text-violet-600 hover:underline"
                            >
                                View all →
                            </button>
                        </div>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: "Pending", value: leave?.pendingCount || 0, accent: "border-l-amber-500" },
                            { label: "Approved", value: leave?.approvedCount || 0, accent: "border-l-emerald-500" },
                            { label: "Rejected", value: leave?.rejectedCount || 0, accent: "border-l-rose-500" },
                        ].map((item) => (
                            <div key={item.label} className={`rounded-lg border border-slate-100 border-l-4 bg-slate-50 p-3 text-center ${item.accent}`}>
                                <p className="text-xs text-slate-400">{item.label}</p>
                                <p className="mt-1 text-2xl font-bold text-slate-800">{item.value}</p>
                            </div>
                        ))}
                    </div>
                    </div>

                    {/* Recent Attendance */}
                    <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="font-semibold text-slate-700">Recent Attendance</h2>
                            <button
                                onClick={() => navigate("/agent/attendance")}
                                className="text-xs font-semibold text-violet-600 hover:underline"
                            >
                                View all →
                            </button>
                        </div>
                        {recentAttendance?.length === 0 ? (
                            <p className="text-sm text-slate-400">No attendance records yet.</p>
                        ) : (
                            <div className="space-y-2">
                                {recentAttendance?.map((record) => (
                                    <div
                                        key={record.id}
                                        className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2.5"
                                    >
                                        <span className="text-sm text-slate-600">
                                            {formatDate(record.attendance_date)}
                                        </span>
                                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ${statusStyles[record.status] || "bg-slate-100 text-slate-500 ring-slate-200"}`}>
                                            {record.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Announcements */}
            {announcements?.length > 0 && (
                <div className="mt-6 rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 font-semibold text-slate-700">Announcements</h2>
                    <div className="space-y-3">
                        {announcements.map((a) => (
                            <div key={a.id} className="rounded-xl border border-slate-100 p-4 hover:bg-slate-50">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-sm font-semibold text-slate-800">{a.title}</h3>
                                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold capitalize ring-1 ${announcementStyles[a.status] || "bg-slate-100 text-slate-500 ring-slate-200"}`}>
                                                {a.status}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-sm text-slate-500">{a.content}</p>
                                    </div>
                                    <p className="shrink-0 text-xs text-slate-400">
                                        {formatDate(a.effective_date)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </DashboardLayout>
    );
};

export default AgentDashboard;