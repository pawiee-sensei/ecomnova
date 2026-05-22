import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";
import { Link } from "react-router-dom";

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

    const [showMembers, setShowMembers] =
    useState(false);

    const [selectedTeam, setSelectedTeam] =
        useState("");

    const [selectedTeamId, setSelectedTeamId] =
        useState(null);

    const [teamMembers, setTeamMembers] =
        useState([]);

    const [availableEmployees, setAvailableEmployees] =
        useState([]);

    const [selectedEmployees, setSelectedEmployees] =
        useState([]);

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

    const handleCheckboxChange = (
        employeeId
    ) => {
        setSelectedEmployees((prev) =>
            prev.includes(employeeId)
                ? prev.filter(
                    (id) => id !== employeeId
                )
                : [...prev, employeeId]
        );
    };

    const handleAssignMembers = async () => {
        try {
            await api.put(
                `/admin/teams/${selectedTeamId}/assign-members`,
                {
                    employeeIds:
                        selectedEmployees
                }
            );

            handleManageMembers(
                selectedTeamId,
                selectedTeam
            );

            fetchData();

            setSelectedEmployees([]);

        } catch (error) {
            console.error(
                "Assignment failed:",
                error
            );
        }
    };

    const handleManageMembers = async (
    teamId,
    teamName
) => {
    try {
        const [
            membersResponse,
            availableResponse
        ] = await Promise.all([
            api.get(
                `/admin/teams/${teamId}/members`
            ),
            api.get(
                "/admin/teams/available-employees"
            )
        ]);

        setTeamMembers(
            membersResponse.data
        );

        setAvailableEmployees(
            availableResponse.data
        );

        setSelectedTeam(teamName);
        setSelectedTeamId(teamId);
        setShowMembers(true);

    } catch (error) {
        console.error(
            "Team member fetch failed:",
            error
        );
    }
};

const handleRemoveMember = async (
        employeeId
    ) => {
        try {
            await api.put(
                `/admin/teams/remove-member/${employeeId}`
            );

            handleManageMembers(
                selectedTeamId,
                selectedTeam
            );

            fetchData();

        } catch (error) {
            console.error(
                "Removal failed:",
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

                            <th className="text-left p-4">
                                Actions
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

                                <td className="p-4 flex gap-2">
                                    <Link
                                        to={`/admin/teams/edit/${team.id}`}
                                        className="bg-black text-white px-4 py-2 rounded-lg text-sm"
                                    >
                                        Edit
                                    </Link>

                                    <button
                                        onClick={() =>
                                            handleManageMembers(
                                                team.id,
                                                team.name
                                            )
                                        }
                                        className="border px-4 py-2 rounded-lg text-sm"
                                    >
                                        Manage Members
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

            {showMembers && (
    <div className="mt-10 border rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="text-2xl font-bold">
                    {selectedTeam} Members
                </h2>

                <p className="text-gray-500">
                    Manage team staffing
                </p>
            </div>

            <button
                onClick={() =>
                    setShowMembers(false)
                }
                className="border px-4 py-2 rounded-lg"
            >
                Close
            </button>
        </div>

        <div className="grid grid-cols-2 gap-8">

            {/* Current Members */}
            <div>
                <h3 className="text-xl font-semibold mb-4">
                    Current Members
                </h3>

                <div className="space-y-3">
                    {teamMembers.map((member) => (
                        <div
                            key={member.id}
                            className="border rounded-lg p-4 flex justify-between items-center"
                        >
                            <div>
                                <p className="font-medium">
                                    {member.fullname}
                                </p>

                                <p className="text-sm text-gray-500 capitalize">
                                    {member.role}
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    handleRemoveMember(
                                        member.id
                                    )
                                }
                                className="border px-3 py-2 rounded-lg text-sm"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Available Employees */}
            <div>
                <h3 className="text-xl font-semibold mb-4">
                    Available Employees
                </h3>

                <div className="space-y-3">
                    {availableEmployees.map(
                        (employee) => (
                            <label
                                key={employee.id}
                                className="border rounded-lg p-4 flex items-center gap-3 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedEmployees.includes(
                                        employee.id
                                    )}
                                    onChange={() =>
                                        handleCheckboxChange(
                                            employee.id
                                        )
                                    }
                                />

                                <div>
                                    <p className="font-medium">
                                        {employee.fullname}
                                    </p>

                                    <p className="text-sm text-gray-500 capitalize">
                                        {employee.role}
                                    </p>
                                </div>
                            </label>
                        )
                    )}
                </div>

                <button
                    onClick={handleAssignMembers}
                    disabled={
                        selectedEmployees.length === 0
                    }
                    className="mt-6 bg-black text-white px-6 py-3 rounded-lg disabled:opacity-50"
                >
                    Assign Selected
                </button>
            </div>

        </div>
    </div>
)}

        </DashboardLayout>
    );
};

export default Teams;