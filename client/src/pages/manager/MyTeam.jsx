import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const statusStyles = {
    active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    inactive: "bg-slate-100 text-slate-700 ring-slate-200",
    suspended: "bg-amber-50 text-amber-700 ring-amber-200",
    terminated: "bg-rose-50 text-rose-700 ring-rose-200"
};



const formatLabel = (value) => {
    if (!value) {
        return "Unassigned";
    }

    return value
        .replaceAll("_", " ")
        .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
        );
};



const MyTeam = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const [searchTerm, setSearchTerm] =
    useState("");

    const [roleFilter, setRoleFilter] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("");

    const fetchTeam = async () => {
        try {
            setLoading(true);
            setErrorMessage("");

            const response = await api.get(
                "/manager/team"
            );

            setEmployees(
                response.data
            );

        } catch (error) {
            console.error(
                "Team fetch failed:",
                error
            );

            setErrorMessage(
                "Unable to load your team right now."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeam();
    }, []);


        const roles = [
        ...new Set(
            employees.map(
                (employee) =>
                    employee.role
            )
        )
    ];

    const statuses = [
        ...new Set(
            employees.map(
                (employee) =>
                    employee.status
            )
        )
    ];

    const filteredEmployees =
    employees.filter(
        (employee) => {

            const matchesSearch =
                employee.fullname
                    ?.toLowerCase()
                    .includes(
                        searchTerm.toLowerCase()
                    ) ||
                employee.email
                    ?.toLowerCase()
                    .includes(
                        searchTerm.toLowerCase()
                    );

            const matchesRole =
                !roleFilter ||
                employee.role ===
                    roleFilter;

            const matchesStatus =
                !statusFilter ||
                employee.status ===
                    statusFilter;

            return (
                matchesSearch &&
                matchesRole &&
                matchesStatus
            );
        }
    );

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-950">
                            My Team
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Employees currently assigned to you.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-4">

                            <input
                                type="text"
                                placeholder="Search employee..."
                                value={searchTerm}
                                onChange={(e) =>
                                    setSearchTerm(
                                        e.target.value
                                    )
                                }
                                className="w-72 rounded-lg border p-3"
                            />

                            <select
                                value={roleFilter}
                                onChange={(e) =>
                                    setRoleFilter(
                                        e.target.value
                                    )
                                }
                                className="rounded-lg border p-3"
                            >
                                <option value="">
                                    All Roles
                                </option>

                                {roles.map((role) => (
                                    <option
                                        key={role}
                                        value={role}
                                    >
                                        {role}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(
                                        e.target.value
                                    )
                                }
                                className="rounded-lg border p-3"
                            >
                                <option value="">
                                    All Statuses
                                </option>

                                {statuses.map(
                                    (status) => (
                                        <option
                                            key={status}
                                            value={status}
                                        >
                                            {status}
                                        </option>
                                    )
                                )}
                            </select>

                        </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
                        <p className="text-xs font-semibold uppercase text-slate-500">
                            Team Members
                        </p>

                        <p className="mt-1 text-2xl font-bold text-slate-950">
                            {employees.length}
                        </p>
                    </div>
                </div>

                {errorMessage && (
                    <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                        {errorMessage}
                    </div>
                )}

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    {loading ? (
                        <div className="p-8 text-sm font-medium text-slate-500">
                            Loading team members...
                        </div>
                    ) : employees.length === 0 ? (
                        <div className="p-8 text-sm font-medium text-slate-500">
                            No employees are assigned to you yet.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[860px]">
                                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                    <tr>
                                        <th className="px-5 py-3 text-left font-semibold">
                                            Employee
                                        </th>
                                        <th className="px-5 py-3 text-left font-semibold">
                                            Email
                                        </th>
                                        <th className="px-5 py-3 text-left font-semibold">
                                            Role
                                        </th>
                                        <th className="px-5 py-3 text-center font-semibold">
                                            Status
                                        </th>
                                        <th className="px-5 py-3 text-left font-semibold">
                                            Job Title
                                        </th>
                                        <th className="px-5 py-3 text-left font-semibold">
                                            Location
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">

                                    {filteredEmployees.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="p-8 text-center text-gray-500"
                                            >
                                                No team members found.
                                            </td>
                                        </tr>
                                    )}
                                    {filteredEmployees.map((employee) => (
                                        <tr
                                            key={employee.id}
                                            className="border-t cursor-pointer hover:bg-slate-50"
                                            onClick={() =>
                                                navigate(
                                                    `/manager/team/${employee.id}`
                                                )
                                            }
                                        >
                                            <td className="px-5 py-4">
                                                <p className="font-semibold text-slate-950">
                                                    {employee.fullname}
                                                </p>

                                                <p className="mt-1 text-sm text-slate-500">
                                                    {employee.employee_id}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4 text-sm text-slate-600">
                                                {employee.email}
                                            </td>

                                            <td className="px-5 py-4 text-sm text-slate-600">
                                                {formatLabel(employee.role)}
                                            </td>

                                            <td className="px-5 py-4 text-center">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                                                        statusStyles[
                                                            employee.status
                                                        ] ||
                                                        statusStyles.inactive
                                                    }`}
                                                >
                                                    {formatLabel(
                                                        employee.status
                                                    )}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 text-sm text-slate-600">
                                                {employee.job_title ||
                                                    "Not set"}
                                            </td>

                                            <td className="px-5 py-4 text-sm text-slate-600">
                                                {employee.work_location ||
                                                    "Not set"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

        </DashboardLayout>
    );
};

export default MyTeam;
