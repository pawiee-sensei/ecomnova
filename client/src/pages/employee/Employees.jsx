import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

const statusStyles = {
    active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    inactive: "bg-slate-100 text-slate-700 ring-slate-200",
    suspended: "bg-amber-50 text-amber-700 ring-amber-200",
    terminated: "bg-rose-50 text-rose-700 ring-rose-200"
};

const roleStyles = {
    agent: "bg-slate-100 text-slate-700 ring-slate-200",
    leader: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    manager: "bg-sky-50 text-sky-700 ring-sky-200",
    hr: "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200",
    qa: "bg-amber-50 text-amber-700 ring-amber-200",
    admin: "bg-slate-950 text-white ring-slate-950"
};

const PAGE_SIZE = 10;

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [auditLogs, setAuditLogs] = useState([]);
    const [employeePage, setEmployeePage] = useState(1);
    const [auditPage, setAuditPage] = useState(1);

    const stats = useMemo(() => {
        const active = employees.filter(
            (employee) => employee.status === "active"
        ).length;

        return {
            total: employees.length,
            active,
            inactive: employees.length - active
        };
    }, [employees]);

    const employeePageCount = Math.max(
        1,
        Math.ceil(employees.length / PAGE_SIZE)
    );

    const auditPageCount = Math.max(
        1,
        Math.ceil(auditLogs.length / PAGE_SIZE)
    );

    const paginatedEmployees = useMemo(() => {
        const start = (employeePage - 1) * PAGE_SIZE;

        return employees.slice(start, start + PAGE_SIZE);
    }, [employeePage, employees]);

    const paginatedAuditLogs = useMemo(() => {
        const start = (auditPage - 1) * PAGE_SIZE;

        return auditLogs.slice(start, start + PAGE_SIZE);
    }, [auditLogs, auditPage]);

    const fetchAuditLogs = useCallback(async () => {
        const auditResponse = await api.get(
            "/admin/employees/audit-logs"
        );

        setAuditLogs(auditResponse.data);
    }, []);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                setLoading(true);

                const response = await api.get(
                    `/admin/employees?search=${search}&role=${roleFilter}&status=${statusFilter}`
                );

                setEmployees(response.data);
                await fetchAuditLogs();

            } catch (error) {
                console.error(
                    "Employee fetch failed:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, [search, roleFilter, statusFilter, fetchAuditLogs]);

    useEffect(() => {
        setEmployeePage(1);
    }, [search, roleFilter, statusFilter]);

    useEffect(() => {
        setEmployeePage((page) =>
            Math.min(page, employeePageCount)
        );
    }, [employeePageCount]);

    useEffect(() => {
        setAuditPage((page) =>
            Math.min(page, auditPageCount)
        );
    }, [auditPageCount]);

    const handleStatusChange = async (
        employeeId,
        newStatus
    ) => {
        try {
            await api.patch(
                `/admin/employees/${employeeId}/status`,
                {
                    status: newStatus
                }
            );

            setEmployees((prevEmployees) =>
                prevEmployees.map((employee) =>
                    employee.id === employeeId
                        ? {
                            ...employee,
                            status: newStatus
                        }
                        : employee
                )
            );

            await fetchAuditLogs();

        } catch (error) {
            console.error(
                "Status update failed:",
                error
            );
        }
    };

    const renderPlainAssignment = (value) => {
        if (!value) {
            return (
                <span className="font-medium text-rose-600">
                    Unassigned
                </span>
            );
        }

        return <span className="text-slate-600">{value}</span>;
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        Loading workforce directory...
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
                            Employee Management
                        </p>

                        <h1 className="mt-1 text-3xl font-bold text-slate-950">
                            Workforce Directory
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm text-slate-500">
                            Manage employee access, roles, account status, and recent administrative activity.
                        </p>
                    </div>

                    <Link
                        to="/admin/employees/create"
                        className="inline-flex items-center justify-center rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                    >
                        Create Employee
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Total Employees
                        </p>

                        <p className="mt-2 text-3xl font-bold text-slate-950">
                            {stats.total}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Active Accounts
                        </p>

                        <p className="mt-2 text-3xl font-bold text-emerald-600">
                            {stats.active}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Needs Attention
                        </p>

                        <p className="mt-2 text-3xl font-bold text-amber-600">
                            {stats.inactive}
                        </p>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 p-5">
                        <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px]">
                            <input
                                type="text"
                                placeholder="Search by name, ID, or email"
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                            />

                            <select
                                value={roleFilter}
                                onChange={(e) =>
                                    setRoleFilter(e.target.value)
                                }
                                className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                            >
                                <option value="">All Roles</option>
                                <option value="agent">Agent</option>
                                <option value="leader">Team Leader</option>
                                <option value="manager">Manager</option>
                                <option value="hr">HR</option>
                                <option value="qa">QA</option>
                                <option value="admin">Admin</option>
                            </select>

                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                                className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                            >
                                <option value="">All Statuses</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="suspended">Suspended</option>
                                <option value="terminated">Terminated</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1180px] table-fixed">
                            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                <tr>
                                    <th className="w-[18%] px-5 py-3 text-left font-semibold">
                                        Employee
                                    </th>
                                    <th className="w-[18%] px-5 py-3 text-left font-semibold">
                                        Email
                                    </th>
                                    <th className="w-[9%] px-5 py-3 text-center font-semibold">
                                        Role
                                    </th>
                                    <th className="w-[12%] px-5 py-3 text-left font-semibold">
                                        Department
                                    </th>
                                    <th className="w-[10%] px-5 py-3 text-left font-semibold">
                                        Team
                                    </th>
                                    <th className="w-[8%] px-5 py-3 text-center font-semibold">
                                        Status
                                    </th>
                                    <th className="w-[25%] px-5 py-3 text-center font-semibold">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {employees.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-5 py-10 text-center text-sm text-slate-500"
                                        >
                                            No employees match your filters.
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedEmployees.map((employee) => (
                                        <tr
                                            key={employee.id}
                                            className="transition hover:bg-slate-50"
                                        >
                                            <td className="px-5 py-4 align-middle">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700">
                                                        {employee.fullname
                                                            ?.slice(0, 2)
                                                            .toUpperCase()}
                                                    </div>

                                                    <div>
                                                        <p className="font-medium text-slate-950">
                                                            {employee.fullname}
                                                        </p>

                                                        <p className="text-sm text-slate-500">
                                                            {employee.employee_id}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 align-middle text-sm text-slate-600">
                                                {employee.email}
                                            </td>

                                            <td className="px-5 py-4 text-center align-middle">
                                                <span
                                                    className={`
                                                        inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1
                                                        ${
                                                            roleStyles[employee.role] ||
                                                            roleStyles.agent
                                                        }
                                                    `}
                                                >
                                                    {employee.role}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 align-middle text-sm">
                                                {renderPlainAssignment(
                                                    employee.department_name
                                                )}
                                            </td>

                                            <td className="px-5 py-4 align-middle text-sm">
                                                {renderPlainAssignment(
                                                    employee.team_name
                                                )}
                                            </td>

                                            <td className="px-5 py-4 text-center align-middle">
                                                <span
                                                    className={`
                                                        inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1
                                                        ${
                                                            statusStyles[employee.status] ||
                                                            statusStyles.inactive
                                                        }
                                                    `}
                                                >
                                                    {employee.status}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 align-middle">
                                                <div className="flex min-w-[260px] items-center justify-center gap-2">
                                                    <Link
                                                        to={`/admin/employees/${employee.id}`}
                                                        className="inline-flex h-10 w-16 items-center justify-center rounded-lg border border-slate-200 text-sm font-medium text-slate-700 transition hover:bg-white"
                                                    >
                                                        View
                                                    </Link>

                                                    <Link
                                                        to={`/admin/employees/edit/${employee.id}`}
                                                        className="inline-flex h-10 w-16 items-center justify-center rounded-lg bg-slate-950 text-sm font-medium text-white transition hover:bg-slate-800"
                                                    >
                                                        Edit
                                                    </Link>

                                                    <select
                                                        value={employee.status}
                                                        onChange={(e) =>
                                                            handleStatusChange(
                                                                employee.id,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="h-10 w-32 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400"
                                                    >
                                                        <option value="active">
                                                            Active
                                                        </option>
                                                        <option value="inactive">
                                                            Inactive
                                                        </option>
                                                        <option value="suspended">
                                                            Suspended
                                                        </option>
                                                        <option value="terminated">
                                                            Terminated
                                                        </option>
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {employees.length > 0 && (
                        <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-slate-500">
                                Showing {(employeePage - 1) * PAGE_SIZE + 1}-
                                {Math.min(
                                    employeePage * PAGE_SIZE,
                                    employees.length
                                )}{" "}
                                of {employees.length} employees
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setEmployeePage((page) =>
                                            Math.max(1, page - 1)
                                        )
                                    }
                                    disabled={employeePage === 1}
                                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
                                >
                                    Previous
                                </button>

                                <span className="text-sm font-medium text-slate-600">
                                    Page {employeePage} of {employeePageCount}
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setEmployeePage((page) =>
                                            Math.min(
                                                employeePageCount,
                                                page + 1
                                            )
                                        )
                                    }
                                    disabled={
                                        employeePage === employeePageCount
                                    }
                                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 p-5">
                        <h2 className="text-lg font-semibold text-slate-950">
                            Recent Employee Activity
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Latest account changes made by administrators.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[860px]">
                            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                <tr>
                                    <th className="px-5 py-3 text-left font-semibold">
                                        Admin
                                    </th>
                                    <th className="px-5 py-3 text-left font-semibold">
                                        Action
                                    </th>
                                    <th className="px-5 py-3 text-left font-semibold">
                                        Employee
                                    </th>
                                    <th className="px-5 py-3 text-left font-semibold">
                                        Details
                                    </th>
                                    <th className="px-5 py-3 text-left font-semibold">
                                        Date
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {auditLogs.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-5 py-8 text-center text-sm text-slate-500"
                                        >
                                            No recent activity yet.
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedAuditLogs.map((log) => (
                                        <tr key={log.id}>
                                            <td className="px-5 py-4 text-sm font-medium text-slate-900">
                                                {log.actor_name}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-slate-600">
                                                {log.action}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-slate-600">
                                                {log.target_name}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-slate-600">
                                                {log.details}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-slate-500">
                                                {new Date(
                                                    log.created_at
                                                ).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {auditLogs.length > 0 && (
                        <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-slate-500">
                                Showing {(auditPage - 1) * PAGE_SIZE + 1}-
                                {Math.min(
                                    auditPage * PAGE_SIZE,
                                    auditLogs.length
                                )}{" "}
                                of {auditLogs.length} audit entries
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setAuditPage((page) =>
                                            Math.max(1, page - 1)
                                        )
                                    }
                                    disabled={auditPage === 1}
                                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
                                >
                                    Previous
                                </button>

                                <span className="text-sm font-medium text-slate-600">
                                    Page {auditPage} of {auditPageCount}
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setAuditPage((page) =>
                                            Math.min(
                                                auditPageCount,
                                                page + 1
                                            )
                                        )
                                    }
                                    disabled={auditPage === auditPageCount}
                                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Employees;
