import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const Performance = () => {
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedMetric, setSelectedMetric] = useState("attendance");
    const [attendanceAnalytics, setAttendanceAnalytics] = useState([]);
    const [history, setHistory] = useState([]);

const fetchPerformanceHistory = async (departmentId) => {
    try {
        const response = await api.get(
            `/performance/history?departmentId=${departmentId}`
        );
        setHistory(response.data);
    } catch (error) {
        console.error(error);
    }
};

    const fetchAttendanceAnalytics = async () => {
        try {
            const response = await api.get("/manager/attendance-analytics");
            setAttendanceAnalytics(response.data);
        } catch (error) {
            console.error(error);
        }
    };

const fetchPerformance = async () => {
    try {
        const response = await api.get("/performance/department-performance");
        setDepartments(response.data);
        if (response.data.length > 0) {
            setSelectedDepartment(response.data[0]);
        }
    } catch (error) {
        console.error("Failed to load performance:", error);
    }
};

    useEffect(() => {
        fetchPerformance();
        fetchAttendanceAnalytics();
    }, []);

    useEffect(() => {
        if (selectedDepartment) {
            fetchPerformanceHistory(selectedDepartment.id);
        }
    }, [selectedDepartment]);

const deptAnalytics = selectedDepartment
    ? attendanceAnalytics.filter(
        (e) => e.department_id === selectedDepartment.id
    )
    : attendanceAnalytics;

const totalPresent = deptAnalytics.reduce(
    (total, e) => total + Number(e.presentCount), 0
);
const totalLate = deptAnalytics.reduce(
    (total, e) => total + Number(e.lateCount), 0
);
const totalAbsent = deptAnalytics.reduce(
    (total, e) => total + Number(e.absentCount), 0
);
const totalLeave = deptAnalytics.reduce(
    (total, e) => total + Number(e.leaveCount), 0
);

const computeInsights = (d) => {
    if (!d) return null;

    const { attendance, achievement, managerRating, performanceScore } = d;

    const hasAttendanceData = deptAnalytics.length > 0;

    let primaryIssue = null;
    let finding = null;
    let impact = null;
    let recommendation = null;

    if (hasAttendanceData && attendance < 75) {
        primaryIssue = "Attendance";
        finding = `Attendance is ${attendance}%, below the target of 75%.`;
        impact = "Low attendance is reducing department productivity.";
        recommendation = "Review attendance trends and conduct coaching sessions with affected employees.";
    } else if (achievement < 60) {
        primaryIssue = "KPI Achievement";
        finding = `KPI achievement is ${achievement}%, below the target of 60%.`;
        impact = "Low KPI achievement is affecting overall department performance.";
        recommendation = "Identify skill gaps and provide targeted training to improve output.";
    } else if (managerRating < 60) {
        primaryIssue = "Manager Rating";
        finding = `Manager rating is ${managerRating}, below the threshold of 60.`;
        impact = "Low manager rating may indicate team dissatisfaction or leadership gaps.";
        recommendation = "Schedule a leadership review and gather team feedback.";
    } else {
        primaryIssue = null;
        finding = "All metrics are within acceptable ranges.";
        impact = null;
        recommendation = "Continue current strategies and monitor monthly.";
    }

    return {
        departmentScore: performanceScore,
        primaryIssue,
        finding,
        impact,
        recommendation,
    };
};

const computeAlerts = (d) => {
    if (!d) return [];

    const { attendance, achievement, managerRating, performanceScore } = d;
    const hasAttendanceData = deptAnalytics.length > 0;
    const alerts = [];

    if (hasAttendanceData && attendance < 75) {
        alerts.push({
            type: "attendance-risk",
            severity: attendance < 50 ? "critical" : "warning",
            message: `Attendance is ${attendance}%, below the 75% target.`,
        });
    }

    if (achievement < 60) {
        alerts.push({
            type: "kpi-risk",
            severity: achievement < 40 ? "critical" : "warning",
            message: `KPI achievement is ${achievement}%, below the 60% threshold.`,
        });
    }

    if (performanceScore < 70) {
        alerts.push({
            type: "performance-risk",
            severity: performanceScore < 60 ? "critical" : "warning",
            message: `Performance score is ${performanceScore}, below the target of 70.`,
        });
    }

    if (managerRating < 60) {
        alerts.push({
            type: "manager-risk",
            severity: "warning",
            message: `Manager rating is ${managerRating}, below the threshold of 60.`,
        });
    }

    return alerts;
};

 const dept = selectedDepartment;

