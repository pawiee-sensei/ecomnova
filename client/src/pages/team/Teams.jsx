import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

const PAGE_SIZE = 8;

const Teams = () => {
    const [teams, setTeams] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [leaders, setLeaders] = useState([]);
    const [showMembers, setShowMembers] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState("");
    const [selectedTeamId, setSelectedTeamId] = useState(null);
    const [teamMembers, setTeamMembers] = useState([]);
    const [availableEmployees, setAvailableEmployees] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [teamPage, setTeamPage] = useState(1);
    const [showCreateTeam, setShowCreateTeam] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        code: "",
        department_id: "",
        description: "",
        leader_id: "",
        status: "active"
    });

    const teamPageCount = Math.max(
        1,
        Math.ceil(teams.length / PAGE_SIZE)
    );

    const paginatedTeams = useMemo(() => {
        const start = (teamPage - 1) * PAGE_SIZE;

        return teams.slice(start, start + PAGE_SIZE);
    }, [teamPage, teams]);

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

            setTeams(teamsResponse.data);
            setDepartments(departmentsResponse.data);
            setLeaders(leadersResponse.data);
        } catch (error) {
            console.error("Team fetch failed:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        setTeamPage((page) =>
            Math.min(page, teamPageCount)
        );
    }, [teamPageCount]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post("/admin/teams", formData);
            await fetchData();

            setFormData({
                name: "",
                code: "",
                department_id: "",
                description: "",
                leader_id: "",
                status: "active"
            });
            setShowCreateTeam(false);
        } catch (error) {
            console.error("Team creation failed:", error);
        }
    };

    const handleCheckboxChange = (employeeId) => {
        setSelectedEmployees((prev) =>
            prev.includes(employeeId)
                ? prev.filter((id) => id !== employeeId)
                : [...prev, employeeId]
        );
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
                api.get(`/admin/teams/${teamId}/members`),
                api.get(`/admin/teams/${teamId}/available-employees`)
            ]);

            setTeamMembers(membersResponse.data);
            setAvailableEmployees(availableResponse.data);
            setSelectedEmployees([]);
            setSelectedTeam(teamName);
            setSelectedTeamId(teamId);
            setShowMembers(true);
        } catch (error) {
            console.error("Team member fetch failed:", error);
        }
    };

    const handleAssignMembers = async () => {
        try {
            await api.put(
                `/admin/teams/${selectedTeamId}/assign-members`,
                {
                    employeeIds: selectedEmployees
                }
            );

            await handleManageMembers(selectedTeamId, selectedTeam);
            await fetchData();
        } catch (error) {
            console.error("Assignment failed:", error);
        }
    };

    const handleRemoveMember = async (employeeId) => {
        try {
            await api.put(`/admin/teams/remove-member/${employeeId}`);
            await handleManageMembers(selectedTeamId, selectedTeam);
            await fetchData();
        } catch (error) {
            console.error("Removal failed:", error);
        }
    };

    return (
        <DashboardLayout>
            <div className="mb-8">
                <p className="text-sm font-medium text-slate-500">
                    Workforce Structure
                </p>

                <h1 className="mt-1 text-3xl font-bold text-slate-950">
                    Team Management
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Manage team governance, leaders, and department-aligned staffing.
                </p>
            </div>

            <div>
                <div className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-950">
                                Team Directory
                            </h2>

                            <p className="text-sm text-slate-500">
                                {teams.length} total teams
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowCreateTeam(true)}
                            className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                        >
                            Create Team
                        </button>
                    </div>

                    <div className="hidden lg:block">
                        <table className="w-full table-fixed">
                            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                <tr>
                                    <th className="w-[20%] px-4 py-3 text-left font-semibold">Name</th>
                                    <th className="w-[11%] px-4 py-3 text-left font-semibold">Code</th>
                                    <th className="w-[19%] px-4 py-3 text-left font-semibold">Department</th>
                                    <th className="w-[19%] px-4 py-3 text-left font-semibold">Leader</th>
                                    <th className="w-[10%] px-4 py-3 text-left font-semibold">Members</th>
                                    <th className="w-[12%] px-4 py-3 text-left font-semibold">Status</th>
                                    <th className="w-[9%] px-4 py-3 text-right font-semibold">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {paginatedTeams.map((team) => (
                                    <tr
                                        key={team.id}
                                        className="transition hover:bg-slate-50"
                                    >
                                        <td className="px-4 py-4 font-medium text-slate-950">
                                            {team.name}
                                        </td>

                                        <td className="px-4 py-4 text-sm text-slate-600">
                                            {team.code || "-"}
                                        </td>

                                        <td className="px-4 py-4 text-sm text-slate-600">
                                            {team.department_name || "Unassigned"}
                                        </td>

                                        <td className="px-4 py-4 text-sm text-slate-600">
                                            {team.leader_name || "Unassigned"}
                                        </td>

                                        <td className="px-4 py-4 text-sm text-slate-600">
                                            {team.member_count}
                                        </td>

                                        <td className="px-4 py-4">
                                            <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold capitalize text-emerald-700">
                                                {team.status}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="flex justify-end gap-2 whitespace-nowrap">
                                                <Link
                                                    to={`/admin/teams/edit/${team.id}`}
                                                    className="rounded-lg bg-slate-950 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleManageMembers(
                                                            team.id,
                                                            team.name
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
                        {paginatedTeams.map((team) => (
                            <div
                                key={team.id}
                                className="p-5"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="font-semibold text-slate-950">
                                            {team.name}
                                        </h3>

                                        <p className="mt-1 text-sm text-slate-500">
                                            {team.code || "No code"} / {team.department_name || "Unassigned"}
                                        </p>
                                    </div>

                                    <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold capitalize text-emerald-700">
                                        {team.status}
                                    </span>
                                </div>

                                <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <dt className="text-xs font-semibold uppercase text-slate-400">
                                            Leader
                                        </dt>
                                        <dd className="mt-1 text-slate-700">
                                            {team.leader_name || "Unassigned"}
                                        </dd>
                                    </div>

                                    <div>
                                        <dt className="text-xs font-semibold uppercase text-slate-400">
                                            Members
                                        </dt>
                                        <dd className="mt-1 text-slate-700">
                                            {team.member_count}
                                        </dd>
                                    </div>
                                </dl>

                                <div className="mt-4 flex gap-2">
                                    <Link
                                        to={`/admin/teams/edit/${team.id}`}
                                        className="rounded-lg bg-slate-950 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
                                    >
                                        Edit
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleManageMembers(
                                                team.id,
                                                team.name
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

                    {teams.length > 0 && (
                        <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-slate-500">
                                Showing {(teamPage - 1) * PAGE_SIZE + 1}-
                                {Math.min(
                                    teamPage * PAGE_SIZE,
                                    teams.length
                                )}{" "}
                                of {teams.length} teams
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setTeamPage((page) =>
                                            Math.max(1, page - 1)
                                        )
                                    }
                                    disabled={teamPage === 1}
                                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
                                >
                                    Previous
                                </button>

                                <span className="text-sm font-medium text-slate-600">
                                    Page {teamPage} of {teamPageCount}
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setTeamPage((page) =>
                                            Math.min(teamPageCount, page + 1)
                                        )
                                    }
                                    disabled={teamPage === teamPageCount}
                                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showCreateTeam && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
                    <div className="max-h-[88vh] w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-xl">
                        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
                            <div>
                                <h2 className="text-xl font-bold text-slate-950">
                                    Create Team
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Add a team and connect it to a department or leader.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowCreateTeam(false)}
                                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                Close
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="grid max-h-[72vh] gap-4 overflow-auto p-5 sm:grid-cols-2"
                        >
                            <input
                                type="text"
                                name="name"
                                placeholder="Team name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                                required
                            />

                            <input
                                type="text"
                                name="code"
                                placeholder="Team code"
                                value={formData.code}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                            />

                            <select
                                name="department_id"
                                value={formData.department_id}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                            >
                                <option value="">Select Department</option>

                                {departments.map((department) => (
                                    <option
                                        key={department.id}
                                        value={department.id}
                                    >
                                        {department.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                name="leader_id"
                                value={formData.leader_id}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                            >
                                <option value="">Select Team Leader</option>

                                {leaders.map((leader) => (
                                    <option
                                        key={leader.id}
                                        value={leader.id}
                                    >
                                        {leader.fullname}
                                    </option>
                                ))}
                            </select>

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

                            <textarea
                                name="description"
                                rows="3"
                                placeholder="Description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 sm:col-span-2"
                            />

                            <div className="flex justify-end gap-2 sm:col-span-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateTeam(false)}
                                    className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>

                                <button className="rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
                                    Create Team
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showMembers && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
                    <div className="max-h-[88vh] w-full max-w-6xl overflow-hidden rounded-xl bg-white shadow-xl">
                        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
                            <div>
                                <h2 className="text-xl font-bold text-slate-950">
                                    {selectedTeam} Members
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Add only unassigned employees from this team's department.
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

                        <div className="grid max-h-[70vh] gap-0 overflow-auto lg:grid-cols-2">
                            <div className="border-b border-slate-200 p-5 lg:border-b-0 lg:border-r">
                                <h3 className="text-base font-semibold text-slate-950">
                                    Current Members
                                </h3>

                                <div className="mt-4 space-y-3">
                                    {teamMembers.map((member) => (
                                        <div
                                            key={member.id}
                                            className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-4"
                                        >
                                            <div>
                                                <p className="font-medium text-slate-950">
                                                    {member.fullname}
                                                </p>

                                                <p className="text-sm capitalize text-slate-500">
                                                    {member.role}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveMember(
                                                        member.id
                                                    )
                                                }
                                                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}

                                    {teamMembers.length === 0 && (
                                        <p className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                                            No members assigned yet.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="p-5">
                                <h3 className="text-base font-semibold text-slate-950">
                                    Available Employees
                                </h3>

                                <div className="mt-4 space-y-3">
                                    {availableEmployees.map((employee) => (
                                        <label
                                            key={employee.id}
                                            className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-4 hover:bg-slate-50"
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
                                                <p className="font-medium text-slate-950">
                                                    {employee.fullname}
                                                </p>

                                                <p className="text-sm capitalize text-slate-500">
                                                    {employee.role}
                                                </p>
                                            </div>
                                        </label>
                                    ))}

                                    {availableEmployees.length === 0 && (
                                        <p className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                                            No available employees in this department.
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={handleAssignMembers}
                                    disabled={selectedEmployees.length === 0}
                                    className="mt-5 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                                >
                                    Assign Selected
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default Teams;
