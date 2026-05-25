import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import api from "../../../services/api";

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
                    api.get(`/hr/departments/${id}`),
                    api.get("/hr/departments"),
                    api.get("/hr/departments/heads")
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
            await api.put(`/hr/departments/${id}`, formData);
            navigate("/hr/departments");
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
                <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        Loading department...
                    </p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="mx-auto max-w-4xl">
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-sm font-medium text-slate-500">
                            Workforce Structure
                        </p>

                        <h1 className="mt-1 text-3xl font-bold text-slate-950">
                            Edit Department
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Assigning a department head also connects that employee to this department.
                        </p>
                    </div>

                    <Link
                        to="/hr/departments"
                        className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Back to Departments
                    </Link>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="space-y-2 md:col-span-2">
                            <span className="text-sm font-medium text-slate-700">
                                Department Record
                            </span>

                            <select
                                value={id}
                                onChange={(e) =>
                                    navigate(
                                        `/hr/departments/edit/${e.target.value}`
                                    )
                                }
                                className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
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

                        <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-700">
                                Department Name
                            </span>

                            <input
                                type="text"
                                name="name"
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
                                        disabled={
                                            Boolean(
                                                head.headed_department_id
                                            ) &&
                                            String(
                                                head.headed_department_id
                                            ) !== String(id)
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

                        <label className="space-y-2 md:col-span-2">
                            <span className="text-sm font-medium text-slate-700">
                                Description
                            </span>

                            <textarea
                                name="description"
                                rows="4"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                            />
                        </label>
                    </div>

                    <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-5">
                        <Link
                            to="/hr/departments"
                            className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Cancel
                        </Link>

                        <button
                            disabled={saving}
                            className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
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


