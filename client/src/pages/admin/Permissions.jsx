import {
    Fragment,
    useEffect,
    useMemo,
    useState
} from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

const roleLabels = {
    admin: "Admin",
    hr: "HR",
    manager: "Manager",
    leader: "Leader",
    agent: "Agent"
};

const formatPermissionName = (name) =>
    name.replaceAll("_", " ");

const Permissions = () => {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] =
        useState([]);
    const [matrix, setMatrix] = useState({});
    const [savingRole, setSavingRole] =
        useState("");
    const [statusMessage, setStatusMessage] =
        useState("");

    const permissionsByModule = useMemo(() => {
        return permissions.reduce(
            (groups, permission) => {
                const moduleName =
                    permission.module ||
                    "GENERAL";

                return {
                    ...groups,
                    [moduleName]: [
                        ...(groups[moduleName] || []),
                        permission
                    ]
                };
            },
            {}
        );
    }, [permissions]);

    const fetchPermissions = async () => {
        try {
            const response = await api.get(
                "/system/permissions"
            );

            setRoles(response.data.roles || []);
            setPermissions(
                response.data.permissions || []
            );
            setMatrix(response.data.matrix || {});
        } catch (error) {
            console.error(
                "Permission matrix fetch failed:",
                error
            );
            setStatusMessage(
                "Unable to load permission matrix."
            );
        }
    };

    useEffect(() => {
        fetchPermissions();
    }, []);

    const roleHasPermission = (
        role,
        permissionName
    ) => {
        return (matrix[role] || []).includes(
            permissionName
        );
    };

    const togglePermission = (
        role,
        permissionName
    ) => {
        setStatusMessage("");

        setMatrix((currentMatrix) => {
            const currentPermissions =
                currentMatrix[role] || [];
            const hasPermission =
                currentPermissions.includes(
                    permissionName
                );

            return {
                ...currentMatrix,
                [role]: hasPermission
                    ? currentPermissions.filter(
                          (item) =>
                              item !==
                              permissionName
                      )
                    : [
                          ...currentPermissions,
                          permissionName
                      ]
            };
        });
    };

    const saveRolePermissions = async (role) => {
        try {
            setSavingRole(role);
            setStatusMessage("");

            await api.put(
                `/system/permissions/roles/${role}`,
                {
                    permissions:
                        matrix[role] || []
                }
            );

            setStatusMessage(
                `${roleLabels[role] || role} permissions saved.`
            );
            fetchPermissions();
        } catch (error) {
            console.error(
                "Permission update failed:",
                error
            );
            setStatusMessage(
                error.response?.data?.message ||
                    "Permission update failed."
            );
        } finally {
            setSavingRole("");
        }
    };

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Permission Matrix
                </h1>

                <p className="text-gray-500">
                    Manage role permissions across system modules.
                </p>
            </div>

            {statusMessage && (
                <div className="mb-4 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                    {statusMessage}
                </div>
            )}

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full min-w-[900px]">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="w-[32%] p-4 text-left">
                                Permission
                            </th>

                            {roles.map((role) => (
                                <th
                                    key={role}
                                    className="p-4 text-center"
                                >
                                    {roleLabels[role] ||
                                        role}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {Object.entries(
                            permissionsByModule
                        ).map(
                            ([
                                moduleName,
                                modulePermissions
                            ]) => (
                                <Fragment key={moduleName}>
                                    <tr
                                        className="border-t bg-slate-50"
                                    >
                                        <td
                                            colSpan={
                                                roles.length +
                                                1
                                            }
                                            className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500"
                                        >
                                            {moduleName.replaceAll(
                                                "_",
                                                " "
                                            )}
                                        </td>
                                    </tr>

                                    {modulePermissions.map(
                                        (permission) => (
                                            <tr
                                                key={
                                                    permission.id
                                                }
                                                className="border-t"
                                            >
                                                <td className="p-4">
                                                    <p className="font-medium text-slate-950">
                                                        {formatPermissionName(
                                                            permission.name
                                                        )}
                                                    </p>

                                                    <p className="mt-1 text-sm text-slate-500">
                                                        {
                                                            permission.description
                                                        }
                                                    </p>
                                                </td>

                                                {roles.map(
                                                    (
                                                        role
                                                    ) => (
                                                        <td
                                                            key={`${role}-${permission.name}`}
                                                            className="p-4 text-center"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={roleHasPermission(
                                                                    role,
                                                                    permission.name
                                                                )}
                                                                onChange={() =>
                                                                    togglePermission(
                                                                        role,
                                                                        permission.name
                                                                    )
                                                                }
                                                                className="h-5 w-5 accent-slate-950"
                                                            />
                                                        </td>
                                                    )
                                                )}
                                            </tr>
                                        )
                                    )}
                                </Fragment>
                            )
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
                {roles.map((role) => (
                    <button
                        key={role}
                        onClick={() =>
                            saveRolePermissions(role)
                        }
                        disabled={savingRole === role}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {savingRole === role
                            ? "Saving..."
                            : `Save ${roleLabels[role] || role}`}
                    </button>
                ))}
            </div>
        </DashboardLayout>
    );
};

export default Permissions;
