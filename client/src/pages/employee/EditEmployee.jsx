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

    const [departments, setDepartments] = useState([]);

    const [teams, setTeams] = useState([]);

    const [managers, setManagers] = useState([]);

    const availableManagers = managers.filter((manager) => {
        if (!formData.department_id) {
            return false;
        }

        return (
            String(manager.department_id || "") ===
            String(formData.department_id)
        );
    });

    const availableTeams = teams.filter((team) => {
        if (!formData.department_id) {
            return false;
        }

        return (
            String(team.department_id || "") ===
            String(formData.department_id)
        );
    });

    const selectedTeam = teams.find(
        (team) => String(team.id) === String(formData.team_id)
    );

    const selectedManager = managers.find(
        (manager) =>
            String(manager.id) === String(formData.manager_id)
    );

    const assignmentError = (() => {
        if (formData.team_id && !formData.department_id) {
            return "Select a department before assigning a team.";
        }

        if (formData.manager_id && !formData.department_id) {
            return "Select a department before assigning a manager.";
        }

        if (
            formData.team_id &&
            String(selectedTeam?.department_id || "") !==
                String(formData.department_id)
        ) {
            return "Selected team does not belong to this department.";
        }

        if (
            formData.manager_id &&
            String(selectedManager?.department_id || "") !==
                String(formData.department_id)
        ) {
            return "Selected manager does not belong to this department.";
        }

        return "";
    })();

useEffect(() => {
    const fetchEmployee = async () => {
        try {
            /*
              Fetch employee profile + lookup data together
            */
            const [
                employeeResponse,
                departmentsResponse,
                teamsResponse,
                managersResponse
            ] = await Promise.all([
                api.get(`/admin/employees/${id}`),
                api.get("/admin/employees/departments"),
                api.get("/admin/employees/teams"),
                api.get("/admin/employees/managers")
            ]);

            /*
              Prefill employee form
            */
            setFormData({
                fullname:
                    employeeResponse.data.fullname || "",
                email:
                    employeeResponse.data.email || "",
                role:
                    employeeResponse.data.role || "",
                department_id:
                    employeeResponse.data.department_id || "",
                team_id:
                    employeeResponse.data.team_id || "",
                manager_id:
                    employeeResponse.data.manager_id || ""
            });

            /*
              Populate dropdowns
            */
            setDepartments(
                departmentsResponse.data
            );

            setTeams(
                teamsResponse.data
            );

            setManagers(
                managersResponse.data
            );

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
        const { name, value } = e.target;

        if (name === "department_id") {
            const selectedManager = managers.find(
                (manager) =>
                    String(manager.id) ===
                    String(formData.manager_id)
            );

            const managerBelongsToDepartment =
                !selectedManager ||
                !value ||
                String(selectedManager.department_id || "") ===
                    String(value);

            setFormData({
                ...formData,
                department_id: value,
                team_id:
                    !formData.team_id ||
                    teams.some(
                        (team) =>
                            String(team.id) ===
                                String(formData.team_id) &&
                            String(team.department_id || "") ===
                                String(value)
                    )
                        ? formData.team_id
                        : "",
                manager_id: managerBelongsToDepartment
                    ? formData.manager_id
                    : ""
            });

            return;
        }

        if (name === "manager_id") {
            const selectedManager = managers.find(
                (manager) =>
                    String(manager.id) === String(value)
            );

            setFormData({
                ...formData,
                manager_id: value,
                department_id:
                    !formData.department_id &&
                    selectedManager?.department_id
                        ? selectedManager.department_id
                        : formData.department_id
            });

            return;
        }

        if (name === "team_id") {
            const selectedTeam = teams.find(
                (team) => String(team.id) === String(value)
            );

            setFormData({
                ...formData,
                team_id: value,
                department_id:
                    !formData.department_id &&
                    selectedTeam?.department_id
                        ? selectedTeam.department_id
                        : formData.department_id
            });

            return;
        }

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (assignmentError) {
            alert(assignmentError);
            return;
        }

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
            alert(
                error.response?.data?.message ||
                    "Employee update failed"
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
                        {assignmentError && (
                            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-800 md:col-span-2">
                                {assignmentError}
                            </div>
                        )}

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
                                className="w-full border p-4 rounded-lg"
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
                                        {department.code
                                            ? ` (${department.code})`
                                            : ""}
                                    </option>
                                ))}
                            </select>
                        </label>

                        {!formData.department_id ? (
                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 md:col-span-2">
                                Select a department to assign this employee to a team and manager.
                            </div>
                        ) : (
                            <>
                                <label className="space-y-2">
                                    <span className="text-sm font-medium text-slate-700">
                                        Team
                                    </span>

                                    <select
                                        name="team_id"
                                        value={formData.team_id}
                                        onChange={handleChange}
                                        className="w-full border p-4 rounded-lg"
                                    >
                                        <option value="">
                                            Unassigned Team
                                        </option>

                                        {availableTeams.map((team) => (
                                            <option
                                                key={team.id}
                                                value={team.id}
                                            >
                                                {team.name}
                                                {team.department_name
                                                    ? ` - ${team.department_name}`
                                                    : " - no department"}
                                            </option>
                                        ))}
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
                                        className="w-full border p-4 rounded-lg"
                                    >
                                        <option value="">
                                            Unassigned Manager
                                        </option>

                                        {availableManagers.map((manager) => (
                                            <option
                                                key={manager.id}
                                                value={manager.id}
                                            >
                                                {manager.fullname}
                                                {manager.department_name
                                                    ? ` - ${manager.department_name}`
                                                    : " - unassigned"}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </>
                        )}
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
                            disabled={saving || Boolean(assignmentError)}
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
