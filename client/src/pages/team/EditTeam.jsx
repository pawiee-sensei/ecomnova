import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

const EditTeam = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] =
        useState({
            name: "",
            code: "",
            department_id: "",
            description: "",
            leader_id: "",
            status: "active"
        });

    const [departments, setDepartments] =
        useState([]);

    const [leaders, setLeaders] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    teamResponse,
                    departmentsResponse,
                    leadersResponse
                ] = await Promise.all([
                    api.get(`/admin/teams/${id}`),
                    api.get("/admin/teams/departments"),
                    api.get("/admin/teams/leaders")
                ]);

                setFormData({
                    name:
                        teamResponse.data.name || "",
                    code:
                        teamResponse.data.code || "",
                    department_id:
                        teamResponse.data.department_id || "",
                    description:
                        teamResponse.data.description || "",
                    leader_id:
                        teamResponse.data.leader_id || "",
                    status:
                        teamResponse.data.status || "active"
                });

                setDepartments(
                    departmentsResponse.data
                );

                setLeaders(
                    leadersResponse.data
                );

            } catch (error) {
                console.error(
                    "Team fetch failed:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]:
                e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.put(
                `/admin/teams/${id}`,
                formData
            );

            navigate("/admin/teams");

        } catch (error) {
            console.error(
                "Team update failed:",
                error
            );
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <h1>Loading team...</h1>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-2xl">
                <h1 className="text-3xl font-bold mb-8">
                    Edit Team
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border p-4 rounded-lg"
                        required
                    />

                    <input
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        className="w-full border p-4 rounded-lg"
                    />

                    <select
                        name="department_id"
                        value={formData.department_id}
                        onChange={handleChange}
                        className="w-full border p-4 rounded-lg"
                    >
                        <option value="">
                            Unassigned Department
                        </option>

                        {departments.map(
                            (department) => (
                                <option
                                    key={department.id}
                                    value={department.id}
                                >
                                    {department.name}
                                </option>
                            )
                        )}
                    </select>

                    <select
                        name="leader_id"
                        value={formData.leader_id}
                        onChange={handleChange}
                        className="w-full border p-4 rounded-lg"
                    >
                        <option value="">
                            Unassigned Leader
                        </option>

                        {leaders.map((leader) => (
                            <option
                                key={leader.id}
                                value={leader.id}
                            >
                                {leader.fullname}
                            </option>
                        ))}
                    </select>

                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full border p-4 rounded-lg"
                    />

                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full border p-4 rounded-lg"
                    >
                        <option value="active">
                            Active
                        </option>

                        <option value="inactive">
                            Inactive
                        </option>

                        <option value="archived">
                            Archived
                        </option>
                    </select>

                    <button
                        className="bg-black text-white px-6 py-3 rounded-lg"
                    >
                        Update Team
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default EditTeam;