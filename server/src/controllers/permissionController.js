const permissionService = require(
    "../services/permissionService"
);

const auditLogService = require(
    "../services/auditLogService"
);

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

        await permissionService.replaceRolePermissions(
            role,
            permissions
        );

        await auditLogService.createAuditLog({
            actor_id: req.user.id,
            target_user_id: null,
            action: "UPDATE_ROLE_PERMISSIONS",
            module: "ACCESS_CONTROL",
            details: `Updated permissions for ${role}`
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
