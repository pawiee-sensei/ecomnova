import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

const SystemUsers = () => {
    const [users, setUsers] =
        useState([]);

    const [searchTerm, setSearchTerm] =
    useState("");

const [roleFilter, setRoleFilter] =
    useState("");

const [securityFilter, setSecurityFilter] =
    useState("");

const [statusFilter, setStatusFilter] =
    useState("");

    const fetchUsers = async () => {
        try {
            const response =
                await api.get(
                    "/system/users"
                );

            setUsers(
                response.data
            );

        } catch (error) {
            console.error(
                "System users fetch failed:",
                error
            );
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    /*
      Role update
    */

    const handleRoleChange = async (
        userId,
        role
    ) => {
        try {
            await api.put(
                `/system/users/${userId}/role`,
                { role }
            );

            fetchUsers();

        } catch (error) {
            console.error(
                "Role update failed:",
                error
            );
        }
    };

    /*
      Lock / unlock
    */

    const handleSecurityChange =
        async (
            userId,
            securityStatus
        ) => {
            try {
                await api.put(
                    `/system/users/${userId}/security-status`,
                    {
                        security_status:
                            securityStatus
                    }
                );

                fetchUsers();

            } catch (error) {
                console.error(
                    "Security update failed:",
                    error
                );
            }
        };

    const handleForceLogout = async (userId) => {
        try {
            await api.put(
                `/system/users/${userId}/force-logout`
            );

            alert(
                "User sessions revoked successfully"
            );

            fetchUsers();

        } catch (error) {
            console.error(
                "Force logout failed:",
                error
            );
        }
    };

        const filteredUsers = users.filter(
    (user) => {
        const matchesSearch =
            user.fullname
                ?.toLowerCase()
                .includes(
                    searchTerm.toLowerCase()
                ) ||
            user.email
                ?.toLowerCase()
                .includes(
                    searchTerm.toLowerCase()
                ) ||
            user.employee_id
                ?.toLowerCase()
                .includes(
                    searchTerm.toLowerCase()
                );

        const matchesRole =
            !roleFilter ||
            user.role === roleFilter;

        const matchesSecurity =
            !securityFilter ||
            user.security_status ===
                securityFilter;

        const matchesStatus =
            !statusFilter ||
            user.status === statusFilter;

        return (
            matchesSearch &&
            matchesRole &&
            matchesSecurity &&
            matchesStatus
        );
    }
);

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    System Users
                </h1>

                <p className="text-gray-500">
                    Security access governance
                </p>

                <div className="mt-6 flex gap-4 flex-wrap">

                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(
                                e.target.value
                            )
                        }
                        className="border p-3 rounded-lg w-72"
                    />

                    <select
                        value={roleFilter}
                        onChange={(e) =>
                            setRoleFilter(
                                e.target.value
                            )
                        }
                        className="border p-3 rounded-lg"
                    >
                        <option value="">
                            All Roles
                        </option>

                        <option value="agent">
                            Agent
                        </option>

                        <option value="leader">
                            Leader
                        </option>

                        <option value="manager">
                            Manager
                        </option>

                        <option value="hr">
                            HR
                        </option>

                        <option value="admin">
                            Admin
                        </option>
                    </select>

                    <select
                        value={securityFilter}
                        onChange={(e) =>
                            setSecurityFilter(
                                e.target.value
                            )
                        }
                        className="border p-3 rounded-lg"
                    >
                        <option value="">
                            All Security
                        </option>

                        <option value="locked">
                            Locked
                        </option>

                        <option value="unlocked">
                            Unlocked
                        </option>
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(
                                e.target.value
                            )
                        }
                        className="border p-3 rounded-lg"
                    >
                        <option value="">
                            All HR Status
                        </option>

                        <option value="active">
                            Active
                        </option>

                        <option value="inactive">
                            Inactive
                        </option>

                        <option value="suspended">
                            Suspended
                        </option>

                        <option value="terminated">
                            Terminated
                        </option>
                    </select>

                </div>
            </div>

            <div className="border rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left p-4">
                                Employee
                            </th>

                            <th className="text-left p-4">
                                Email
                            </th>

                            <th className="text-left p-4">
                                Role
                            </th>

                            <th className="text-left p-4">
                                HR Status
                            </th>

                            <th className="text-left p-4">
                                Security
                            </th>

                            <th className="text-left p-4">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr
                                key={user.id}
                                className="border-t"
                            >
                                <td className="p-4">
                                    {user.fullname}
                                </td>

                                <td className="p-4">
                                    {user.email}
                                </td>

                                <td className="p-4 capitalize">
                                    {user.role}
                                </td>

                                <td className="p-4 capitalize">
                                    {user.status}
                                </td>

                                <td className="p-4 capitalize">
                                    {user.security_status}
                                </td>

                                <td className="p-4 flex gap-2">
                                    <select
                                        defaultValue={
                                            user.role
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            handleRoleChange(
                                                user.id,
                                                e
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="border p-2 rounded-lg"
                                    >
                                        <option value="agent">
                                            Agent
                                        </option>

                                        <option value="leader">
                                            Leader
                                        </option>

                                        <option value="manager">
                                            Manager
                                        </option>

                                        <option value="hr">
                                            HR
                                        </option>

                                        <option value="admin">
                                            Admin
                                        </option>
                                    </select>

                                    <button
                                        onClick={() =>
                                            handleSecurityChange(
                                                user.id,
                                                user.security_status ===
                                                    "locked"
                                                    ? "unlocked"
                                                    : "locked"
                                            )
                                        }
                                        className="border px-4 py-2 rounded-lg"
                                    >
                                        {user.security_status ===
                                        "locked"
                                            ? "Unlock"
                                            : "Lock"}
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleForceLogout(user.id)
                                        }
                                        className="border px-4 py-2 rounded-lg"
                                    >
                                        Force Logout
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
};

export default SystemUsers;