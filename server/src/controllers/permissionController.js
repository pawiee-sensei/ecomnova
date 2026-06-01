const permissionService = require(
    "../services/permissionService"
);

const auditLogService = require(
    "../services/auditLogService"
);

const roleLabels = {
    admin: "Admin",
    hr: "HR",
    manager: "Manager",
    leader: "Leader",
    agent: "Agent"
};

const formatRoleName = (role) =>
    roleLabels[role] ||
    role
        .split("_")
        .map(
            (part) =>
                part.charAt(0).toUpperCase() +
                part.slice(1)
        )
        .join(" ");

const buildPermissionUpdateDetails = (
    role,
    addedPermissions,
    removedPermissions
) => {
    const roleName = formatRoleName(role);
    const details = [
        `Updated permissions for role ${roleName}.`
    ];

    if (
        addedPermissions.length === 0 &&
        removedPermissions.length === 0
    ) {
        details.push("No permission changes detected.");
        return details.join("\n");
    }

    if (addedPermissions.length > 0) {
        details.push(
            "",
            "Added:",
            addedPermissions.join(",\n")
        );
    }

    if (removedPermissions.length > 0) {
        details.push(
            "",
            "Removed:",
            removedPermissions.join(",\n")
        );
    }

    return details.join("\n");
};

const getPermissionMatrix = async (
    req,
    res
) => {
    try {
        const matrix =
            await permissionService.getPermissionMatrix();

        res.status(200).json(matrix);
    } catch (error) {
        res.status(500).json({
            message:
                "Failed to fetch permission matrix"
        });
    }
};

const updateRolePermissions = async (
    req,
    res
) => {
    try {
        const { role } = req.params;
        const { permissions } = req.body;

        const oldPermissions =
            await permissionService.getPermissionsByRole(
                role
            );

        await permissionService.replaceRolePermissions(
            role,
            permissions
        );

        const newPermissions =
            await permissionService.getPermissionsByRole(
                role
            );

        const addedPermissions = newPermissions.filter(
            (permission) =>
                !oldPermissions.includes(permission)
        );

        const removedPermissions =
            oldPermissions.filter(
                (permission) =>
                    !newPermissions.includes(permission)
            );

        await auditLogService.createAuditLog({
            actor_id: req.user.id,
            target_user_id: null,
            action: "PERMISSION_UPDATED",
            module: "ACCESS_CONTROL",
            details: buildPermissionUpdateDetails(
                role,
                addedPermissions,
                removedPermissions
            )
        });

        res.status(200).json({
            message:
                "Role permissions updated successfully"
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            message:
                error.message ||
                "Permission update failed"
        });
    }
};

module.exports = {
    getPermissionMatrix,
    updateRolePermissions
};
