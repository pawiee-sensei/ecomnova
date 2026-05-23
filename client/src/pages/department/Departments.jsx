import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

const PAGE_SIZE = 8;

const INITIAL_DEPARTMENT_FORM = {
    name: "",
    code: "",
    description: "",
    head_id: "",
    status: "active"
};

const getStatusBadgeClass = (status) => {
    const normalizedStatus = String(status || "").toLowerCase();

    if (normalizedStatus === "inactive") {
        return "bg-amber-50 text-amber-700";
    }

    if (normalizedStatus === "archived") {
        return "bg-slate-100 text-slate-600";
    }

    return "bg-emerald-50 text-emerald-700";
};

const getAssignmentBadgeClass = (assignment) => {
    const normalizedAssignment = String(assignment || "").toLowerCase();

    if (normalizedAssignment.includes("head")) {
        return "bg-indigo-50 text-indigo-700";
    }

    return "bg-slate-100 text-slate-600";
};

const Departments = () => {
    const [departments, setDepartments] = useState([]);
    const [heads, setHeads] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [showMembers, setShowMembers] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [departmentPage, setDepartmentPage] = useState(1);
    const [showCreateDepartment, setShowCreateDepartment] = useState(false);
    const [createError, setCreateError] = useState("");
    const [departmentSearch, setDepartmentSearch] = useState("");
    const [departmentStatusFilter, setDepartmentStatusFilter] = useState("");
    const [
        departmentAssignmentFilter,
        setDepartmentAssignmentFilter
    ] = useState("");
    const [memberSearch, setMemberSearch] = useState("");
    const [creatingDepartment, setCreatingDepartment] = useState(false);
    const [loadingMembers, setLoadingMembers] = useState(false);
    const [toast, setToast] = useState(null);

    const [formData, setFormData] = useState(INITIAL_DEPARTMENT_FORM);

    const fetchDepartments = async () => {
        try {
            const response = await api.get("/admin/departments");
            setDepartments(response.data);
        } catch (error) {
            console.error("Department fetch failed:", error);
        }
    };

    const filteredDepartments = useMemo(() => {
        const normalizedSearch = departmentSearch.trim().toLowerCase();

        return departments.filter((department) => {
            const matchesSearch =
                !normalizedSearch ||
                [
                    department.name,
                    department.code,
                    department.head_name
                ]
                    .filter(Boolean)
                    .some((value) =>
                        String(value)
                            .toLowerCase()
                            .includes(normalizedSearch)
                    );
            const matchesStatus =
                !departmentStatusFilter ||
                department.status === departmentStatusFilter;
            const matchesAssignment =
                !departmentAssignmentFilter ||
                (departmentAssignmentFilter === "unassigned_head" &&
                    !department.head_name) ||
                (departmentAssignmentFilter === "no_members" &&
                    Number(department.member_count || 0) === 0);

            return matchesSearch && matchesStatus && matchesAssignment;
        });
    }, [
        departmentAssignmentFilter,
        departmentSearch,
        departmentStatusFilter,
        departments
    ]);

    const departmentPageCount = Math.max(
        1,
        Math.ceil(filteredDepartments.length / PAGE_SIZE)
    );

    const paginatedDepartments = useMemo(() => {
        const start = (departmentPage - 1) * PAGE_SIZE;

        return filteredDepartments.slice(start, start + PAGE_SIZE);
    }, [departmentPage, filteredDepartments]);

    const sortedSelectedMembers = useMemo(() => {
        const normalizedSearch = memberSearch.trim().toLowerCase();

        return [...selectedMembers].filter((member) => {
            if (!normalizedSearch) {
                return true;
            }

            return [
                member.employee_id,
                member.fullname,
                member.email,
                member.role,
                member.assignment_label
            ]
                .filter(Boolean)
                .some((value) =>
                    String(value)
                        .toLowerCase()
                        .includes(normalizedSearch)
                );
        }).sort((firstMember, secondMember) => {
            const firstIsHead = String(
                firstMember.assignment_label || ""
            )
                .toLowerCase()
                .includes("head");
            const secondIsHead = String(
                secondMember.assignment_label || ""
            )
                .toLowerCase()
                .includes("head");

            return Number(secondIsHead) - Number(firstIsHead);
        });
    }, [memberSearch, selectedMembers]);

    useEffect(() => {
        setDepartmentPage((page) =>
            Math.min(page, departmentPageCount)
        );
    }, [departmentPageCount]);

    useEffect(() => {
        setDepartmentPage(1);
    }, [
        departmentAssignmentFilter,
        departmentSearch,
        departmentStatusFilter
    ]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [
                    departmentsResponse,
                    headsResponse
                ] = await Promise.all([
                    api.get("/admin/departments"),
                    api.get("/admin/departments/heads")
                ]);

                setDepartments(departmentsResponse.data);
                setHeads(headsResponse.data);
            } catch (error) {
                console.error(
                    "Department setup fetch failed:",
                    error
                );
            }
        };

        fetchInitialData();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        window.setTimeout(() => setToast(null), 3000);
    };

    const resetForm = () => {
        setFormData(INITIAL_DEPARTMENT_FORM);
    };

    const closeCreateDepartment = () => {
        resetForm();
        setCreateError("");
        setShowCreateDepartment(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCreateError("");

        try {
            setCreatingDepartment(true);
            await api.post("/admin/departments", formData);
            await fetchDepartments();

            resetForm();
            setShowCreateDepartment(false);
            showToast("Department created.");
        } catch (error) {
            console.error("Department creation failed:", error);
            setCreateError(
                error.response?.data?.message ||
                    "Department creation failed. Please check the details and try again."
            );
            showToast("Department creation failed.", "error");
        } finally {
            setCreatingDepartment(false);
        }
    };

    const handleViewMembers = async (
        departmentId,
        departmentName
    ) => {
        try {
            setLoadingMembers(true);
            const response = await api.get(
                `/admin/departments/${departmentId}/members`
            );

            setSelectedMembers(response.data);
            setSelectedDepartment(departmentName);
            setMemberSearch("");
            setShowCreateDepartment(false);
            setShowMembers(true);
        } catch (error) {
            console.error("Member fetch failed:", error);
            showToast("Department members could not be loaded.", "error");
        } finally {
            setLoadingMembers(false);
        }
    };

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

            <div className="mb-8">
                <p className="text-sm font-medium text-gray-500">
                    Workforce Structure
                </p>

                <h1 className="mt-1 text-3xl font-bold">
                    Department Management
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    Keep BPO departments, department heads, and assigned members connected.
                </p>
            </div>

            <div>
                <div className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-950">
                                Department Directory
                            </h2>

                            <p className="text-sm text-slate-500">
                                {filteredDepartments.length} of {departments.length} departments
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setShowMembers(false);
                                setShowCreateDepartment(true);
                            }}
                            className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                        >
                            Create Department
                        </button>
                    </div>

                    <div className="grid gap-3 border-b border-slate-200 p-5 lg:grid-cols-[1fr_180px_220px]">
                        <input
                            type="text"
                            value={departmentSearch}
                            onChange={(event) =>
                                setDepartmentSearch(event.target.value)
                            }
                            placeholder="Search departments, code, or head"
                            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                        />

                        <select
                            value={departmentStatusFilter}
                            onChange={(event) =>
                                setDepartmentStatusFilter(
                                    event.target.value
                                )
                            }
                            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                        >
                            <option value="">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="archived">Archived</option>
                        </select>

                        <select
                            value={departmentAssignmentFilter}
                            onChange={(event) =>
                                setDepartmentAssignmentFilter(
                                    event.target.value
                                )
                            }
                            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                        >
                            <option value="">All Departments</option>
                            <option value="unassigned_head">
                                Unassigned Head
                            </option>
                            <option value="no_members">No Members</option>
                        </select>
                    </div>

                    <div className="hidden lg:block">
                        <table className="w-full table-fixed">
                            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                <tr>
                                    <th className="w-[22%] px-4 py-3 text-left font-semibold">Name</th>
                                    <th className="w-[10%] px-4 py-3 text-center font-semibold">Code</th>
                                    <th className="w-[20%] px-4 py-3 text-left font-semibold">Head</th>
                                    <th className="w-[10%] px-4 py-3 text-center font-semibold">Members</th>
                                    <th className="w-[12%] px-4 py-3 text-center font-semibold">Status</th>
                                    <th className="w-[26%] px-4 py-3 text-center font-semibold">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {paginatedDepartments.map((department) => (
                                    <tr
                                        key={department.id}
                                        className="transition hover:bg-slate-50"
                                    >
                                        <td className="px-4 py-4 align-middle font-medium text-slate-950">
                                            {department.name}
                                        </td>

                                        <td className="px-4 py-4 text-center align-middle text-sm text-slate-600">
                                            {department.code || "-"}
                                        </td>

                                        <td className="px-4 py-4 align-middle text-sm">
                                            {department.head_name ? (
                                                <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                                                    {department.head_name}
                                                </span>
                                            ) : (
                                                <span className="inline-flex rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
                                                    Unassigned
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-4 py-4 text-center align-middle text-sm text-slate-600">
                                            {department.member_count || 0}
                                        </td>

                                        <td className="px-4 py-4 text-center align-middle">
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getStatusBadgeClass(department.status)}`}>
                                                {department.status}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4 align-middle">
                                            <div className="flex min-w-[210px] justify-center gap-2 whitespace-nowrap">
                                                <Link
                                                    to={`/admin/departments/edit/${department.id}`}
                                                    className="inline-flex h-10 w-16 items-center justify-center rounded-lg bg-slate-950 text-sm font-medium text-white hover:bg-slate-800"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleViewMembers(
                                                            department.id,
                                                            department.name
                                                        )
                                                    }
                                                    disabled={loadingMembers}
                                                    className="inline-flex h-10 w-32 items-center justify-center rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                                                >
                                                    {loadingMembers ? "Loading..." : "View Members"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {filteredDepartments.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-5 py-12 text-center"
                                        >
                                            <div className="mx-auto max-w-sm">
                                                <p className="text-sm font-medium text-slate-950">
                                                    No departments found.
                                                </p>

                                                <p className="mt-1 text-sm text-slate-500">
                                                    Try changing your search or filters.
                                                </p>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowCreateDepartment(true)
                                                    }
                                                    className="mt-4 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                                                >
                                                    Create Department
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="divide-y divide-slate-100 lg:hidden">
                        {paginatedDepartments.map((department) => (
                            <div
                                key={department.id}
                                className="p-5"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="font-semibold text-slate-950">
                                            {department.name}
                                        </h3>

                                        <div className="mt-2 flex flex-wrap gap-2">
                                            <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                                {department.code || "No code"}
                                            </span>

                                            {department.head_name ? (
                                                <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                                                    Head: {department.head_name}
                                                </span>
                                            ) : (
                                                <span className="inline-flex rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
                                                    Head unassigned
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getStatusBadgeClass(department.status)}`}>
                                        {department.status}
                                    </span>
                                </div>

                                <dl className="mt-4 text-sm">
                                    <div>
                                        <dt className="text-xs font-semibold uppercase text-slate-400">
                                            Members
                                        </dt>
                                        <dd className="mt-1 text-slate-700">
                                            {department.member_count || 0}
                                        </dd>
                                    </div>
                                </dl>

                                <div className="mt-4 flex gap-2">
                                    <Link
                                        to={`/admin/departments/edit/${department.id}`}
                                        className="rounded-lg bg-slate-950 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
                                    >
                                        Edit
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleViewMembers(
                                                department.id,
                                                department.name
                                            )
                                        }
                                        disabled={loadingMembers}
                                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                                    >
                                        {loadingMembers ? "Loading..." : "View Members"}
                                    </button>
                                </div>
                            </div>
                        ))}

                        {filteredDepartments.length === 0 && (
                            <div className="p-6 text-center">
                                <p className="text-sm font-medium text-slate-950">
                                    No departments found.
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    Try changing your search or filters.
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowCreateDepartment(true)
                                    }
                                    className="mt-4 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                                >
                                    Create Department
                                </button>
                            </div>
                        )}
                    </div>

                    {filteredDepartments.length > 0 && (
                        <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-slate-500">
                                Showing {(departmentPage - 1) * PAGE_SIZE + 1}-
                                {Math.min(
                                    departmentPage * PAGE_SIZE,
                                    filteredDepartments.length
                                )}{" "}
                                of {filteredDepartments.length} departments
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setDepartmentPage((page) =>
                                            Math.max(1, page - 1)
                                        )
                                    }
                                    disabled={departmentPage === 1}
                                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
                                >
                                    Previous
                                </button>

                                <span className="text-sm font-medium text-slate-600">
                                    Page {departmentPage} of {departmentPageCount}
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setDepartmentPage((page) =>
                                            Math.min(
                                                departmentPageCount,
                                                page + 1
                                            )
                                        )
                                    }
                                    disabled={
                                        departmentPage === departmentPageCount
                                    }
                                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showCreateDepartment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
                    <div className="max-h-[88vh] w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-xl">
                        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
                            <div>
                                <h2 className="text-xl font-bold text-slate-950">
                                    Create Department
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Add a department and assign an optional head.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeCreateDepartment}
                                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                Close
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="grid max-h-[72vh] gap-4 overflow-auto p-5 sm:grid-cols-2"
                        >
                            {createError && (
                                <p className="rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700 sm:col-span-2">
                                    {createError}
                                </p>
                            )}

                            <label className="space-y-2">
                                <span className="text-sm font-medium text-slate-700">
                                    Department Name
                                </span>

                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Sales"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                                    required
                                />
                            </label>

                            <label className="space-y-2">
                                <span className="text-sm font-medium text-slate-700">
                                    Department Code
                                </span>

                                <input
                                    type="text"
                                    name="code"
                                    placeholder="SALES"
                                    value={formData.code}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                                />
                            </label>

                            <label className="space-y-2">
                                <span className="text-sm font-medium text-slate-700">
                                    Department Head
                                </span>

                                <select
                                    name="head_id"
                                    value={formData.head_id}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                                >
                                    <option value="">
                                        Unassigned Department Head
                                    </option>

                                    {heads.map((head) => (
                                        <option
                                            key={head.id}
                                            value={head.id}
                                            disabled={Boolean(
                                                head.headed_department_id
                                            )}
                                        >
                                            {head.fullname} ({head.role})
                                            {head.headed_department_name
                                                ? ` - already heads ${head.headed_department_name}`
                                                : ""}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="space-y-2">
                                <span className="text-sm font-medium text-slate-700">
                                    Status
                                </span>

                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </label>

                            <label className="space-y-2 sm:col-span-2">
                                <span className="text-sm font-medium text-slate-700">
                                    Description
                                </span>

                                <textarea
                                    name="description"
                                    rows="3"
                                    placeholder="Describe this department."
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                                />
                            </label>

                            <div className="flex justify-end gap-2 sm:col-span-2">
                                <button
                                    type="button"
                                    onClick={closeCreateDepartment}
                                    className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    disabled={creatingDepartment}
                                    className="rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                                >
                                    {creatingDepartment
                                        ? "Creating..."
                                        : "Create Department"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showMembers && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
                    <div className="max-h-[85vh] w-full max-w-5xl overflow-hidden rounded-xl bg-white shadow-xl">
                        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
                            <div>
                                <h2 className="text-xl font-bold text-slate-950">
                                    {selectedDepartment} Members
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Only employees assigned to this department are shown.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowMembers(false)}
                                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                Close
                            </button>
                        </div>

                        <div className="max-h-[65vh] overflow-auto">
                            <div className="border-b border-slate-200 p-5">
                                <input
                                    type="text"
                                    value={memberSearch}
                                    onChange={(event) =>
                                        setMemberSearch(event.target.value)
                                    }
                                    placeholder="Search department members"
                                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                                />
                            </div>

                            <table className="w-full min-w-[760px] table-fixed">
                                <thead className="sticky top-0 bg-slate-50 text-xs uppercase text-slate-500">
                                    <tr>
                                        <th className="w-[17%] px-5 py-3 text-left font-semibold">Employee ID</th>
                                        <th className="w-[18%] px-5 py-3 text-left font-semibold">Name</th>
                                        <th className="w-[22%] px-5 py-3 text-left font-semibold">Email</th>
                                        <th className="w-[12%] px-5 py-3 text-center font-semibold">Role</th>
                                        <th className="w-[18%] px-5 py-3 text-center font-semibold">Assignment</th>
                                        <th className="w-[13%] px-5 py-3 text-center font-semibold">Status</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {sortedSelectedMembers.map((member) => (
                                        <tr key={member.id}>
                                            <td className="px-5 py-4 align-middle text-sm text-slate-600">
                                                {member.employee_id}
                                            </td>

                                            <td className="px-5 py-4 align-middle">
                                                <Link
                                                    to={`/admin/employees/${member.id}`}
                                                    className="font-medium text-slate-950 hover:underline"
                                                >
                                                    {member.fullname}
                                                </Link>
                                            </td>

                                            <td className="px-5 py-4 align-middle text-sm text-slate-600">
                                                {member.email}
                                            </td>

                                            <td className="px-5 py-4 text-center align-middle text-sm capitalize text-slate-700">
                                                {member.role}
                                            </td>

                                            <td className="px-5 py-4 text-center align-middle">
                                                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getAssignmentBadgeClass(member.assignment_label)}`}>
                                                    {member.assignment_label}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 text-center align-middle">
                                                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getStatusBadgeClass(member.status)}`}>
                                                    {member.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}

                                    {selectedMembers.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="px-5 py-10 text-center text-sm text-slate-500"
                                            >
                                                No employees are assigned to this department yet.
                                            </td>
                                        </tr>
                                    )}

                                    {selectedMembers.length > 0 &&
                                        sortedSelectedMembers.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan="6"
                                                    className="px-5 py-10 text-center text-sm text-slate-500"
                                                >
                                                    No department members match your search.
                                                </td>
                                            </tr>
                                        )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default Departments;
