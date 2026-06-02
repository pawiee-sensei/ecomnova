import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

const MetricCard = ({
    title,
    value
}) => (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">
            {title}
        </p>

        <h2 className="mt-2 text-3xl font-bold">
            {value}
        </h2>
    </div>
);

const ManagerDashboard = () => {

    const [employees, setEmployees] =
        useState([]);

    const [teamOverview, setTeamOverview] =
    useState(null);

    const fetchTeam = async () => {
        try {

            const response =
                await api.get(
                    "/manager/team"
                );

            setEmployees(
                response.data
            );

        } catch (error) {

            console.error(
                "Failed to load team metrics:",
                error
            );
        }
    };

    const fetchTeamOverview =
    async () => {

        try {

            const response =
                await api.get(
                    "/manager/team-overview"
                );

            setTeamOverview(
                response.data
            );

        } catch (error) {

            console.error(
                "Failed to load team overview:",
                error
            );
        }
    };

    useEffect(() => {
        fetchTeam();
        fetchTeamOverview();
    }, []);

    const totalMembers =
        employees.length;

    const activeEmployees =
        employees.filter(
            (employee) =>
                employee.status ===
                "active"
        ).length;

        const totalAgents =
    employees.filter(
        (employee) =>
            employee.role ===
            "agent"
    ).length;

const totalLeaders =
    employees.filter(
        (employee) =>
            employee.role ===
            "leader"
    ).length;

    const inactiveEmployees =
        employees.filter(
            (employee) =>
                employee.status ===
                "inactive"
        ).length;

    const suspendedEmployees =
        employees.filter(
            (employee) =>
                employee.status ===
                "suspended"
        ).length;

    return (
        <DashboardLayout>

            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Manager Dashboard
                </h1>

                <p className="text-gray-500">
                    Monitor your team and workforce.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                <MetricCard
                    title="Team Members"
                    value={totalMembers}
                />

                <MetricCard
                    title="Active Employees"
                    value={activeEmployees}
                />

                <MetricCard
                    title="Inactive Employees"
                    value={inactiveEmployees}
                />

                <MetricCard
                    title="Suspended Employees"
                    value={suspendedEmployees}
                />

                <MetricCard
                    title="Total Agents"
                    value={totalAgents}
                />

                <MetricCard
                    title="Total Leaders"
                    value={totalLeaders}
                />  

            </div>
            <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

    <h2 className="text-lg font-semibold">
        Team Overview
    </h2>

    {teamOverview ? (

        <div className="mt-4 grid gap-4 md:grid-cols-2">

            <div>
                <p className="text-sm text-slate-500">
                    Team
                </p>

                <p className="font-medium">
                    {teamOverview.team_name}
                </p>
            </div>

            <div>
                <p className="text-sm text-slate-500">
                    Department
                </p>

                <p className="font-medium">
                    {teamOverview.department_name}
                </p>
            </div>

            <div>
                <p className="text-sm text-slate-500">
                    Leader
                </p>

                <p className="font-medium">
                    {teamOverview.leader_name ||
                        "Not Assigned"}
                </p>
            </div>

            <div>
                <p className="text-sm text-slate-500">
                    Members
                </p>

                <p className="font-medium">
                    {teamOverview.member_count}
                </p>
            </div>

            <div>
                <p className="text-sm text-slate-500">
                    Status
                </p>

                <p className="font-medium capitalize">
                    {teamOverview.status}
                </p>
            </div>

        </div>

    ) : (

        <p className="mt-4 text-slate-500">
            Team information unavailable.
        </p>

    )}

</div>

            <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">


    <h2 className="text-lg font-semibold">
        Recent Team Members
    </h2>

    <div className="mt-4 space-y-3">

        {employees.length === 0 ? (

    <p className="text-sm text-slate-500">
        No team members assigned.
    </p>

) : (

    employees
        .slice(0, 5)
        .map((employee) => (
            <div
                key={employee.id}
                className="flex items-center justify-between rounded-lg border border-slate-100 p-3"
            >
                <div>
                    <p className="font-medium">
                        {employee.fullname}
                    </p>

                    <p className="text-sm text-slate-500">
                        {employee.job_title}
                    </p>
                </div>

                <span className="text-sm capitalize text-slate-500">
                    {employee.status}
                </span>
            </div>
        ))

)}

    </div>

</div>

        </DashboardLayout>
    );
};

export default ManagerDashboard;