const thresholds = {
    attendance: 75,
    kpi: 60,
    manager: 60,
    performance: 70,
};

const metrics = [
    {
        key: "attendance",
        label: "Attendance",
        value: `${dept?.attendance || 0}%`,
        rawValue: dept?.attendance || 0,
        target: thresholds.attendance,
        color: "text-violet-600",
        bg: "bg-violet-50",
        border: "border-violet-200",
        accent: "#7c3aed",
    },
    {
        key: "kpi",
        label: "KPI Achievement",
        value: `${dept?.achievement || 0}%`,
        rawValue: dept?.achievement || 0,
        target: thresholds.kpi,
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
        accent: "#2563eb",
    },
    {
        key: "manager",
        label: "Manager Rating",
        value: dept?.managerRating || 0,
        rawValue: dept?.managerRating || 0,
        target: thresholds.manager,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        accent: "#059669",
    },
    {
        key: "performance",
        label: "Performance Score",
        value: dept?.performanceScore || 0,
        rawValue: dept?.performanceScore || 0,
        target: thresholds.performance,
        color: "text-orange-600",
        bg: "bg-orange-50",
        border: "border-orange-200",
        accent: "#ea580c",
    },
];
    const insights = computeInsights(selectedDepartment);
    const alerts = computeAlerts(selectedDepartment);

    const activeMetric = metrics.find((m) => m.key === selectedMetric);

    const chartDataKey =
        selectedMetric === "attendance"
            ? "attendance_score"
            : selectedMetric === "kpi"
            ? "kpi_achievement"
            : selectedMetric === "manager"
            ? "manager_rating"
            : "performance_score";

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="rounded-lg border border-slate-100 bg-white px-4 py-3 shadow-lg">
                    <p className="text-xs text-slate-400">{label}</p>
                    <p
                        className="mt-1 text-lg font-bold"
                        style={{ color: activeMetric?.accent }}
                    >
                        {payload[0].value}
                        {selectedMetric === "attendance" ||
                        selectedMetric === "kpi"
                            ? "%"
                            : ""}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <DashboardLayout>
 {/* Header */}
<div className="mb-6 flex items-start justify-between">
    <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Manager Dashboard
        </p>
        <h1 className="text-3xl font-bold text-slate-800">
            Department Performance
        </h1>
        <p className="mt-1 text-slate-500">
            Monitor effectiveness, trends, and insights across your team.
        </p>
    </div>
    <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
        Live
    </span>
</div>

