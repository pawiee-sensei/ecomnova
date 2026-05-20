import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

const statusStyles = {
    active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    inactive: "bg-slate-100 text-slate-700 ring-slate-200",
    suspended: "bg-amber-50 text-amber-700 ring-amber-200",
    terminated: "bg-rose-50 text-rose-700 ring-rose-200"
};

const EmployeeDetails = () => {
    const { id } = useParams();

    const [employee, setEmployee] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [showResetForm, setShowResetForm] =
        useState(false);

    const [newPassword, setNewPassword] =
        useState("");

    const [resetting, setResetting] =
        useState(false);

    const [auditLogs, setAuditLogs] =
    useState([]);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await api.get(
                    `/admin/employees/${id}`
                );

                setEmployee(response.data);

        const auditResponse = await api.get(
            `/admin/employees/${id}/audit-logs`
        );

        setAuditLogs(auditResponse.data);

            } catch (error) {
                console.error(
                    "Employee detail fetch failed:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [id]);

    const handlePasswordReset = async () => {
        try {
            setResetting(true);

            await api.patch(
                `/admin/employees/${id}/reset-password`,
                {
                    newPassword
                }
            );

            setShowResetForm(false);
            setNewPassword("");
            alert("Password reset successful");

        } catch (error) {
            console.error(
                "Password reset failed:",
                error
            );
        } finally {
            setResetting(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        Loading employee profile...
                    </p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
                    <div>
                        <p className="text-sm font-medium text-slate-500">
                            Employee Profile
                        </p>

                        <h1 className="mt-1 text-3xl font-bold text-slate-950">
                            {employee.fullname}
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            {employee.employee_id} · {employee.email}
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Link
                            to="/admin/employees"
                            className="inline-flex justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                        >
                            Back to Directory
                        </Link>

                        <Link
                            to={`/admin/employees/edit/${id}`}
                            className="inline-flex justify-center rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                        >
                            Edit Profile
                        </Link>
                    </div>
                </div>

                {showResetForm && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 p-5 shadow-sm">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold text-rose-950">
                                    Reset Employee Password
                                </h2>

                                <p className="mt-1 text-sm text-rose-700">
                                    Create a temporary password and share it through a secure channel.
                                </p>

                                <input
                                    type="password"
                                    placeholder="Temporary password"
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(
                                            e.target.value
                                        )
                                    }
                                    className="mt-4 w-full max-w-md rounded-lg border border-rose-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-100"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={handlePasswordReset}
                                    disabled={resetting}
                                    className="rounded-lg bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {resetting
                                        ? "Resetting..."
                                        : "Confirm Reset"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowResetForm(false)
                                    }
                                    className="rounded-lg border border-rose-200 bg-white px-5 py-3 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-200 p-6">
                            <h2 className="text-lg font-semibold text-slate-950">
                                Profile Information
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Core account details used across admin workflows.
                            </p>
                        </div>

                        <div className="grid gap-5 p-6 sm:grid-cols-2">
                            <div className="rounded-lg bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">
                                    Employee ID
                                </p>

                                <p className="mt-1 font-semibold text-slate-950">
                                    {employee.employee_id}
                                </p>
                            </div>

                            <div className="rounded-lg bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">
                                    Full Name
                                </p>

                                <p className="mt-1 font-semibold text-slate-950">
                                    {employee.fullname}
                                </p>
                            </div>

                            <div className="rounded-lg bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">
                                    Email
                                </p>

                                <p className="mt-1 break-words font-semibold text-slate-950">
                                    {employee.email}
                                </p>
                            </div>

                            <div className="rounded-lg bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">
                                    Role
                                </p>

                                <p className="mt-1 font-semibold capitalize text-slate-950">
                                    {employee.role}
                                </p>
                            </div>

                            <div className="rounded-lg bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">
                                    Status
                                </p>

                                <span
                                    className={`
                                        mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1
                                        ${
                                            statusStyles[employee.status] ||
                                            statusStyles.inactive
                                        }
                                    `}
                                >
                                    {employee.status}
                                </span>
                            </div>

                            <div>
                                <p className="text-gray-500">
                                    Department
                                </p>

                                <p className="text-lg font-medium">
                                    {employee.department_name || "Unassigned"}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">
                                    Team
                                </p>

                                <p className="text-lg font-medium">
                                    {employee.team_name || "Unassigned"}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-500">
                                    Manager
                                </p>

                                <p className="text-lg font-medium">
                                    {employee.manager_name || "Unassigned"}
                                </p>
                            </div>

                            <div className="rounded-lg bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">
                                    Account Created
                                </p>

                                <p className="mt-1 font-semibold text-slate-950">
                                    {new Date(
                                        employee.created_at
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-950">
                            Account Controls
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Security actions are audited and visible in recent activity.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                setShowResetForm(true)
                            }
                            className="mt-6 w-full rounded-lg bg-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"
                        >
                            Reset Password
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-10">
    <h2 className="text-2xl font-bold mb-4">
        Recent Activity
    </h2>

    <div className="border rounded-xl overflow-hidden">
        <table className="w-full">

            <thead className="bg-gray-100">
                <tr>
                    <th className="text-left p-4">
                        Admin
                    </th>

                    <th className="text-left p-4">
                        Action
                    </th>

                    <th className="text-left p-4">
                        Details
                    </th>

                    <th className="text-left p-4">
                        Date
                    </th>
                </tr>
            </thead>

            <tbody>
                {auditLogs.map((log) => (
                    <tr
                        key={log.id}
                        className="border-t"
                    >
                        <td className="p-4">
                            {log.actor_name}
                        </td>

                        <td className="p-4">
                            {log.action}
                        </td>

                        <td className="p-4">
                            {log.details}
                        </td>

                        <td className="p-4">
                            {new Date(
                                log.created_at
                            ).toLocaleString()}
                        </td>
                    </tr>
                ))}
            </tbody>

        </table>
    </div>
</div>
        </DashboardLayout>

        
    );
};

export default EmployeeDetails;
