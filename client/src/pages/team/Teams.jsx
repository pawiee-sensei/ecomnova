import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

const PAGE_SIZE = 8;

const INITIAL_TEAM_FORM = {
    name: "",
    code: "",
    department_id: "",
    description: "",
    leader_id: "",
    status: "active"
};

const getStatusBadgeClass = (status) => {
    const normalizedStatus = String(status || "").toLowerCase();

    if (normalizedStatus === "inactive") {
        return "bg-amber-50 text-amber-700";
    }

    if (normalizedStatus === "archived") {
        return "bg-slate-100 text-slate-600";
    }

    return "bg-emerald-50 text-emerald-700";
};

const getRoleBadgeClass = (role) => {
    const normalizedRole = String(role || "").toLowerCase();

    if (normalizedRole.includes("leader")) {
        return "bg-indigo-50 text-indigo-700";
    }

    if (normalizedRole.includes("manager")) {
        return "bg-sky-50 text-sky-700";
    }

    return "bg-slate-100 text-slate-600";
};

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
    const [createError, setCreateError] = useState("");
    const [teamSearch, setTeamSearch] = useState("");
    const [teamStatusFilter, setTeamStatusFilter] = useState("");
    const [teamAssignmentFilter, setTeamAssignmentFilter] = useState("");
    const [memberSearch, setMemberSearch] = useState("");
    const [creatingTeam, setCreatingTeam] = useState(false);
    const [loadingMembers, setLoadingMembers] = useState(false);
    const [assigningMembers, setAssigningMembers] = useState(false);
    const [removingMemberId, setRemovingMemberId] = useState(null);
    const [toast, setToast] = useState(null);

    const [formData, setFormData] = useState(INITIAL_TEAM_FORM);

    const teamCapacityStats = useMemo(() => {
        const teamsWithoutLeaders = teams.filter(
            (team) => !team.leader_name
        ).length;
        const teamsWithoutMembers = teams.filter(
            (team) => Number(team.member_count || 0) === 0
        ).length;
        const assignedMembers = teams.reduce(
            (total, team) => total + Number(team.member_count || 0),
            0
        );

        return {
            total: teams.length,
            teamsWithoutLeaders,
            teamsWithoutMembers,
            assignedMembers
        };
    }, [teams]);

    const filteredTeams = useMemo(() => {
        const normalizedSearch = teamSearch.trim().toLowerCase();

        return teams.filter((team) => {
            const matchesSearch =
                !normalizedSearch ||
                [
                    team.name,
                    team.code,
                    team.department_name,
                    team.leader_name
                ]
                    .filter(Boolean)
                    .some((value) =>
                        String(value)
                            .toLowerCase()
                            .includes(normalizedSearch)
                    );
            const matchesStatus =
                !teamStatusFilter ||
                team.status === teamStatusFilter;
            const matchesAssignment =
                !teamAssignmentFilter ||
                (teamAssignmentFilter === "unassigned_leader" &&
                    !team.leader_name) ||
                (teamAssignmentFilter === "no_members" &&
                    Number(team.member_count || 0) === 0);

            return matchesSearch && matchesStatus && matchesAssignment;
        });
    }, [
        teamAssignmentFilter,
        teamSearch,
        teamStatusFilter,
        teams
    ]);

    const teamPageCount = Math.max(
        1,
        Math.ceil(filteredTeams.length / PAGE_SIZE)
    );

    const paginatedTeams = useMemo(() => {
        const start = (teamPage - 1) * PAGE_SIZE;

        return filteredTeams.slice(start, start + PAGE_SIZE);
    }, [filteredTeams, teamPage]);

    const sortedTeamMembers = useMemo(() => {
        const normalizedSearch = memberSearch.trim().toLowerCase();

        return [...teamMembers].filter((member) => {
            if (!normalizedSearch) {
                return true;
            }

            return [member.fullname, member.role]
                .filter(Boolean)
                .some((value) =>
                    String(value)
                        .toLowerCase()
                        .includes(normalizedSearch)
                );
        }).sort((firstMember, secondMember) => {
            const firstIsLeader = String(firstMember.role || "")
                .toLowerCase()
                .includes("leader");
            const secondIsLeader = String(secondMember.role || "")
                .toLowerCase()
                .includes("leader");

            return Number(secondIsLeader) - Number(firstIsLeader);
        });
    }, [memberSearch, teamMembers]);

    const filteredAvailableEmployees = useMemo(() => {
        const normalizedSearch = memberSearch.trim().toLowerCase();

        if (!normalizedSearch) {
            return availableEmployees;
        }

        return availableEmployees.filter((employee) =>
            [employee.fullname, employee.role]
                .filter(Boolean)
                .some((value) =>
                    String(value)
                        .toLowerCase()
                        .includes(normalizedSearch)
                )
        );
    }, [availableEmployees, memberSearch]);

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

    useEffect(() => {
        setTeamPage(1);
    }, [teamAssignmentFilter, teamSearch, teamStatusFilter]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        window.setTimeout(() => setToast(null), 3000);
    };

    const resetForm = () => {
        setFormData(INITIAL_TEAM_FORM);
    };

    const closeCreateTeam = () => {
        resetForm();
        setCreateError("");
        setShowCreateTeam(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCreateError("");

        try {
            setCreatingTeam(true);
            await api.post("/admin/teams", formData);
            await fetchData();

            resetForm();
            setShowCreateTeam(false);
            showToast("Team created.");
        } catch (error) {
            console.error("Team creation failed:", error);
            setCreateError(
                error.response?.data?.message ||
                    "Team creation failed. Please check the details and try again."
            );
            showToast("Team creation failed.", "error");
        } finally {
            setCreatingTeam(false);
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
            setLoadingMembers(true);
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
            setMemberSearch("");
            setSelectedTeam(teamName);
            setSelectedTeamId(teamId);
            setShowCreateTeam(false);
            setShowMembers(true);
        } catch (error) {
            console.error("Team member fetch failed:", error);
            showToast("Team members could not be loaded.", "error");
        } finally {
            setLoadingMembers(false);
        }
    };

    const handleAssignMembers = async () => {
        try {
            setAssigningMembers(true);
            await api.put(
                `/admin/teams/${selectedTeamId}/assign-members`,
                {
                    employeeIds: selectedEmployees
                }
            );

            await handleManageMembers(selectedTeamId, selectedTeam);
            await fetchData();
            showToast("Members assigned.");
        } catch (error) {
            console.error("Assignment failed:", error);
            showToast("Member assignment failed.", "error");
        } finally {
            setAssigningMembers(false);
        }
    };

    const handleRemoveMember = async (employeeId) => {
        try {
            setRemovingMemberId(employeeId);
            await api.put(`/admin/teams/remove-member/${employeeId}`);
            await handleManageMembers(selectedTeamId, selectedTeam);
            await fetchData();
            showToast("Member removed.");
        } catch (error) {
            console.error("Removal failed:", error);
            showToast("Member removal failed.", "error");
        } finally {
            setRemovingMemberId(null);
        }
    };

    return (
        <DashboardLayout>
            {toast && (
                <div className="fixed right-5 top-5 z-[60]">
                    <div
                        className={`rounded-lg border px-4 py-3 text-sm font-medium shadow-lg ${
                            toast.type === "error"
                                ? "border-rose-100 bg-rose-50 text-rose-700"
                                : "border-emerald-100 bg-emerald-50 text-emerald-700"
                        }`}
                    >
                        {toast.message}
                    </div>
                </div>
            )}

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

            <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Total Teams</p>
                    <p className="mt-2 text-3xl font-bold text-slate-950">
                        {teamCapacityStats.total}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Without Leaders</p>
                    <p className="mt-2 text-3xl font-bold text-rose-600">
                        {teamCapacityStats.teamsWithoutLeaders}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">No Members</p>
                    <p className="mt-2 text-3xl font-bold text-amber-600">
                        {teamCapacityStats.teamsWithoutMembers}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Assigned Members</p>
                    <p className="mt-2 text-3xl font-bold text-emerald-600">
                        {teamCapacityStats.assignedMembers}
                    </p>
                </div>
            </div>

            <div>
                <div className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-950">
                                Team Directory
                            </h2>

                            <p className="text-sm text-slate-500">
                                {filteredTeams.length} of {teams.length} teams
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setShowMembers(false);
                                setShowCreateTeam(true);
                            }}
                            className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                        >
                            Create Team
                        </button>
                    </div>

                    <div className="grid gap-3 border-b border-slate-200 p-5 lg:grid-cols-[1fr_180px_220px]">
                        <input
                            type="text"
                            value={teamSearch}
                            onChange={(event) =>
                                setTeamSearch(event.target.value)
                            }
                            placeholder="Search teams, code, department, or leader"
                            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                        />

                        <select
                            value={teamStatusFilter}
                            onChange={(event) =>
                                setTeamStatusFilter(event.target.value)
                            }
                            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                        >
                            <option value="">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="archived">Archived</option>
                        </select>

                        <select
                            value={teamAssignmentFilter}
                            onChange={(event) =>
                                setTeamAssignmentFilter(event.target.value)
                            }
                            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                        >
                            <option value="">All Teams</option>
                            <option value="unassigned_leader">
                                Unassigned Leader
                            </option>
                            <option value="no_members">No Members</option>
                        </select>
                    </div>

                    <div className="hidden lg:block">
                        <table className="w-full table-fixed">
                            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                <tr>
                                    <th className="w-[16%] px-4 py-3 text-left font-semibold">Name</th>
                                    <th className="w-[9%] px-4 py-3 text-center font-semibold">Code</th>
                                    <th className="w-[16%] px-4 py-3 text-left font-semibold">Department</th>
                                    <th className="w-[16%] px-4 py-3 text-left font-semibold">Leader</th>
                                    <th className="w-[9%] px-4 py-3 text-center font-semibold">Members</th>
                                    <th className="w-[10%] px-4 py-3 text-center font-semibold">Status</th>
                                    <th className="w-[24%] px-4 py-3 text-center font-semibold">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {paginatedTeams.map((team) => (
                                    <tr
                                        key={team.id}
                                        className="transition hover:bg-slate-50"
                                    >
                                        <td className="px-4 py-4 align-middle font-medium text-slate-950">
                                            {team.name}
                                        </td>

                                        <td className="px-4 py-4 text-center align-middle text-sm text-slate-600">
                                            {team.code || "-"}
                                        </td>

                                        <td className="px-4 py-4 align-middle text-sm text-slate-600">
                                            {team.department_name || "Unassigned"}
                                        </td>

                                        <td className="px-4 py-4 align-middle text-sm">
                                            {team.leader_name ? (
                                                <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                                                    {team.leader_name}
                                                </span>
                                            ) : (
                                                <span className="inline-flex rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
                                                    Unassigned
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-4 py-4 text-center align-middle text-sm text-slate-600">
                                            {team.member_count}
                                        </td>

                                        <td className="px-4 py-4 text-center align-middle">
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getStatusBadgeClass(team.status)}`}>
                                                {team.status}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4 align-middle">
                                            <div className="flex min-w-[230px] justify-center gap-2 whitespace-nowrap">
                                                <Link
                                                    to={`/admin/teams/edit/${team.id}`}
                                                    className="inline-flex h-10 w-16 items-center justify-center rounded-lg bg-slate-950 text-sm font-medium text-white hover:bg-slate-800"
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
                                                    disabled={loadingMembers}
                                                    className="inline-flex h-10 w-36 items-center justify-center rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                                >
                                                    {loadingMembers ? "Loading..." : "Manage Members"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {filteredTeams.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-5 py-12 text-center"
                                        >
                                            <div className="mx-auto max-w-sm">
                                                <p className="text-sm font-medium text-slate-950">
                                                    No teams found.
                                                </p>

                                                <p className="mt-1 text-sm text-slate-500">
                                                    Try changing your search or filters.
                                                </p>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowCreateTeam(true)
                                                    }
                                                    className="mt-4 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                                                >
                                                    Create Team
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
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

                                        <div className="mt-2 flex flex-wrap gap-2">
                                            <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                                {team.code || "No code"}
                                            </span>

                                            <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                                {team.department_name || "No department"}
                                            </span>

                                            {team.leader_name ? (
                                                <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                                                    Leader: {team.leader_name}
                                                </span>
                                            ) : (
                                                <span className="inline-flex rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
                                                    Leader unassigned
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getStatusBadgeClass(team.status)}`}>
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
                                        disabled={loadingMembers}
                                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                                    >
                                        {loadingMembers ? "Loading..." : "Manage Members"}
                                    </button>
                                </div>
                            </div>
                        ))}

                                {filteredTeams.length === 0 && (
                            <div className="p-6 text-center">
                                <p className="text-sm font-medium text-slate-950">
                                    No teams found.
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    Try changing your search or filters.
                                </p>

                                <button
                                    type="button"
                                    onClick={() => setShowCreateTeam(true)}
                                    className="mt-4 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                                >
                                    Create Team
                                </button>
                            </div>
                        )}
                    </div>

                    {filteredTeams.length > 0 && (
                        <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-slate-500">
                                Showing {(teamPage - 1) * PAGE_SIZE + 1}-
                                {Math.min(
                                    teamPage * PAGE_SIZE,
                                    filteredTeams.length
                                )}{" "}
                                of {filteredTeams.length} teams
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
                                onClick={closeCreateTeam}
                                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                Close
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="grid max-h-[72vh] gap-4 overflow-auto p-5 sm:grid-cols-2"
                        >
                            {createError && (
                                <p className="rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700 sm:col-span-2">
                                    {createError}
                                </p>
                            )}

                            <label className="space-y-2">
                                <span className="text-sm font-medium text-slate-700">
                                    Team Name
                                </span>

                                <input
                                    type="text"
                                    name="name"
                                    placeholder="North Team"
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
                                    placeholder="NORTH"
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
                                    placeholder="Describe this team."
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                                />
                            </label>

                            <div className="flex justify-end gap-2 sm:col-span-2">
                                <button
                                    type="button"
                                    onClick={closeCreateTeam}
                                    className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    disabled={creatingTeam}
                                    className="rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                                >
                                    {creatingTeam ? "Creating..." : "Create Team"}
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

                                <input
                                    type="text"
                                    value={memberSearch}
                                    onChange={(event) =>
                                        setMemberSearch(event.target.value)
                                    }
                                    placeholder="Search members or available employees"
                                    className="mt-4 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                                />

                                <div className="mt-4 space-y-3">
                                    {sortedTeamMembers.map((member) => (
                                        <div
                                            key={member.id}
                                            className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-4"
                                        >
                                            <div>
                                                <p className="font-medium text-slate-950">
                                                    {member.fullname}
                                                </p>

                                                <p className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getRoleBadgeClass(member.role)}`}>
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
                                                disabled={
                                                    removingMemberId ===
                                                    member.id
                                                }
                                                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                                            >
                                                {removingMemberId === member.id
                                                    ? "Removing..."
                                                    : "Remove"}
                                            </button>
                                        </div>
                                    ))}

                                    {teamMembers.length === 0 && (
                                        <p className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                                            No members assigned yet.
                                        </p>
                                    )}

                                    {teamMembers.length > 0 &&
                                        sortedTeamMembers.length === 0 && (
                                            <p className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                                                No current members match your search.
                                            </p>
                                        )}
                                </div>
                            </div>

                            <div className="p-5">
                                <h3 className="text-base font-semibold text-slate-950">
                                    Available Employees
                                </h3>

                                <div className="mt-4 space-y-3">
                                    {filteredAvailableEmployees.map((employee) => (
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

                                                <p className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getRoleBadgeClass(employee.role)}`}>
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

                                    {availableEmployees.length > 0 &&
                                        filteredAvailableEmployees.length === 0 && (
                                            <p className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                                                No available employees match your search.
                                            </p>
                                        )}
                                </div>

                                <button
                                    type="button"
                                    onClick={handleAssignMembers}
                                    disabled={
                                        selectedEmployees.length === 0 ||
                                        assigningMembers
                                    }
                                    className="mt-5 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                                >
                                    {assigningMembers
                                        ? "Assigning..."
                                        : "Assign Selected"}
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