{/* Department Switcher */}
{departments.length > 1 && (
    <div className="mb-6 flex flex-wrap gap-2">
        {departments.map((d) => (
            <button
                key={d.id}
                onClick={() => setSelectedDepartment(d)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                    selectedDepartment?.id === d.id
                        ? "border-violet-300 bg-violet-600 text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-violet-600"
                }`}
            >
                {d.department_name}
                <span className={`ml-2 text-xs ${
                    selectedDepartment?.id === d.id
                        ? "text-violet-200"
                        : d.status === "Warning" || d.status === "Critical"
                        ? "text-rose-400"
                        : "text-emerald-500"
                }`}>
                    {d.performanceScore}
                </span>
            </button>
        ))}
    </div>
)}

 {/* Metric Cards */}
<div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {metrics.map((m) => {
        const isAboveTarget = m.rawValue >= m.target;
        return (
            <button
                key={m.key}
                onClick={() => setSelectedMetric(m.key)}
                className={`rounded-xl border-2 p-5 text-left transition-all duration-200 ${
                    selectedMetric === m.key
                        ? `${m.border} ${m.bg} shadow-md`
                        : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm"
                }`}
            >
                <p className="text-xs font-medium text-slate-500">
                    {m.label}
                </p>
                <p
                    className={`mt-2 text-3xl font-bold ${
                        selectedMetric === m.key
                            ? m.color
                            : "text-slate-800"
                    }`}
                >
                    {m.value}
                </p>
                <div className="mt-2 flex items-center gap-1">
                    <span className={`text-xs font-semibold ${
                        isAboveTarget
                            ? "text-emerald-600"
                            : "text-rose-500"
                    }`}>
                        {isAboveTarget ? "↑ Above" : "↓ Below"}
                    </span>
                    <span className="text-xs text-slate-400">
                        {m.target}
                        {m.key === "attendance" || m.key === "kpi" ? "% target" : " target"}
                    </span>
                </div>
            </button>
        );
    })}
</div>

            {/* Main Content */}
            <div className="mb-6 grid gap-6 lg:grid-cols-2">
                {/* Left: Stats Panel */}
                <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center gap-2">
                        <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: activeMetric?.accent }}
                        />
                        <h2 className="font-semibold text-slate-700">
                            {activeMetric?.label} Details
                        </h2>
                    </div>

                    {selectedMetric === "attendance" && (
                        <div className="space-y-4">
                            {[
                                {
                                    label: "Present",
                                    value: totalPresent,
                                    color: "bg-emerald-500",
                                    text: "text-emerald-700",
                                    bg: "bg-emerald-50",
                                },
                                {
                                    label: "Late",
                                    value: totalLate,
                                    color: "bg-amber-400",
                                    text: "text-amber-700",
                                    bg: "bg-amber-50",
                                },
                                {
                                    label: "Absent",
                                    value: totalAbsent,
                                    color: "bg-red-500",
                                    text: "text-red-700",
                                    bg: "bg-red-50",
                                },
                                {
                                    label: "Leave",
                                    value: totalLeave,
                                    color: "bg-blue-500",
                                    text: "text-blue-700",
                                    bg: "bg-blue-50",
                                },
                            ].map((item) => {
                                const total =
                                    totalPresent +
                                    totalLate +
                                    totalAbsent +
                                    totalLeave;
                                const pct =
                                    total > 0
                                        ? Math.round((item.value / total) * 100)
                                        : 0;
                                return (
                                    <div key={item.label}>
                                        <div className="mb-1 flex items-center justify-between">
                                            <span className="text-sm text-slate-600">
                                                {item.label}
                                            </span>
                                            <span
                                                className={`text-sm font-bold ${item.text}`}
                                            >
                                                {item.value}{" "}
                                                <span className="font-normal text-slate-400">
                                                    ({pct}%)
                                                </span>
                                            </span>
                                        </div>
                                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                            <div
                                                className={`h-2 rounded-full ${item.color} transition-all duration-500`}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

{selectedMetric === "kpi" && (
    <div className="space-y-4">
        {[
            {
                label: "Target",
                value: dept?.target_value || 0,
                pct: 100,
                color: "bg-slate-300",
            },
            {
                label: "Actual",
                value: dept?.actual_value || 0,
                pct: dept?.achievement || 0,
                color: "bg-blue-500",
            },
        ].map((item) => (
            <div key={item.label}>
                <div className="mb-1 flex justify-between">
                    <span className="text-sm text-slate-600">
                        {item.label}
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                        {Number(item.value).toLocaleString()}
                    </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                        className={`h-2 rounded-full ${item.color} transition-all duration-500`}
                        style={{ width: `${item.pct}%` }}
                    />
                </div>
            </div>
        ))}
        <div className="mt-4 rounded-lg bg-blue-50 px-4 py-3">
            <p className="text-xs text-blue-500">Achievement Rate</p>
            <p className="text-2xl font-bold text-blue-700">
                {dept?.achievement || 0}%
            </p>
        </div>
    </div>
)}

{selectedMetric === "manager" && (
    <div>
        <div className="flex items-end gap-2">
            <p className="text-5xl font-bold text-emerald-600">
                {dept?.managerRating || 0}
            </p>
            <p className="mb-2 text-slate-400">/ 100</p>
        </div>
        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-100">
            <div
                className="h-3 rounded-full bg-emerald-500 transition-all duration-700"
                style={{ width: `${dept?.managerRating || 0}%` }}
            />
        </div>
        <p className="mt-3 text-sm text-slate-500">
            Manager rating is based on team feedback and KPI results.
        </p>
    </div>
)}

{selectedMetric === "performance" && (
    <div>
        <div className="flex items-end gap-2">
            <p className="text-5xl font-bold text-orange-600">
                {dept?.performanceScore || 0}
            </p>
            <p className="mb-2 text-slate-400">/ 100</p>
        </div>
        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-100">
            <div
                className="h-3 rounded-full bg-orange-500 transition-all duration-700"
                style={{ width: `${dept?.performanceScore || 0}%` }}
            />
        </div>
        <p className="mt-3 text-sm text-slate-500">
            Composite score based on attendance, KPI, and manager ratings.
        </p>
    </div>
)}
                </div>

                {/* Right: Chart Panel */}
                <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                    <div className="mb-1 flex items-center gap-2">
                        <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: activeMetric?.accent }}
                        />
                        <h2 className="font-semibold text-slate-700">
                            {activeMetric?.label} Trend
                        </h2>
                    </div>
                    <p className="mb-5 text-xs text-slate-400">
                        Monthly history
                    </p>

                    {history.length === 0 ? (
                        <div className="flex h-56 items-center justify-center rounded-lg bg-slate-50">
                            <p className="text-sm text-slate-400">No history data yet</p>
                        </div>
                    ) : (
                        <LineChart
                            width={420}
                            height={240}
                            data={history}
                            margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis
                                dataKey={(item) => `${item.month}/${item.year}`}
                                tick={{ fontSize: 11, fill: "#94a3b8" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 11, fill: "#94a3b8" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey={chartDataKey}
                                stroke={activeMetric?.accent}
                                strokeWidth={2.5}
                                dot={{ r: 4, fill: activeMetric?.accent, strokeWidth: 0 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    )}
                </div>
            </div>
{/* Department Insights — Full Row */}
<div className="mb-6 rounded-xl border border-slate-100 bg-white p-6 shadow-sm">

    {/* Header */}
    <div className="mb-6 flex items-center justify-between">
        <div>
            <h2 className="font-semibold text-slate-700">Department Insights</h2>
            <p className="mt-0.5 text-xs text-slate-400">
                Based on current month data
            </p>
        </div>
        {insights?.primaryIssue ? (
            <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-600">
                ⚠ Issue Detected
            </span>
        ) : insights ? (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600">
                ✓ All Clear
            </span>
        ) : null}
    </div>

    {!insights ? (
        <div className="flex h-40 items-center justify-center rounded-lg bg-slate-50">
            <p className="text-sm text-slate-400">Loading insights...</p>
        </div>
    ) : (
        <div className="grid gap-6 lg:grid-cols-3">

            {/* Left: Score + Status */}
            <div className="flex flex-col gap-4">

                <div className="rounded-xl bg-slate-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Performance Score
                    </p>
                    <div className="mt-2 flex items-end gap-2">
                        <p className={`text-5xl font-bold ${
                            insights.departmentScore >= 90 ? "text-emerald-600"
                            : insights.departmentScore >= 75 ? "text-blue-600"
                            : insights.departmentScore >= 60 ? "text-amber-500"
                            : "text-rose-600"
                        }`}>
                            {insights.departmentScore}
                        </p>
                        <p className="mb-2 text-slate-400">/ 100</p>
                    </div>

                    {/* Score bar */}
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                            className={`h-2 rounded-full transition-all duration-700 ${
                                insights.departmentScore >= 90 ? "bg-emerald-500"
                                : insights.departmentScore >= 75 ? "bg-blue-500"
                                : insights.departmentScore >= 60 ? "bg-amber-400"
                                : "bg-rose-500"
                            }`}
                            style={{ width: `${insights.departmentScore}%` }}
                        />
                    </div>

                    {/* Status label */}
                    <p className={`mt-2 text-xs font-semibold ${
                        insights.departmentScore >= 90 ? "text-emerald-600"
                        : insights.departmentScore >= 75 ? "text-blue-600"
                        : insights.departmentScore >= 60 ? "text-amber-500"
                        : "text-rose-600"
                    }`}>
                        {insights.departmentScore >= 90 ? "Excellent"
                        : insights.departmentScore >= 75 ? "Good"
                        : insights.departmentScore >= 60 ? "Warning"
                        : "Critical"}
                    </p>

                    {/* Threshold guide */}
                    <div className="mt-4 space-y-1 border-t border-slate-200 pt-3">
                        {[
                            { label: "Excellent", range: "90–100", color: "bg-emerald-500" },
                            { label: "Good",      range: "75–89",  color: "bg-blue-500" },
                            { label: "Warning",   range: "60–74",  color: "bg-amber-400" },
                            { label: "Critical",  range: "< 60",   color: "bg-rose-500" },
                        ].map((t) => (
                            <div key={t.label} className="flex items-center gap-2">
                                <span className={`h-2 w-2 rounded-full ${t.color}`} />
                                <span className="text-xs text-slate-500">
                                    {t.label}
                                </span>
                                <span className="ml-auto text-xs text-slate-400">
                                    {t.range}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Middle: Score Breakdown */}
            <div className="flex flex-col gap-4">

                <div className="rounded-xl bg-slate-50 p-5">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Score Breakdown
                    </p>

                    <div className="space-y-4">
{[
    {
        label: "KPI Achievement",
        value: dept?.achievement || 0,
        weight: 60,
        color: "bg-blue-500",
        text: "text-blue-600",
        contribution: Math.round((dept?.achievement || 0) * 0.60),
    },
    {
        label: "Attendance",
        value: dept?.attendance || 0,
        weight: 20,
        color: "bg-violet-500",
        text: "text-violet-600",
        contribution: Math.round((dept?.attendance || 0) * 0.20),
    },
    {
        label: "Manager Rating",
        value: dept?.managerRating || 0,
        weight: 20,
        color: "bg-emerald-500",
        text: "text-emerald-600",
        contribution: Math.round((dept?.managerRating || 0) * 0.20),
    },
                        ].map((item) => (
                            <div key={item.label}>
                                <div className="mb-1 flex items-center justify-between">
                                    <div>
                                        <span className="text-sm text-slate-600">
                                            {item.label}
                                        </span>
                                        <span className="ml-2 text-xs text-slate-400">
                                            ({item.weight}% weight)
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-sm font-bold ${item.text}`}>
                                            {item.value}
                                        </span>
                                        <span className="ml-1 text-xs text-slate-400">
                                            → {item.contribution} pts
                                        </span>
                                    </div>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                                    <div
                                        className={`h-2 rounded-full ${item.color} transition-all duration-700`}
                                        style={{ width: `${item.value}%` }}
                                    />
                                </div>
                            </div>
                        ))}

                        {/* Total */}
                        <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                            <span className="text-sm font-semibold text-slate-600">
                                Total Score
                            </span>
                            <span className="text-sm font-bold text-slate-800">
                                {insights.departmentScore} / 100
                            </span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Right: Finding, Impact, Recommendation */}
            <div className="flex flex-col gap-3">

                {insights.primaryIssue && (
                    <div className="rounded-xl border border-rose-100 bg-rose-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-rose-400">
                            Primary Issue
                        </p>
                        <p className="mt-1 font-semibold text-rose-700">
                            {insights.primaryIssue}
                        </p>
                    </div>
                )}

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Finding
                    </p>
                    <p className="mt-1 text-sm text-slate-700">
                        {insights.finding}
                    </p>
                </div>

                {insights.impact && (
                    <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-amber-500">
                            Impact
                        </p>
                        <p className="mt-1 text-sm text-amber-800">
                            {insights.impact}
                        </p>
                    </div>
                )}

                <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-violet-500">
                        Recommendation
                    </p>
                    <p className="mt-1 text-sm text-violet-800">
                        {insights.recommendation}
                    </p>
                </div>

            </div>

        </div>
    )}
