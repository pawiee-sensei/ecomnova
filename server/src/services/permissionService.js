const permissionModel = require(
    "../models/permissionModel"
);

const editableRoles = [
    "admin",
    "hr",
    "manager",
    "leader",
    "agent"
];

const getPermissionMatrix = async () => {
    const permissions = await new Promise(
        (resolve, reject) => {
            permissionModel.getPermissions(
                (err, results) => {
                    if (err) return reject(err);

                    resolve(results);
                }
            );
        }
    );

    const rolePermissions = await new Promise(
        (resolve, reject) => {
            permissionModel.getRolePermissions(
                (err, results) => {
                    if (err) return reject(err);

                    resolve(results);
                }
            );
        }
    );

    const matrix = editableRoles.reduce(
        (acc, role) => ({
            ...acc,
            [role]: []
        }),
        {}
    );

    rolePermissions.forEach((item) => {
        if (!matrix[item.role]) {
            matrix[item.role] = [];
        }

        matrix[item.role].push(item.permission);
    });

    return {
        roles: editableRoles,
        permissions,
        matrix
    };
};

const roleHasPermission = async (
    role,
    permission
) => {
    if (role === "super_admin") {
        return true;
    }

    return new Promise((resolve, reject) => {
        permissionModel.roleHasPermission(
            role,
            permission,
            (err, results) => {
                if (err) return reject(err);

                resolve(results.length > 0);
            }
        );
    });
};

const getPermissionsByRole = async (role) => {
    return new Promise((resolve, reject) => {
        permissionModel.getPermissionsByRole(
            role,
            (err, results) => {
                if (err) return reject(err);

                resolve(
                    results.map((item) => item.permission)
                );
            }
        );
    });
};

const replaceRolePermissions = async (
    role,
    permissions
) => {
    if (!editableRoles.includes(role)) {
        const error = new Error(
            "Role permissions cannot be edited"
        );
        error.statusCode = 400;
        throw error;
    }

    const normalizedPermissions = Array.isArray(
        permissions
    )
        ? permissions
        : [];

    return new Promise((resolve, reject) => {
        permissionModel.replaceRolePermissions(
            role,
            normalizedPermissions,
            (err, result) => {
                if (err) return reject(err);

                resolve(result);
            }
        );
    });
};

module.exports = {
    getPermissionMatrix,
    roleHasPermission,
    getPermissionsByRole,
    replaceRolePermissions
};
