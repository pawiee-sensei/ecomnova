import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

const Teams = () => {
    /*
      Team directory
    */
    const [teams, setTeams] =
        useState([]);

    /*
      Lookup data
    */
    const [departments, setDepartments] =
        useState([]);

    const [leaders, setLeaders] =
        useState([]);

    /*
      Create form
    */
    const [formData, setFormData] =
        useState({
            name: "",
            code: "",
            department_id: "",
            description: "",
            leader_id: "",
            status: "active"
        });

    /*
      Fetch teams + lookup data
    */
    const fetchData = async () => {
        try {
            const [
                teamsResponse,
                departmentsResponse,
                leadersResponse
            ] = await Promise.all([
                api.get("/admin/teams"),
                api.get("/admin/teams/departments"),
                api.get("/admin/teams/leaders")
            ]);

            setTeams(
                teamsResponse.data
            );

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
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    /*
      Form changes
    */
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]:
                e.target.value
        });
    };

    /*
      Create team
    */
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post(
                "/admin/teams",
                formData
            );

            fetchData();

            setFormData({
                name: "",
                code: "",
                department_id: "",
                description: "",
                leader_id: "",
                status: "active"
            });

        } catch (error) {
            console.error(
                "Team creation failed:",
                error
            );
        }
    };

    return (
        <DashboardLayout>

            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Team Management
                </h1>

                <p className="text-gray-500">
                    Team governance and structure
                </p>
            </div>

            {/* Create Team */}
            <div className="border rounded-xl p-6 mb-10">
                <h2 className="text-xl font-semibold mb-4">
                    Create Team
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <input
                        type="text"
                        name="name"
                        placeholder="Team Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border p-4 rounded-lg"
                        required
                    />

                    <input
                        type="text"
                        name="code"
                        placeholder="Team Code"
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
                            Select Department
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
                            Select Team Leader
                        </option>

                        {leaders.map(
                            (leader) => (
                                <option
                                    key={leader.id}
                                    value={leader.id}
                                >
                                    {leader.fullname}
                                </option>
                            )
                        )}
                    </select>

                    <textarea
                        name="description"
                        placeholder="Description"
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
                        Create Team
                    </button>
                </form>
            </div>

            {/* Team Directory */}
            <div className="border rounded-xl overflow-hidden">
                <table className="w-full">

                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left p-4">
                                Name
                            </th>

                            <th className="text-left p-4">
                                Code
                            </th>

                            <th className="text-left p-4">
                                Department
                            </th>

                            <th className="text-left p-4">
                                Leader
                            </th>

                            <th className="text-left p-4">
                                Members
                            </th>

                            <th className="text-left p-4">
                                Status
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {teams.map((team) => (
                            <tr
                                key={team.id}
                                className="border-t"
                            >
                                <td className="p-4">
                                    {team.name}
                                </td>

                                <td className="p-4">
                                    {team.code || "—"}
                                </td>

                                <td className="p-4">
                                    {team.department_name || "Unassigned"}
                                </td>

                                <td className="p-4">
                                    {team.leader_name || "Unassigned"}
                                </td>

                                <td className="p-4">
                                    {team.member_count}
                                </td>

                                <td className="p-4 capitalize">
                                    {team.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

        </DashboardLayout>
    );
};

export default Teams;