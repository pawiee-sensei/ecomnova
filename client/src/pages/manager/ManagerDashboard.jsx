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
    active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    inactive: "bg-slate-100 text-slate-700 ring-slate-200",
    suspended: "bg-amber-50 text-amber-700 ring-amber-200",
    terminated: "bg-rose-50 text-rose-700 ring-rose-200",
};

const ManagerDashboard = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [teamOverview, setTeamOverview] = useState(null);
    const [teamActivity, setTeamActivity] = useState([]);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [kpiData, setKpiData] = useState(null);

    const fetchTeam = async () => {
        try {
            const response = await api.get("/manager/team");
            setEmployees(response.data);
        } catch (error) {
            console.error("Failed to load team:", error);
        }
    };

    const fetchTeamOverview = async () => {
        try {
            const response = await api.get("/manager/team-overview");
            setTeamOverview(response.data);
        } catch (error) {
            console.error("Failed to load team overview:", error);
        }
    };

    const fetchTeamActivity = async () => {
        try {
            const response = await api.get("/manager/team-activity");
            setTeamActivity(response.data);
        } catch (error) {
            console.error("Failed to load team activity:", error);
        }
    };

    const fetchLeaveRequests = async () => {
        try {
            const response = await api.get("/manager/leave");
            setLeaveRequests(response.data);
        } catch (error) {
            console.error("Failed to load leave requests:", error);
        }
    };

    const fetchKPI = async () => {
        try {
            const response = await api.get("/performance/kpi");
            const kpis = response.data.kpis;
            const currentMonth = new Date().getMonth() + 1;
            const currentYear = new Date().getFullYear();
            const current = kpis.find(
                (k) => k.month === currentMonth && k.year === currentYear
            );
            setKpiData(current || null);
        } catch (error) {
            console.error("Failed to load KPI:", error);
        }
    };

    useEffect(() => {
        fetchTeam();
        fetchTeamOverview();
        fetchTeamActivity();
        fetchLeaveRequests();
        fetchKPI();
    }, []);

    const totalMembers = employees.length;
    const activeEmployees = employees.filter((e) => e.status === "active").length;
    const inactiveEmployees = employees.filter((e) => e.status === "inactive").length;
    const suspendedEmployees = employees.filter((e) => e.status === "suspended").length;
    const totalAgents = employees.filter((e) => e.role === "agent").length;
    const totalLeaders = employees.filter((e) => e.role === "leader").length;
    const pendingLeave = leaveRequests.filter((r) => r.status === "pending").length;

    const teamName = teamOverview?.team_name || employees[0]?.team_name || "—";
    const departmentName = teamOverview?.department_name || employees[0]?.department_name || "—";

    const quickLinks = [
        { label: "My Team", path: "/manager/team", icon: "👥", color: "bg-violet-50 border-violet-100 text-violet-700" },
        { label: "Attendance", path: "/manager/attendance", icon: "📋", color: "bg-blue-50 border-blue-100 text-blue-700" },
        { label: "Performance", path: "/manager/performance", icon: "📊", color: "bg-amber-50 border-amber-100 text-amber-700" },
        { label: "Leave", path: "/manager/leave", icon: "🗓️", color: "bg-emerald-50 border-emerald-100 text-emerald-700", badge: pendingLeave },
        { label: "KPI", path: "/manager/kpi", icon: "🎯", color: "bg-rose-50 border-rose-100 text-rose-700" },
        { label: "Shifts", path: "/manager/shifts", icon: "🔄", color: "bg-slate-50 border-slate-200 text-slate-700" },
        { label: "Reports", path: "/manager/reports", icon: "📁", color: "bg-orange-50 border-orange-100 text-orange-700" },
        { label: "Announcements", path: "/manager/announcements", icon: "📢", color: "bg-pink-50 border-pink-100 text-pink-700" },
    ];

    return (
        <DashboardLayout>

            {/* Header */}
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
                        Manager Dashboard
                    </p>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Dashboard
                    </h1>
                    <p className="mt-1 text-slate-500">
                        Monitor your team and workforce at a glance.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                            {teamName}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                            {departmentName}
                        </span>
                    </div>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-violet-100 bg-violet-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-violet-500">Team Members</p>
                    <p className="mt-2 text-4xl font-bold text-violet-700">{totalMembers}</p>
                    <p className="mt-1 text-xs text-violet-400">Total assigned</p>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-500">Active</p>
                    <p className="mt-2 text-4xl font-bold text-emerald-700">{activeEmployees}</p>
                    <p className="mt-1 text-xs text-emerald-400">Currently active</p>
                </div>
                <div className="rounded-xl border border-amber-100 bg-amber-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-500">Pending Leave</p>
                    <p className="mt-2 text-4xl font-bold text-amber-700">{pendingLeave}</p>
                    <p className="mt-1 text-xs text-amber-400">Awaiting approval</p>
                </div>
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">KPI Achievement</p>
                    <p className="mt-2 text-4xl font-bold text-blue-700">
                        {kpiData ? `${kpiData.achievement}%` : "—"}
                    </p>
                    <p className="mt-1 text-xs text-blue-400">Current month</p>
                </div>
            </div>

            {/* Quick Links */}
            <div className="mb-8">
                <h2 className="mb-4 font-semibold text-slate-700">Quick Access</h2>
                <div className="grid gap-3 sm:grid-cols-4 lg:grid-cols-8">
                    {quickLinks.map((link) => (
                        <button
                            key={link.path}
                            onClick={() => navigate(link.path)}
                            className={`relative flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all hover:shadow-sm ${link.color}`}
                        >
                            {link.badge > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">
                                    {link.badge}
                                </span>
                            )}
                            <span className="text-2xl">{link.icon}</span>
                            <span className="text-xs font-semibold">{link.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-6 grid gap-6 lg:grid-cols-2">

                {/* Team Overview */}
                <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="font-semibold text-slate-700">Team Overview</h2>
                        <button
                            onClick={() => navigate("/manager/team")}
                            className="text-xs font-semibold text-violet-600 hover:underline"
                        >
                            View all →
                        </button>
                    </div>

                    {teamOverview ? (
                        <div className="divide-y divide-slate-100 rounded-xl border border-slate-100">
                            {[
                                { label: "Team", value: teamOverview.team_name },
                                { label: "Department", value: teamOverview.department_name },
                                { label: "Leader", value: teamOverview.leader_name || "Not Assigned" },
                                { label: "Members", value: teamOverview.member_count },
                                { label: "Status", value: formatLabel(teamOverview.status) },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center justify-between px-4 py-3">
                                    <span className="text-sm text-slate-500">{item.label}</span>
                                    <span className="text-sm font-semibold text-slate-800">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500">Team information unavailable.</p>
                    )}

                    {/* Role + Status breakdown */}
                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-lg bg-slate-50 p-3 text-center">
                            <p className="text-xs text-slate-400">Agents</p>
                            <p className="mt-1 text-2xl font-bold text-slate-700">{totalAgents}</p>
                        </div>
                        <div className="rounded-lg bg-slate-50 p-3 text-center">
                            <p className="text-xs text-slate-400">Leaders</p>
                            <p className="mt-1 text-2xl font-bold text-slate-700">{totalLeaders}</p>
                        </div>
                        <div className="rounded-lg bg-rose-50 p-3 text-center">
                            <p className="text-xs text-rose-400">Inactive</p>
                            <p className="mt-1 text-2xl font-bold text-rose-600">{inactiveEmployees}</p>
                        </div>
                        <div className="rounded-lg bg-amber-50 p-3 text-center">
                            <p className="text-xs text-amber-400">Suspended</p>
                            <p className="mt-1 text-2xl font-bold text-amber-600">{suspendedEmployees}</p>
                        </div>
                    </div>
                </div>

                {/* Recent Team Members */}
                <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="font-semibold text-slate-700">Team Members</h2>
                        <button
                            onClick={() => navigate("/manager/team")}
                            className="text-xs font-semibold text-violet-600 hover:underline"
                        >
                            View all →
                        </button>
                    </div>

                    {employees.length === 0 ? (
                        <p className="text-sm text-slate-500">No team members assigned.</p>
                    ) : (
                        <div className="space-y-3">
                            {employees.slice(0, 5).map((employee) => (
                                <div
                                    key={employee.id}
                                    className="flex items-center justify-between rounded-lg border border-slate-100 p-3 hover:bg-slate-50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                                            {employee.fullname.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">
                                                {employee.fullname}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {employee.job_title || "No title"}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${statusStyles[employee.status] || statusStyles.inactive}`}>
                                        {formatLabel(employee.status)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

            {/* Recent Activity */}
            <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-semibold text-slate-700">Recent Team Activity</h2>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
                        {teamActivity.length} records
                    </span>
                </div>

                {teamActivity.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <p className="text-sm text-slate-500">No recent activity found.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {teamActivity.map((activity) => (
                            <div
                                key={activity.id}
                                className="flex items-start justify-between gap-4 rounded-lg border border-slate-100 p-4 hover:bg-slate-50"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-slate-800 capitalize">
                                        {activity.action.replaceAll("_", " ")}
                                    </p>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        {activity.target_name}
                                    </p>
                                    {activity.details && (
                                        <p className="mt-1.5 text-xs text-slate-400">
                                            {activity.details}
                                        </p>
                                    )}
                                </div>
                                <span className="shrink-0 text-xs text-slate-400">
                                    {formatDate(activity.created_at)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </DashboardLayout>
    );
};

export default ManagerDashboard;