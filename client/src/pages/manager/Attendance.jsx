import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

const PAGE_SIZE = 8;

const formatDate = (value) => {
    if (!value) {
        return "N/A";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    }).format(date);
};

const formatStatus = (status) =>
    String(status || "unknown").replace(/-/g, " ");

const getStatusBadgeClass = (status) => {
    const normalizedStatus = String(status || "").toLowerCase();

    if (normalizedStatus === "present") {
        return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    }

    if (normalizedStatus === "late") {
        return "bg-amber-50 text-amber-700 ring-amber-200";
    }

    if (normalizedStatus === "absent") {
        return "bg-rose-50 text-rose-700 ring-rose-200";
    }

    if (normalizedStatus === "leave") {
        return "bg-sky-50 text-sky-700 ring-sky-200";
    }

    return "bg-slate-100 text-slate-600 ring-slate-200";
};

const getRiskBadgeClass = (risk) => {
    if (risk === "Critical") {
        return "bg-rose-50 text-rose-700 ring-rose-200";
    }

    if (risk === "Warning") {
        return "bg-amber-50 text-amber-700 ring-amber-200";
    }

    if (risk === "Good") {
        return "bg-sky-50 text-sky-700 ring-sky-200";
    }

    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
};

const getStatusTrend = (status) => {
    const normalizedStatus = String(status || "").toLowerCase();

    if (normalizedStatus === "present") {
        return {
            direction: "up",
            label: "Positive attendance",
            className: "border-emerald-200 bg-white text-emerald-700"
        };
    }

    if (normalizedStatus === "absent" || normalizedStatus === "late") {
        return {
            direction: "down",
            label: "Needs attention",
            className: "border-rose-200 bg-white text-rose-700"
        };
    }

    return {
        direction: "neutral",
        label: "Neutral attendance",
        className: "border-slate-200 bg-white text-slate-400"
    };
};

const TrendIcon = ({ trend }) => (
    <span
        title={trend.label}
        className={`inline-flex h-8 w-8 flex-col items-center justify-center rounded-full border text-[10px] font-bold leading-none ${trend.className}`}
    >
        {trend.direction === "up" && (
            <>
                <span className="h-0 w-0 border-x-[5px] border-b-[8px] border-x-transparent border-b-current" />
                <span className="mt-0.5">%</span>
            </>
        )}
        {trend.direction === "down" && (
            <>
                <span>%</span>
                <span className="mt-0.5 h-0 w-0 border-x-[5px] border-t-[8px] border-x-transparent border-t-current" />
            </>
        )}
        {trend.direction === "neutral" && <span>-</span>}
    </span>
);

const getAlertMeta = (types) => {
    if (types.includes("absence") || types.includes("attendance-risk")) {
        return {
            label: "High priority",
            className:
                "border-rose-200 bg-rose-50 text-rose-900 hover:border-rose-300",
            badgeClassName: "bg-rose-100 text-rose-700"
        };
    }

    if (types.includes("late")) {
        return {
            label: "Follow up",
            className:
                "border-amber-200 bg-amber-50 text-amber-900 hover:border-amber-300",
            badgeClassName: "bg-amber-100 text-amber-700"
        };
    }

    if (types.includes("recognition")) {
        return {
            label: "Recognition",
            className:
                "border-emerald-200 bg-emerald-50 text-emerald-900 hover:border-emerald-300",
            badgeClassName: "bg-emerald-100 text-emerald-700"
        };
    }

    return {
        label: "Notice",
        className:
            "border-slate-200 bg-slate-50 text-slate-900 hover:border-slate-300",
        badgeClassName: "bg-slate-200 text-slate-700"
    };
};

const Attendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [summary, setSummary] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [analytics, setAnalytics] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [attendanceHistory, setAttendanceHistory] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [attendancePage, setAttendancePage] = useState(1);

    const fetchAttendanceHistory = async (employee) => {
        try {
            const response = await api.get(
                `/manager/attendance-history/${employee.employee_id}`
            );

            setAttendanceHistory(response.data);
            setSelectedEmployee(employee);
        } catch (error) {
            console.error("Failed to load attendance history:", error);
        }
    };

    const fetchAttendance = async () => {
        try {
            const response = await api.get("/manager/attendance");

            setAttendance(response.data);
        } catch (error) {
            console.error("Failed to load attendance:", error);
        }
    };

    const fetchAnalytics = async () => {
        try {
            const response = await api.get("/manager/attendance-analytics");

            setAnalytics(response.data);
        } catch (error) {
            console.error("Failed to load analytics:", error);
        }
    };

    const fetchSummary = async () => {
        try {
            const response = await api.get("/manager/attendance-summary");

            setSummary(response.data);
        } catch (error) {
            console.error("Failed to load summary:", error);
        }
    };

    const fetchAlerts = async () => {
        try {
            const response = await api.get("/manager/attendance-alerts");

            setAlerts(response.data);
        } catch (error) {
            console.error("Failed to load alerts:", error);
        }
    };

    useEffect(() => {
        fetchAttendance();
        fetchSummary();
        fetchAnalytics();
        fetchAlerts();
    }, []);

    useEffect(() => {
        setAttendancePage(1);
    }, [searchTerm, statusFilter]);

    const filteredAttendance = useMemo(
        () =>
            attendance.filter((record) => {
                const employeeName = String(record.fullname || "");
                const matchesSearch = employeeName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
                const matchesStatus =
                    !statusFilter || record.status === statusFilter;

                return matchesSearch && matchesStatus;
            }),
        [attendance, searchTerm, statusFilter]
    );

    const analyticsData = useMemo(
        () =>
            analytics.map((employee) => {
                const present = Number(employee.presentCount);
                const late = Number(employee.lateCount);
                const absent = Number(employee.absentCount);
                const leave = Number(employee.leaveCount);
                const total = present + late + absent + leave;
                const attendanceRate =
                    total === 0 ? 0 : Math.round((present / total) * 100);
                const score =
                    total === 0
                        ? 0
                        : Math.round(
                              ((present * 100 + late * 50) /
                                  (total * 100)) *
                                  100
                          );
                let risk = "Excellent";

                if (score < 75) {
                    risk = "Critical";
                } else if (score < 85) {
                    risk = "Warning";
                } else if (score < 95) {
                    risk = "Good";
                }

                return {
                    ...employee,
                    attendanceRate,
                    score,
                    risk,
                    total
                };
            }),
        [analytics]
    );

    const attendancePageCount = Math.max(
        1,
        Math.ceil(filteredAttendance.length / PAGE_SIZE)
    );
    const paginatedAttendance = filteredAttendance.slice(
        (attendancePage - 1) * PAGE_SIZE,
        attendancePage * PAGE_SIZE
    );
    const attendanceStart =
        filteredAttendance.length === 0
            ? 0
            : (attendancePage - 1) * PAGE_SIZE + 1;
    const attendanceEnd = Math.min(
        attendancePage * PAGE_SIZE,
        filteredAttendance.length
    );
    const attendanceLeaders = [...analyticsData]
        .sort((a, b) => b.attendanceRate - a.attendanceRate)
        .slice(0, 3);
    const attendanceConcerns = [...analyticsData]
        .sort((a, b) => a.attendanceRate - b.attendanceRate)
        .slice(0, 3);
    const findAlertEmployee = (alertEmployeeName) =>
        analyticsData.find(
            (employee) =>
                String(employee.fullname || "").toLowerCase() ===
                String(alertEmployeeName || "").toLowerCase()
        );
    const groupedAlerts = alerts.reduce((groups, alert) => {
        const employeeName = alert.employee || "Unknown employee";
        const existingGroup = groups.find(
            (group) =>
                String(group.employee || "").toLowerCase() ===
                String(employeeName).toLowerCase()
        );

        if (existingGroup) {
            existingGroup.messages.push(alert.message);
            existingGroup.types.push(alert.type);
            return groups;
        }

        return [
            ...groups,
            {
                employee: employeeName,
                messages: [alert.message],
                types: [alert.type],
                employeeData: findAlertEmployee(employeeName)
            }
        ];
    }, []);

    const summaryCards = [
        {
            label: "Present",
            value: summary?.presentCount || 0,
            caption: "On time today"
        },
        {
            label: "Late",
            value: summary?.lateCount || 0,
            caption: "Needs follow-up"
        },
        {
            label: "Absent",
            value: summary?.absentCount || 0,
            caption: "Missed records"
        },
        {
            label: "Leave",
            value: summary?.leaveCount || 0,
            caption: "Approved leave"
        }
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Attendance
                        </h1>
                        <p className="text-sm text-slate-500">
                            Monitor team attendance, risks, and recent records.
                        </p>
                    </div>
                    <div className="text-sm text-slate-500">
                        {filteredAttendance.length} records
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {summaryCards.map((card) => (
                        <div
                            key={card.label}
                            className="rounded-lg border bg-white p-4"
                        >
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                {card.label}
                            </p>
                            <p className="mt-1 text-2xl font-bold text-slate-900">
                                {card.value}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                                {card.caption}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                    <section className="overflow-hidden rounded-lg border bg-white shadow-sm">
                        <div className="border-b bg-slate-50 px-5 py-4">
                            <h2 className="text-base font-semibold text-slate-900">
                                Attendance Leaderboard
                            </h2>
                            <p className="text-sm text-slate-500">
                                Highest attendance rate across the team.
                            </p>
                        </div>
                        <div className="space-y-3 p-5">
                            {attendanceLeaders.map((employee, index) => (
                                <div
                                    key={employee.employee_id}
                                    className="rounded-lg bg-slate-50 p-3"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-700 shadow-sm">
                                                {index + 1}
                                            </span>
                                            <div className="min-w-0">
                                                <p className="truncate font-medium text-slate-900">
                                                    {employee.fullname}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    Score {employee.score}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-semibold text-slate-900">
                                            {employee.attendanceRate}%
                                        </span>
                                    </div>
                                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                                        <div
                                            className="h-full rounded-full bg-slate-900"
                                            style={{
                                                width: `${employee.attendanceRate}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-lg border bg-white shadow-sm">
                        <div className="border-b bg-slate-50 px-5 py-4">
                            <h2 className="text-base font-semibold text-slate-900">
                                Attendance Concerns
                            </h2>
                            <p className="text-sm text-slate-500">
                                Lowest attendance rate for manager review.
                            </p>
                        </div>
                        <div className="space-y-3 p-5">
                            {attendanceConcerns.map((employee) => (
                                <div
                                    key={employee.employee_id}
                                    className="rounded-lg bg-slate-50 p-3"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="truncate font-medium text-slate-900">
                                                {employee.fullname}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {employee.risk} risk
                                            </p>
                                        </div>
                                        <span className="text-sm font-semibold text-slate-900">
                                            {employee.attendanceRate}%
                                        </span>
                                    </div>
                                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                                        <div
                                            className="h-full rounded-full bg-slate-500"
                                            style={{
                                                width: `${employee.attendanceRate}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <section className="overflow-hidden rounded-lg border bg-white shadow-sm">
                    <div className="flex items-center justify-between gap-3 border-b bg-slate-50 px-5 py-4">
                        <div>
                            <h2 className="text-base font-semibold text-slate-900">
                                Attendance Alerts
                            </h2>
                            <p className="text-sm text-slate-500">
                                One row per employee. Click a row to view details.
                            </p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                            {groupedAlerts.length}
                        </span>
                    </div>

                    {groupedAlerts.length === 0 ? (
                        <p className="p-5 text-sm text-slate-500">
                            No attendance alerts.
                        </p>
                    ) : (
                        <div className="max-h-80 space-y-3 overflow-auto p-5">
                            {groupedAlerts.map((alert, index) => {
                                const alertMeta = getAlertMeta(alert.types);

                                return (
                                    <button
                                        type="button"
                                        key={index}
                                        disabled={!alert.employeeData}
                                        onClick={() =>
                                            alert.employeeData &&
                                            fetchAttendanceHistory(
                                                alert.employeeData
                                            )
                                        }
                                        className={`block w-full cursor-pointer rounded-lg border p-4 text-left transition hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-70 ${alertMeta.className}`}
                                    >
                                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold">
                                                    {alert.employee}
                                                </p>
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {alert.messages.map(
                                                        (message) => (
                                                            <span
                                                                key={message}
                                                                className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-medium"
                                                            >
                                                                {message}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                            <span
                                                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${alertMeta.badgeClassName}`}
                                            >
                                                {alertMeta.label}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </section>

                <section className="rounded-lg border bg-white">
                    <div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-slate-900">
                                Attendance Records
                            </h2>
                            <p className="text-sm text-slate-500">
                                Showing {attendanceStart}-{attendanceEnd} of{" "}
                                {filteredAttendance.length}
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row">
                            <input
                                type="text"
                                placeholder="Search employee..."
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(event.target.value)
                                }
                                className="h-10 rounded-lg border px-3 text-sm outline-none focus:border-slate-400"
                            />
                            <select
                                value={statusFilter}
                                onChange={(event) =>
                                    setStatusFilter(event.target.value)
                                }
                                className="h-10 rounded-lg border px-3 text-sm outline-none focus:border-slate-400"
                            >
                                <option value="">All statuses</option>
                                <option value="present">Present</option>
                                <option value="late">Late</option>
                                <option value="absent">Absent</option>
                                <option value="leave">Leave</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[680px] text-sm">
                            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Employee</th>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Trend</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {paginatedAttendance.map((record) => {
                                    const trend = getStatusTrend(record.status);

                                    return (
                                        <tr
                                            key={record.id}
                                            className="hover:bg-slate-50"
                                        >
                                            <td className="px-4 py-3 font-medium text-slate-800">
                                                {record.fullname}
                                            </td>
                                            <td className="px-4 py-3 text-slate-600">
                                                {formatDate(
                                                    record.attendance_date
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ${getStatusBadgeClass(
                                                        record.status
                                                    )}`}
                                                >
                                                    {formatStatus(record.status)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <TrendIcon trend={trend} />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {paginatedAttendance.length === 0 && (
                            <div className="p-8 text-center text-sm text-slate-500">
                                No attendance records found.
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-slate-500">
                            Page {attendancePage} of {attendancePageCount}
                        </p>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                disabled={attendancePage === 1}
                                onClick={() =>
                                    setAttendancePage((page) =>
                                        Math.max(1, page - 1)
                                    )
                                }
                                className="rounded-lg border px-3 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                type="button"
                                disabled={attendancePage === attendancePageCount}
                                onClick={() =>
                                    setAttendancePage((page) =>
                                        Math.min(
                                            attendancePageCount,
                                            page + 1
                                        )
                                    )
                                }
                                className="rounded-lg border px-3 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </section>

                <section className="rounded-lg border bg-white">
                    <div className="border-b p-4">
                        <h2 className="text-base font-semibold text-slate-900">
                            Attendance Analytics
                        </h2>
                        <p className="text-sm text-slate-500">
                            Review attendance health and open details in a
                            modal.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[820px] text-sm">
                            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Employee</th>
                                    <th className="px-4 py-3">Rate</th>
                                    <th className="px-4 py-3">Score</th>
                                    <th className="px-4 py-3">Risk</th>
                                    <th className="px-4 py-3">Breakdown</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {analyticsData.map((employee) => (
                                    <tr
                                        key={employee.employee_id}
                                        className="hover:bg-slate-50"
                                    >
                                        <td className="px-4 py-3 font-medium text-slate-800">
                                            {employee.fullname}
                                        </td>
                                        <td className="px-4 py-3 font-semibold text-slate-800">
                                            {employee.attendanceRate}%
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">
                                            {employee.score}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${getRiskBadgeClass(
                                                    employee.risk
                                                )}`}
                                            >
                                                {employee.risk}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-slate-600">
                                            P {employee.presentCount} | L{" "}
                                            {employee.lateCount} | A{" "}
                                            {employee.absentCount} | LV{" "}
                                            {employee.leaveCount}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    fetchAttendanceHistory(
                                                        employee
                                                    )
                                                }
                                                className="rounded-lg border px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            {selectedEmployee && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-2xl">
                        <div className="bg-slate-900 px-6 py-5 text-white">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                                        Attendance Details
                                    </p>
                                    <h2 className="mt-1 text-xl font-semibold">
                                        {selectedEmployee.fullname}
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-300">
                                        {selectedEmployee.total} records reviewed
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedEmployee(null);
                                        setAttendanceHistory([]);
                                    }}
                                    className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20"
                                >
                                    Close
                                </button>
                            </div>
                        </div>

                        <div className="grid gap-5 p-6 lg:grid-cols-[260px_1fr]">
                            <aside className="space-y-3">
                                {[
                                    [
                                        "Attendance Rate",
                                        `${selectedEmployee.attendanceRate}%`
                                    ],
                                    ["Score", selectedEmployee.score],
                                    ["Risk", selectedEmployee.risk],
                                    ["Total Records", selectedEmployee.total]
                                ].map(([label, value]) => (
                                    <div
                                        key={label}
                                        className="rounded-lg bg-slate-50 p-4"
                                    >
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            {label}
                                        </p>
                                        <p className="mt-1 text-xl font-bold text-slate-900">
                                            {value}
                                        </p>
                                    </div>
                                ))}
                            </aside>

                            <div className="min-w-0 rounded-lg border bg-white">
                                <div className="flex items-center justify-between gap-4 border-b bg-slate-50 px-4 py-3">
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-900">
                                            Attendance History
                                        </h3>
                                        <p className="text-xs text-slate-500">
                                            Recent records by date and status.
                                        </p>
                                    </div>
                                    <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">
                                        {attendanceHistory.length}
                                    </span>
                                </div>

                                <div className="max-h-[48vh] overflow-auto p-3">
                                    <div className="space-y-2">
                                        {attendanceHistory.map((record) => (
                                            <div
                                                key={record.id}
                                                className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 px-4 py-3"
                                            >
                                                <span className="text-sm font-medium text-slate-700">
                                                    {formatDate(
                                                        record.attendance_date
                                                    )}
                                                </span>
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ${getStatusBadgeClass(
                                                        record.status
                                                    )}`}
                                                >
                                                    {formatStatus(
                                                        record.status
                                                    )}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {attendanceHistory.length === 0 && (
                                        <p className="py-10 text-center text-sm text-slate-500">
                                            No attendance history found.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default Attendance;
