import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

const Departments = () => {
    const [departments, setDepartments] = useState([]);
    const [heads, setHeads] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [showMembers, setShowMembers] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState("");

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

            <div className="mb-10 rounded-xl border p-6">
                <h2 className="text-xl font-semibold">
                    Create Department
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="mt-5 grid gap-4 lg:grid-cols-2"
                >
                    <label className="space-y-2">
                        <span className="text-sm font-medium text-gray-700">
                            Department Name
                        </span>

                        <input
                            type="text"
                            name="name"
                            placeholder="Sales"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full rounded-lg border p-4"
                            required
                        />
                    </label>

                    <label className="space-y-2">
                        <span className="text-sm font-medium text-gray-700">
                            Department Code
                        </span>

                        <input
                            type="text"
                            name="code"
                            placeholder="SALES"
                            value={formData.code}
                            onChange={handleChange}
                            className="w-full rounded-lg border p-4"
                        />
                    </label>

                    <label className="space-y-2">
                        <span className="text-sm font-medium text-gray-700">
                            Department Head
                        </span>

                        <select
                            name="head_id"
                            value={formData.head_id}
                            onChange={handleChange}
                            className="w-full rounded-lg border bg-white p-4"
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
                                    className={
                                        head.headed_department_id
                                            ? "text-gray-400"
                                            : "text-gray-900"
                                    }
                                >
                                    {head.fullname} ({head.role})
                                    {head.headed_department_name
                                        ? ` - already heads ${head.headed_department_name}`
                                        : ""}
                                </option>
                            ))}
                        </select>

                        <p className="text-xs text-gray-500">
                            People already heading another department are shown but cannot be selected.
                        </p>
                    </label>

                    <label className="space-y-2">
                        <span className="text-sm font-medium text-gray-700">
                            Status
                        </span>

                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full rounded-lg border bg-white p-4"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="archived">Archived</option>
                        </select>
                    </label>

                    <label className="space-y-2 lg:col-span-2">
                        <span className="text-sm font-medium text-gray-700">
                            Description
                        </span>

                        <textarea
                            name="description"
                            placeholder="Describe the department's BPO responsibility."
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full rounded-lg border p-4"
                        />
                    </label>

                    <div className="lg:col-span-2">
                        <button className="rounded-lg bg-black px-6 py-3 text-white">
                            Create Department
                        </button>
                    </div>
                </form>
            </div>

            <div className="overflow-hidden rounded-xl border">
                <table className="w-full min-w-[920px]">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4 text-left">Name</th>
                            <th className="p-4 text-left">Code</th>
                            <th className="p-4 text-left">Head</th>
                            <th className="p-4 text-left">Members</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Created</th>
                            <th className="p-4 text-left">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {departments.map((department) => (
                            <tr
                                key={department.id}
                                className="border-t"
                            >
                                <td className="p-4 font-medium">
                                    {department.name}
                                </td>

                                <td className="p-4">
                                    {department.code || "-"}
                                </td>

                                <td className="p-4">
                                    {department.head_name || "Unassigned"}
                                </td>

                                <td className="p-4">
                                    {department.member_count || 0}
                                </td>

                                <td className="p-4 capitalize">
                                    {department.status}
                                </td>

                                <td className="p-4">
                                    {new Date(
                                        department.created_at
                                    ).toLocaleDateString()}
                                </td>

                                <td className="flex gap-2 p-4">
                                    <Link
                                        to={`/admin/departments/edit/${department.id}`}
                                        className="rounded-lg bg-black px-4 py-2 text-sm text-white"
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
                                        className="rounded-lg border px-4 py-2 text-sm"
                                    >
                                        View Members
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showMembers && (
                <div className="mt-10 rounded-xl border p-6">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">
                                {selectedDepartment} Members
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Only employees assigned to this department are shown.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowMembers(false)}
                            className="rounded-lg border px-4 py-2"
                        >
                            Close
                        </button>
                    </div>

                    <table className="w-full min-w-[760px]">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-4 text-left">Employee ID</th>
                                <th className="p-4 text-left">Name</th>
                                <th className="p-4 text-left">Email</th>
                                <th className="p-4 text-left">Role</th>
                                <th className="p-4 text-left">Assignment</th>
                                <th className="p-4 text-left">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {selectedMembers.map((member) => (
                                <tr
                                    key={member.id}
                                    className="border-t"
                                >
                                    <td className="p-4">
                                        {member.employee_id}
                                    </td>

                                    <td className="p-4">
                                        <Link
                                            to={`/admin/employees/${member.id}`}
                                            className="font-medium text-blue-600 hover:underline"
                                        >
                                            {member.fullname}
                                        </Link>
                                    </td>

                                    <td className="p-4">
                                        {member.email}
                                    </td>

                                    <td className="p-4 capitalize">
                                        {member.role}
                                    </td>

                                    <td className="p-4">
                                        {member.assignment_label}
                                    </td>

                                    <td className="p-4 capitalize">
                                        {member.status}
                                    </td>
                                </tr>
                            ))}

                            {selectedMembers.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="p-6 text-center text-sm text-gray-500"
                                    >
                                        No employees are assigned to this department yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </DashboardLayout>
    );
};

export default Departments;
