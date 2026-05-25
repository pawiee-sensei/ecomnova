import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import api from "../../../services/api";

const EditTeam = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        code: "",
        department_id: "",
        description: "",
        leader_id: "",
        status: "active"
    });

    const [departments, setDepartments] = useState([]);
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    teamResponse,
                    departmentsResponse,
                    leadersResponse
                ] = await Promise.all([
                    api.get(`/hr/teams/${id}`),
                    api.get("/hr/teams/departments"),
                    api.get("/hr/teams/leaders")
                ]);

                setFormData({
                    name: teamResponse.data.name || "",
                    code: teamResponse.data.code || "",
                    department_id:
                        teamResponse.data.department_id || "",
                    description:
                        teamResponse.data.description || "",
                    leader_id: teamResponse.data.leader_id || "",
                    status: teamResponse.data.status || "active"
                });

                setDepartments(departmentsResponse.data);
                setLeaders(leadersResponse.data);
            } catch (error) {
                console.error("Team fetch failed:", error);
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
            await api.put(`/hr/teams/${id}`, formData);
            navigate("/hr/teams");
        } catch (error) {
            console.error("Team update failed:", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        Loading team...
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
                            Edit Team
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Keep this team aligned with its department, leader, and staffing workflow.
                        </p>
                    </div>

                    <Link
                        to="/hr/teams"
                        className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Back to Teams
                    </Link>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="space-y-2">
                            <span className="text-sm font-medium text-slate-700">
                                Team Name
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
                                Team Code
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
                                Department
                            </span>

                            <select
                                name="department_id"
                                value={formData.department_id}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                            >
                                <option value="">
                                    Unassigned Department
                                </option>

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
                                Team Leader
                            </span>

                            <select
                                name="leader_id"
                                value={formData.leader_id}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                            >
                                <option value="">Unassigned Leader</option>

                                {leaders.map((leader) => (
                                    <option
                                        key={leader.id}
                                        value={leader.id}
                                    >
                                        {leader.fullname}
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
                            to="/hr/teams"
                            className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Cancel
                        </Link>

                        <button
                            disabled={saving}
                            className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                        >
                            {saving ? "Saving..." : "Update Team"}
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default EditTeam;


