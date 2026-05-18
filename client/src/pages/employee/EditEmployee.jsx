import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

const EditEmployee = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        role: "",
        department_id: "",
        team_id: "",
        manager_id: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await api.get(
                    `/admin/employees/${id}`
                );

                setFormData({
                    fullname: response.data.fullname || "",
                    email: response.data.email || "",
                    role: response.data.role || "",
                    department_id:
                        response.data.department_id || "",
                    team_id:
                        response.data.team_id || "",
                    manager_id:
                        response.data.manager_id || ""
                });

            } catch (error) {
                console.error(
                    "Employee fetch failed:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();
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

            await api.put(
                `/admin/employees/${id}`,
                formData
            );

            navigate("/admin/employees");

        } catch (error) {
            console.error(
                "Update failed:",
                error
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
                        Loading employee profile...
                    </p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="mx-auto max-w-5xl space-y-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-sm font-medium text-slate-500">
                            Employee Profile
                        </p>

                        <h1 className="mt-1 text-3xl font-bold text-slate-950">
                            Edit Employee
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Update identity, permissions, and reporting assignments.
                        </p>
                    </div>

                    <Link
                        to={`/admin/employees/${id}`}
                        className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                        View Profile
                    </Link>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-xl border border-slate-200 bg-white shadow-sm"
                >
                    <div className="border-b border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-950">
                            Employee Information
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Keep account data accurate for routing, permissions, and audit records.
                        </p>
                    </div>

                    <div className="grid gap-5 p-6 md:grid-cols-2">
                        <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-700">
                                Full Name
                            </span>

                            <input
                                type="text"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                                required
                            />
                        </label>

                        <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-700">
                                Email Address
                            </span>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                                required
                            />
                        </label>

                        <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-700">
                                Role
                            </span>

                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                            >
                                <option value="agent">Agent</option>
                                <option value="leader">Team Leader</option>
                                <option value="manager">Manager</option>
                                <option value="hr">HR</option>
                                <option value="qa">QA</option>
                                <option value="admin">Admin</option>
                            </select>
                        </label>

                        <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-700">
                                Department
                            </span>

                            <select
                                name="department_id"
                                value={formData.department_id}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                            >
                                <option value="">Unassigned Department</option>
                                <option value="1">Technical Support</option>
                                <option value="2">Billing</option>
                                <option value="3">Retention</option>
                                <option value="4">QA</option>
                                <option value="5">HR</option>
                            </select>
                        </label>

                        <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-700">
                                Team
                            </span>

                            <select
                                name="team_id"
                                value={formData.team_id}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                            >
                                <option value="">Unassigned Team</option>
                                <option value="1">Team Alpha</option>
                                <option value="2">Team Bravo</option>
                                <option value="3">Team Charlie</option>
                            </select>
                        </label>

                        <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-700">
                                Manager
                            </span>

                            <select
                                name="manager_id"
                                value={formData.manager_id}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                            >
                                <option value="">Unassigned Manager</option>
                                <option value="1">Admin User</option>
                                <option value="2">John Manager</option>
                            </select>
                        </label>
                    </div>

                    <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 p-6 sm:flex-row sm:justify-end">
                        <Link
                            to="/admin/employees"
                            className="inline-flex justify-center rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex justify-center rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving
                                ? "Saving..."
                                : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default EditEmployee;
