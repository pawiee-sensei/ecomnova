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

const terminationReasons = [
    "Resigned",
    "Contract Ended",
    "Policy Violation",
    "Other"
];

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
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);
    const [bulkStatus, setBulkStatus] = useState("");
    const [bulkUpdating, setBulkUpdating] = useState(false);
    const [updatingEmployeeId, setUpdatingEmployeeId] = useState(null);
    const [pendingBulkStatus, setPendingBulkStatus] = useState("");
    const [pendingStatusChange, setPendingStatusChange] = useState(null);
    const [lifecycleReason, setLifecycleReason] = useState("");
    const [toast, setToast] = useState(null);

    const stats = useMemo(() => {
        const active = employees.filter(
            (employee) => employee.status === "active"
        ).length;

        return {
            total: employees.length,
            active,
            inactive: employees.length - active,
            unassignedDepartment: employees.filter(
                (employee) => !employee.department_name
            ).length,
            unassignedTeam: employees.filter(
                (employee) => !employee.team_name
            ).length,
            unassignedManager: employees.filter(
                (employee) => !employee.manager_name
            ).length
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

    const visibleEmployeeIds = useMemo(
        () => paginatedEmployees.map((employee) => employee.id),
        [paginatedEmployees]
    );

    const selectedVisibleCount = useMemo(
        () =>
            visibleEmployeeIds.filter((employeeId) =>
                selectedEmployeeIds.includes(employeeId)
            ).length,
        [selectedEmployeeIds, visibleEmployeeIds]
    );

    const allVisibleSelected =
        visibleEmployeeIds.length > 0 &&
        selectedVisibleCount === visibleEmployeeIds.length;

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
        setSelectedEmployeeIds([]);
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

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        window.setTimeout(() => setToast(null), 3000);
    };

    const performStatusChange = async (
        employeeId,
        newStatus
    ) => {
        try {
            setUpdatingEmployeeId(employeeId);
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
            showToast("Employee status updated.");
            return true;

        } catch (error) {
            console.error(
                "Status update failed:",
                error
            );
            showToast("Status update failed.", "error");
            return false;
        } finally {
            setUpdatingEmployeeId(null);
        }
    };

    const handleStatusChange = async (
        employee,
        newStatus
    ) => {
        if (!newStatus || newStatus === employee.status) {
            return;
        }

        if (["suspended", "terminated"].includes(newStatus)) {
            setPendingStatusChange({
                employeeId: employee.id,
                employeeName: employee.fullname,
                status: newStatus
            });
            setLifecycleReason("");
            return;
        }

        await performStatusChange(employee.id, newStatus);
    };

    const handleEmployeeSelection = (employeeId) => {
        setSelectedEmployeeIds((currentSelection) =>
            currentSelection.includes(employeeId)
                ? currentSelection.filter((id) => id !== employeeId)
                : [...currentSelection, employeeId]
        );
    };

    const handleSelectVisibleEmployees = () => {
        setSelectedEmployeeIds((currentSelection) => {
            if (allVisibleSelected) {
                return currentSelection.filter(
                    (employeeId) =>
                        !visibleEmployeeIds.includes(employeeId)
                );
            }

            return Array.from(
                new Set([
                    ...currentSelection,
                    ...visibleEmployeeIds
                ])
            );
        });
    };

    const performBulkStatusUpdate = async (status) => {
        if (!status || selectedEmployeeIds.length === 0) {
            return;
        }

        try {
            setBulkUpdating(true);
            await Promise.all(
                selectedEmployeeIds.map((employeeId) =>
                    api.patch(
                        `/admin/employees/${employeeId}/status`,
                        {
                            status
                        }
                    )
                )
            );

            setEmployees((currentEmployees) =>
                currentEmployees.map((employee) =>
                    selectedEmployeeIds.includes(employee.id)
                        ? {
                            ...employee,
                            status
                        }
                        : employee
                )
            );
            setSelectedEmployeeIds([]);
            setBulkStatus("");
            setPendingBulkStatus("");
            setLifecycleReason("");
            await fetchAuditLogs();
            showToast("Bulk status update complete.");
        } catch (error) {
            console.error(
                "Bulk status update failed:",
                error
            );
            showToast("Bulk status update failed.", "error");
        } finally {
            setBulkUpdating(false);
        }
    };

    const handleBulkStatusUpdate = async () => {
        if (!bulkStatus || selectedEmployeeIds.length === 0) {
            return;
        }

        if (["suspended", "terminated"].includes(bulkStatus)) {
            setPendingBulkStatus(bulkStatus);
            setLifecycleReason("");
            return;
        }

        await performBulkStatusUpdate(bulkStatus);
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
            {toast && (
                <div className="fixed right-5 top-5 z-[60]">
                    <div
                        className={`rounded-lg border px-4 py-3 text-sm font-medium shadow-lg ${
                            toast.type === "error"
                                ? "border-rose-100 bg-rose-50 text-rose-700"
                                : "border-emerald-100 bg-emerald-50 text-emerald-700"
                        }`}
                    >
                        {toast.message}
                    </div>
                </div>
            )}

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

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
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

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            No Department
                        </p>

                        <p className="mt-2 text-3xl font-bold text-rose-600">
                            {stats.unassignedDepartment}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            No Team
                        </p>

                        <p className="mt-2 text-3xl font-bold text-rose-600">
                            {stats.unassignedTeam}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-slate-500">
                            No Manager
                        </p>

                        <p className="mt-2 text-3xl font-bold text-rose-600">
                            {stats.unassignedManager}
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

                        {selectedEmployeeIds.length > 0 && (
                            <div className="mt-4 flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm font-medium text-slate-700">
                                    {selectedEmployeeIds.length} selected
                                </p>

                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                    <select
                                        value={bulkStatus}
                                        onChange={(event) =>
                                            setBulkStatus(
                                                event.target.value
                                            )
                                        }
                                        className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400"
                                    >
                                        <option value="">
                                            Select status
                                        </option>
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

                                    <button
                                        type="button"
                                        onClick={handleBulkStatusUpdate}
                                        disabled={!bulkStatus || bulkUpdating}
                                        className="h-10 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                                    >
                                        {bulkUpdating ? "Updating..." : "Apply"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedEmployeeIds([]);
                                            setBulkStatus("");
                                        }}
                                        className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1180px] table-fixed">
                            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                <tr>
                                    <th className="w-[4%] px-5 py-3 text-center font-semibold">
                                        <input
                                            type="checkbox"
                                            checked={allVisibleSelected}
                                            onChange={handleSelectVisibleEmployees}
                                            aria-label="Select visible employees"
                                        />
                                    </th>
                                    <th className="w-[17%] px-5 py-3 text-left font-semibold">
                                        Employee
                                    </th>
                                    <th className="w-[17%] px-5 py-3 text-left font-semibold">
                                        Email
                                    </th>
                                    <th className="w-[9%] px-5 py-3 text-center font-semibold">
                                        Role
                                    </th>
                                    <th className="w-[11%] px-5 py-3 text-left font-semibold">
                                        Department
                                    </th>
                                    <th className="w-[9%] px-5 py-3 text-left font-semibold">
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
                                            colSpan="8"
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
                                            <td className="px-5 py-4 text-center align-middle">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedEmployeeIds.includes(
                                                        employee.id
                                                    )}
                                                    onChange={() =>
                                                        handleEmployeeSelection(
                                                            employee.id
                                                        )
                                                    }
                                                    aria-label={`Select ${employee.fullname}`}
                                                />
                                            </td>

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
                                                                employee,
                                                                e.target.value
                                                            )
                                                        }
                                                        disabled={
                                                            updatingEmployeeId ===
                                                            employee.id
                                                        }
                                                        className="h-10 w-32 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400 disabled:opacity-60"
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

            {pendingBulkStatus && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
                        <div className="border-b border-slate-200 p-5">
                            <h2 className="text-lg font-bold text-slate-950">
                                Confirm Bulk Status Change
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                This will mark {selectedEmployeeIds.length} selected employees as {pendingBulkStatus}.
                            </p>

                            {pendingBulkStatus === "terminated" && (
                                <label className="mt-4 block space-y-2">
                                    <span className="text-sm font-medium text-slate-700">
                                        Reason
                                    </span>

                                    <select
                                        value={lifecycleReason}
                                        onChange={(event) =>
                                            setLifecycleReason(
                                                event.target.value
                                            )
                                        }
                                        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                                    >
                                        <option value="">
                                            Select reason
                                        </option>

                                        {terminationReasons.map((reason) => (
                                            <option
                                                key={reason}
                                                value={reason}
                                            >
                                                {reason}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 p-5">
                            <button
                                type="button"
                                onClick={() => {
                                    setPendingBulkStatus("");
                                    setLifecycleReason("");
                                }}
                                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    performBulkStatusUpdate(
                                        pendingBulkStatus
                                    )
                                }
                                disabled={
                                    bulkUpdating ||
                                    (pendingBulkStatus ===
                                        "terminated" &&
                                        !lifecycleReason)
                                }
                                className="rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                            >
                                {bulkUpdating ? "Updating..." : "Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {pendingStatusChange && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
                        <div className="border-b border-slate-200 p-5">
                            <h2 className="text-lg font-bold text-slate-950">
                                {pendingStatusChange.status ===
                                "terminated"
                                    ? "Terminate Employee"
                                    : "Suspend Employee"}
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                {pendingStatusChange.status ===
                                "terminated"
                                    ? `Terminate employee ${pendingStatusChange.employeeName}? This marks the employee as no longer employed.`
                                    : `Suspend employee ${pendingStatusChange.employeeName}? This may temporarily remove the employee from workforce activity.`}
                            </p>

                            {pendingStatusChange.status ===
                                "terminated" && (
                                <label className="mt-4 block space-y-2">
                                    <span className="text-sm font-medium text-slate-700">
                                        Reason
                                    </span>

                                    <select
                                        value={lifecycleReason}
                                        onChange={(event) =>
                                            setLifecycleReason(
                                                event.target.value
                                            )
                                        }
                                        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                                    >
                                        <option value="">
                                            Select reason
                                        </option>

                                        {terminationReasons.map((reason) => (
                                            <option
                                                key={reason}
                                                value={reason}
                                            >
                                                {reason}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 p-5">
                            <button
                                type="button"
                                onClick={() => {
                                    setPendingStatusChange(null);
                                    setLifecycleReason("");
                                }}
                                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={async () => {
                                    const didUpdate =
                                        await performStatusChange(
                                        pendingStatusChange.employeeId,
                                        pendingStatusChange.status
                                    );

                                    if (didUpdate) {
                                        setPendingStatusChange(null);
                                        setLifecycleReason("");
                                    }
                                }}
                                disabled={
                                    updatingEmployeeId ===
                                        pendingStatusChange.employeeId ||
                                    (pendingStatusChange.status ===
                                        "terminated" &&
                                        !lifecycleReason)
                                }
                                className="rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                            >
                                {updatingEmployeeId ===
                                pendingStatusChange.employeeId
                                    ? "Updating..."
                                    : pendingStatusChange.status ===
                                      "terminated"
                                      ? "Confirm Termination"
                                      : "Confirm Suspend"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default Employees;
