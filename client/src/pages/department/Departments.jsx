import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

const PAGE_SIZE = 8;

const Departments = () => {
    const [departments, setDepartments] = useState([]);
    const [heads, setHeads] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [showMembers, setShowMembers] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [departmentPage, setDepartmentPage] = useState(1);
    const [showCreateDepartment, setShowCreateDepartment] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        code: "",
        description: "",
        head_id: "",
        status: "active"
    });

    const fetchDepartments = async () => {
        try {
            const response = await api.get("/admin/departments");
            setDepartments(response.data);
        } catch (error) {
            console.error("Department fetch failed:", error);
        }
    };

    const departmentPageCount = Math.max(
        1,
        Math.ceil(departments.length / PAGE_SIZE)
    );

    const paginatedDepartments = useMemo(() => {
        const start = (departmentPage - 1) * PAGE_SIZE;

        return departments.slice(start, start + PAGE_SIZE);
    }, [departmentPage, departments]);

    useEffect(() => {
        setDepartmentPage((page) =>
            Math.min(page, departmentPageCount)
        );
    }, [departmentPageCount]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post("/admin/departments", formData);
            await fetchDepartments();

            setFormData({
                name: "",
                code: "",
                description: "",
                head_id: "",
                status: "active"
            });
            setShowCreateDepartment(false);
        } catch (error) {
            console.error("Department creation failed:", error);
            alert(
                error.response?.data?.message ||
                    "Department creation failed"
            );
        }
    };

    const handleViewMembers = async (
        departmentId,
        departmentName
    ) => {
        try {
            const response = await api.get(
                `/admin/departments/${departmentId}/members`
            );

            setSelectedMembers(response.data);
            setSelectedDepartment(departmentName);
            setShowMembers(true);
        } catch (error) {
            console.error("Member fetch failed:", error);
        }
    };

    return (
        <DashboardLayout>
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
                                {departments.length} total departments
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowCreateDepartment(true)}
                            className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                        >
                            Create Department
                        </button>
                    </div>

                    <div className="hidden lg:block">
                        <table className="w-full table-fixed">
                            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                <tr>
                                    <th className="w-[24%] px-4 py-3 text-left font-semibold">Name</th>
                                    <th className="w-[12%] px-4 py-3 text-left font-semibold">Code</th>
                                    <th className="w-[24%] px-4 py-3 text-left font-semibold">Head</th>
                                    <th className="w-[12%] px-4 py-3 text-left font-semibold">Members</th>
                                    <th className="w-[14%] px-4 py-3 text-left font-semibold">Status</th>
                                    <th className="w-[14%] px-4 py-3 text-right font-semibold">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {paginatedDepartments.map((department) => (
                                    <tr
                                        key={department.id}
                                        className="transition hover:bg-slate-50"
                                    >
                                        <td className="px-4 py-4 font-medium text-slate-950">
                                            {department.name}
                                        </td>

                                        <td className="px-4 py-4 text-sm text-slate-600">
                                            {department.code || "-"}
                                        </td>

                                        <td className="px-4 py-4 text-sm text-slate-600">
                                            {department.head_name || "Unassigned"}
                                        </td>

                                        <td className="px-4 py-4 text-sm text-slate-600">
                                            {department.member_count || 0}
                                        </td>

                                        <td className="px-4 py-4">
                                            <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold capitalize text-emerald-700">
                                                {department.status}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="flex justify-end gap-2 whitespace-nowrap">
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
                                                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                                >
                                                    Members
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
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

                                        <p className="mt-1 text-sm text-slate-500">
                                            {department.code || "No code"} / {department.head_name || "Unassigned"}
                                        </p>
                                    </div>

                                    <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold capitalize text-emerald-700">
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
                                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                    >
                                        Members
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {departments.length > 0 && (
                        <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-slate-500">
                                Showing {(departmentPage - 1) * PAGE_SIZE + 1}-
                                {Math.min(
                                    departmentPage * PAGE_SIZE,
                                    departments.length
                                )}{" "}
                                of {departments.length} departments
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
                                onClick={() =>
                                    setShowCreateDepartment(false)
                                }
                                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                Close
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="grid max-h-[72vh] gap-4 overflow-auto p-5 sm:grid-cols-2"
                        >
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
                                    onClick={() =>
                                        setShowCreateDepartment(false)
                                    }
                                    className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>

                                <button className="rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
                                    Create Department
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
                            <table className="w-full min-w-[760px]">
                                <thead className="sticky top-0 bg-slate-50 text-xs uppercase text-slate-500">
                                    <tr>
                                        <th className="px-5 py-3 text-left font-semibold">Employee ID</th>
                                        <th className="px-5 py-3 text-left font-semibold">Name</th>
                                        <th className="px-5 py-3 text-left font-semibold">Email</th>
                                        <th className="px-5 py-3 text-left font-semibold">Role</th>
                                        <th className="px-5 py-3 text-left font-semibold">Assignment</th>
                                        <th className="px-5 py-3 text-left font-semibold">Status</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {selectedMembers.map((member) => (
                                        <tr key={member.id}>
                                            <td className="px-5 py-4 text-sm text-slate-600">
                                                {member.employee_id}
                                            </td>

                                            <td className="px-5 py-4">
                                                <Link
                                                    to={`/admin/employees/${member.id}`}
                                                    className="font-medium text-slate-950 hover:underline"
                                                >
                                                    {member.fullname}
                                                </Link>
                                            </td>

                                            <td className="px-5 py-4 text-sm text-slate-600">
                                                {member.email}
                                            </td>

                                            <td className="px-5 py-4 text-sm capitalize text-slate-700">
                                                {member.role}
                                            </td>

                                            <td className="px-5 py-4 text-sm text-slate-600">
                                                {member.assignment_label}
                                            </td>

                                            <td className="px-5 py-4 text-sm capitalize text-slate-700">
                                                {member.status}
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
