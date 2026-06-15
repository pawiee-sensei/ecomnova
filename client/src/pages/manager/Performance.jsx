import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";



const Performance = () => {

    const [departments, setDepartments] =
    useState([]);

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