</div>


{/* Performance Alerts — Full Row */}
<div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
    <div className="mb-4 flex items-center justify-between">
        <div>
            <h2 className="font-semibold text-slate-700">Performance Alerts</h2>
            <p className="mt-0.5 text-xs text-slate-400">
                Automatic risk detection
            </p>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            alerts.length === 0
                ? "bg-slate-100 text-slate-500"
                : alerts.some((a) => a.severity === "critical")
                ? "bg-rose-100 text-rose-600"
                : "bg-amber-100 text-amber-600"
        }`}>
            {alerts.length === 0
                ? "0 active"
                : `${alerts.length} active`}
        </span>
    </div>

    {alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg bg-slate-50 py-10 text-center">
            <div className="mb-2 text-2xl">✅</div>
            <p className="text-sm font-medium text-slate-600">All clear</p>
            <p className="mt-1 text-xs text-slate-400">
                No active alerts or department risks.
            </p>
        </div>
    ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {alerts.map((alert, index) => (
                <div
                    key={index}
                    className={`rounded-xl border p-4 ${
                        alert.severity === "critical"
                            ? "border-rose-200 bg-rose-50"
                            : "border-amber-200 bg-amber-50"
                    }`}
                >
                    <div className="mb-2 flex items-center gap-2">
                        <span className="text-lg">
                            {alert.severity === "critical" ? "🔴" : "⚠️"}
                        </span>
                        <span className={`text-xs font-bold uppercase tracking-wide ${
                            alert.severity === "critical"
                                ? "text-rose-500"
                                : "text-amber-500"
                        }`}>
                            {alert.severity}
                        </span>
                    </div>
                    <p className={`text-sm font-medium ${
                        alert.severity === "critical"
                            ? "text-rose-700"
                            : "text-amber-700"
                    }`}>
                        {alert.message}
                    </p>
                    <p className="mt-1 text-xs text-slate-400 capitalize">
                        {alert.type.replaceAll("-", " ")}
                    </p>
                </div>
            ))}
        </div>
    )}
</div>
        </DashboardLayout>
    );
};

export default Performance;