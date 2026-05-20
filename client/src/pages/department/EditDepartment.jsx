import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

const EditDepartment = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        code: "",
        description: "",
        head_id: "",
        status: "active"
    });

    const [departments, setDepartments] = useState([]);
    const [heads, setHeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    departmentResponse,
                    departmentsResponse,
                    headsResponse
                ] = await Promise.all([
                    api.get(`/admin/departments/${id}`),
                    api.get("/admin/departments"),
                    api.get("/admin/departments/heads")
                ]);

                setFormData({
                    name: departmentResponse.data.name || "",
                    code: departmentResponse.data.code || "",
                    description:
                        departmentResponse.data.description || "",
                    head_id: departmentResponse.data.head_id || "",
                    status:
                        departmentResponse.data.status || "active"
                });

                setDepartments(departmentsResponse.data);
                setHeads(headsResponse.data);
            } catch (error) {
                console.error("Department fetch failed:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            await api.put(`/admin/departments/${id}`, formData);
            navigate("/admin/departments");
        } catch (error) {
            console.error("Department update failed:", error);
            alert(
                error.response?.data?.message ||
                    "Department update failed"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <h1>Loading department...</h1>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-3xl">
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-sm font-medium text-gray-500">
                            Workforce Structure
                        </p>

                        <h1 className="mt-1 text-3xl font-bold">
                            Edit Department
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Assigning a department head also connects that employee to this department.
                        </p>
                    </div>

                    <Link
                        to="/admin/departments"
                        className="rounded-lg border px-4 py-2 text-sm font-medium"
                    >
                        Back to Departments
                    </Link>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 rounded-xl border bg-white p-6"
                >
                    <label className="block space-y-2">
                        <span className="text-sm font-medium text-gray-700">
                            Department Record
                        </span>

                        <select
                            value={id}
                            onChange={(e) =>
                                navigate(
                                    `/admin/departments/edit/${e.target.value}`
                                )
                            }
                            className="w-full rounded-lg border bg-white p-4"
                        >
                            {departments.map((department) => (
                                <option
                                    key={department.id}
                                    value={department.id}
                                >
                                    {department.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="block space-y-2">
                        <span className="text-sm font-medium text-gray-700">
                            Department Name
                        </span>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full rounded-lg border p-4"
                            required
                        />
                    </label>

                    <label className="block space-y-2">
                        <span className="text-sm font-medium text-gray-700">
                            Department Code
                        </span>

                        <input
                            type="text"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            className="w-full rounded-lg border p-4"
                        />
                    </label>

                    <label className="block space-y-2">
                        <span className="text-sm font-medium text-gray-700">
                            Description
                        </span>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full rounded-lg border p-4"
                        />
                    </label>

                    <label className="block space-y-2">
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
                                    disabled={
                                        Boolean(
                                            head.headed_department_id
                                        ) &&
                                        String(
                                            head.headed_department_id
                                        ) !== String(id)
                                    }
                                    className={
                                        head.headed_department_id &&
                                        String(
                                            head.headed_department_id
                                        ) !== String(id)
                                            ? "text-gray-400"
                                            : "text-gray-900"
                                    }
                                >
                                    {head.fullname} ({head.role})
                                    {head.headed_department_name &&
                                    String(head.headed_department_id) !==
                                        String(id)
                                        ? ` - already heads ${head.headed_department_name}`
                                        : head.department_name
                                          ? ` - ${head.department_name}`
                                          : " - unassigned"}
                                </option>
                            ))}
                        </select>

                        <p className="text-xs text-gray-500">
                            People already heading another department are shown but cannot be selected.
                        </p>
                    </label>

                    <label className="block space-y-2">
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

                    <div className="flex justify-end gap-3 pt-2">
                        <Link
                            to="/admin/departments"
                            className="rounded-lg border px-5 py-3 text-sm font-medium"
                        >
                            Cancel
                        </Link>

                        <button
                            disabled={saving}
                            className="rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                        >
                            {saving ? "Saving..." : "Update Department"}
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default EditDepartment;
