import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";



const Performance = () => {

    const [departments, setDepartments] =
    useState([]);

    const [selectedMetric, setSelectedMetric] =
    useState("attendance");

    const [attendanceAnalytics, setAttendanceAnalytics] =
    useState([]);

    const [history, setHistory] =
    useState([]);

    const fetchPerformanceHistory =
    async () => {

        try {

            const response =
                await api.get(
                    "/performance/history"
                );

            setHistory(
                response.data
            );

        } catch (error) {

            console.error(
                error
            );
        }
    };

    const fetchAttendanceAnalytics =
    async () => {

        try {

            const response =
                await api.get(
                    "/manager/attendance-analytics"
                );

            setAttendanceAnalytics(
                response.data
            );

        } catch (error) {

            console.error(
                error
            );
        }
    };

    const fetchPerformance =
    async () => {

        try {

            const response =
                await api.get(
                    "/performance/department-performance"
                );

            setDepartments(
                response.data
            );

        } catch (error) {

            console.error(
                "Failed to load performance:",
                error
            );
        }
    };

    useEffect(() => {

    fetchPerformance();
    fetchAttendanceAnalytics();
    fetchPerformanceHistory();

}, []);

const departmentCount =
    departments.length;

const overallPerformance =
    departmentCount === 0
        ? 0
        : Math.round(
            departments.reduce(
                (
                    total,
                    department
                ) =>
                    total +
                    department.performanceScore,
                0
            ) / departmentCount
        );

const bestDepartment =
    [...departments]
        .sort(
            (a, b) =>
                b.performanceScore -
                a.performanceScore
        )[0];

const lowestDepartment =
    [...departments]
        .sort(
            (a, b) =>
                a.performanceScore -
                b.performanceScore
        )[0];

const totalPresent =
    attendanceAnalytics.reduce(
        (total, employee) =>
            total +
            Number(
                employee.presentCount
            ),
        0
    );

const totalLate =
    attendanceAnalytics.reduce(
        (total, employee) =>
            total +
            Number(
                employee.lateCount
            ),
        0
    );

const totalAbsent =
    attendanceAnalytics.reduce(
        (total, employee) =>
            total +
            Number(
                employee.absentCount
            ),
        0
    );

const totalLeave =
    attendanceAnalytics.reduce(
        (total, employee) =>
            total +
            Number(
                employee.leaveCount
            ),
        0
    );

const chartData =
    history.map(
        (
            item
        ) => ({
            month: item.month,

            attendance:
                Number(
                    item.attendance_score
                ),

            kpi:
                Number(
                    item.kpi_achievement
                ),

            manager:
                Number(
                    item.manager_rating
                ),

            performance:
                Number(
                    item.performance_score
                )
        })
    );

    return (
    <DashboardLayout>

        <div className="mb-8">

            <h1 className="text-3xl font-bold">
                Department Performance
            </h1>

            <p className="text-gray-500">
                Monitor department effectiveness, performance trends, risks, and management insights.
            </p>

        </div>

        {/* Executive Overview */}

<div className="mb-8 grid gap-6 md:grid-cols-4">

    <div className="rounded-xl border bg-white p-6">

        <h3 className="text-sm text-slate-500">
            Performance Score
        </h3>

        <p className="mt-2 text-3xl font-bold">
            {departments[0]?.performanceScore || 0}
        </p>

    </div>

    <div className="rounded-xl border bg-white p-6">

        <h3 className="text-sm text-slate-500">
            KPI Achievement
        </h3>

        <p className="mt-2 text-3xl font-bold">
            {departments[0]?.achievement || 0}%
        </p>

    </div>

    <div className="rounded-xl border bg-white p-6">

        <h3 className="text-sm text-slate-500">
            Attendance
        </h3>

        <p className="mt-2 text-3xl font-bold">
            {departments[0]?.attendance || 0}%
        </p>

    </div>

    <div className="rounded-xl border bg-white p-6">

        <h3 className="text-sm text-slate-500">
            Manager Rating
        </h3>

        <p className="mt-2 text-3xl font-bold">
            {departments[0]?.managerRating || 0}
        </p>

    </div>

    

</div>

<div className="mb-8 grid gap-6 lg:grid-cols-2">

    <div className="rounded-xl border bg-white p-6">

        <h2 className="mb-4 text-xl font-semibold">
            Performance Metrics
        </h2>

        <table className="w-full">

            <thead>

                <tr className="border-b">

                    <th className="py-3 text-left">
                        Metric
                    </th>

                    <th className="py-3 text-left">
                        Current Value
                    </th>

                </tr>

            </thead>

            <tbody>

                <tr
                    onClick={() =>
                        setSelectedMetric(
                            "attendance"
                        )
                    }
                    className="cursor-pointer border-b hover:bg-slate-50"
                >

                    <td className="py-3">
                        Attendance
                    </td>

                    <td className="py-3">
                        {departments[0]?.attendance || 0}%
                    </td>

                </tr>

                <tr
                    onClick={() =>
                        setSelectedMetric(
                            "kpi"
                        )
                    }
                    className="cursor-pointer border-b hover:bg-slate-50"
                >

                    <td className="py-3">
                        KPI Achievement
                    </td>

                    <td className="py-3">
                        {departments[0]?.achievement || 0}%
                    </td>

                </tr>

                <tr
                    onClick={() =>
                        setSelectedMetric(
                            "manager"
                        )
                    }
                    className="cursor-pointer border-b hover:bg-slate-50"
                >

                    <td className="py-3">
                        Manager Rating
                    </td>

                    <td className="py-3">
                        {departments[0]?.managerRating || 0}
                    </td>

                </tr>

                <tr
                    onClick={() =>
                        setSelectedMetric(
                            "performance"
                        )
                    }
                    className="cursor-pointer hover:bg-slate-50"
                >

                    <td className="py-3">
                        Performance Score
                    </td>

                    <td className="py-3">
                        {departments[0]?.performanceScore || 0}
                    </td>

                </tr>

            </tbody>

        </table>

    </div>

<div className="rounded-xl border bg-white p-6">

    <h2 className="mb-4 text-xl font-semibold">

        {selectedMetric === "attendance" &&
            "Attendance Statistics"}

        {selectedMetric === "kpi" &&
            "KPI Statistics"}

        {selectedMetric === "manager" &&
            "Manager Rating Statistics"}

        {selectedMetric === "performance" &&
            "Performance Score Statistics"}

    </h2>

    {selectedMetric === "attendance" && (

        <div className="space-y-3">

            <div className="flex justify-between">

                <span>Present</span>

                <span className="font-semibold text-green-600">
                    {totalPresent}
                </span>

            </div>

            <div className="flex justify-between">

                <span>Late</span>

                <span className="font-semibold text-yellow-600">
                    {totalLate}
                </span>

            </div>

            <div className="flex justify-between">

                <span>Absent</span>

                <span className="font-semibold text-red-600">
                    {totalAbsent}
                </span>

            </div>

            <div className="flex justify-between">

                <span>Leave</span>

                <span className="font-semibold text-blue-600">
                    {totalLeave}
                </span>

            </div>

        </div>

    )}

    {selectedMetric === "kpi" && (

        <div className="space-y-3">

            <div className="flex justify-between">

                <span>Target</span>

                <span>
                    3000
                </span>

            </div>

            <div className="flex justify-between">

                <span>Actual</span>

                <span>
                    2100
                </span>

            </div>

            <div className="flex justify-between">

                <span>Achievement</span>

                <span className="font-semibold">
                    70%
                </span>

            </div>

        </div>

    )}

    {selectedMetric === "manager" && (

        <div>

            <p className="text-slate-600">
                Current Manager Rating
            </p>

            <p className="mt-2 text-3xl font-bold">
                60
            </p>

        </div>

    )}

    {selectedMetric === "performance" && (

        <div>

            <p className="text-slate-600">
                Current Performance Score
            </p>

            <p className="mt-2 text-3xl font-bold">
                65
            </p>

        </div>

    )}

<div className="mt-6">

    <h3 className="mb-4 font-semibold">
        Trend History
    </h3>

    <table className="w-full">

        <thead>

            <tr className="border-b">

                <th className="py-2 text-left">
                    Month
                </th>

                <th className="py-2 text-left">
                    Value
                </th>

            </tr>

        </thead>

        <tbody>

            {history.map((item) => (

                <tr
                    key={`${item.year}-${item.month}`}
                    className="border-b"
                >

                    <td className="py-2">
                        {item.month}/{item.year}
                    </td>

                    <td className="py-2">

                        {selectedMetric === "attendance" &&
                            item.attendance_score}

                        {selectedMetric === "kpi" &&
                            item.kpi_achievement}

                        {selectedMetric === "manager" &&
                            item.manager_rating}

                        {selectedMetric === "performance" &&
                            item.performance_score}

                    </td>

                </tr>

            ))}

        </tbody>

    </table>

</div>

</div>



</div>



        {/* Performance Alerts */}

        <div className="mb-8 rounded-xl border bg-white p-6">

            <h2 className="mb-4 text-xl font-semibold">
                Performance Alerts
            </h2>

            <div className="rounded-lg border border-slate-200 p-4">

                <p className="text-slate-500">
                    Performance alerts and department risks will appear here.
                </p>

            </div>

        </div>

        {/* Department Insights */}

        <div className="rounded-xl border bg-white p-6">

            <h2 className="mb-4 text-xl font-semibold">
                Department Insights
            </h2>

            <div className="rounded-lg border border-slate-200 p-4">

                <p className="text-slate-500">
                    Root cause analysis and management recommendations will appear here.
                </p>

            </div>

        </div>

    </DashboardLayout>
);
};

export default Performance;