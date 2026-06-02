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

    useEffect(() => {
        fetchTeam();
    }, []);

    const totalMembers =
        employees.length;

    const activeEmployees =
        employees.filter(
            (employee) =>
                employee.status ===
                "active"
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

            </div>

        </DashboardLayout>
    );
};

export default ManagerDashboard;