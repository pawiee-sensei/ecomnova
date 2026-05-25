const systemUserService = require(
    "../services/systemUserService"
);

const auditLogService = require(
    "../services/auditLogService"
);

/*
  Fetch system users
*/

const getSystemUsers = async (
    req,
    res
) => {
    try {
        const users =
            await systemUserService.getSystemUsers();

        res.status(200).json(users);

    } catch (error) {
        res.status(500).json({
            message:
                "Failed to fetch system users"
        });
    }
};

/*
  Change role
*/

const updateUserRole = async (
    req,
    res
) => {
    try {
        const { role } = req.body;

        await systemUserService.updateUserRole(
            req.params.id,
            role
        );

        await auditLogService.createAuditLog({
            actor_id: req.user.id,
            target_user_id: req.params.id,
            action: "CHANGE_ROLE",
            module: "ACCESS_CONTROL",
            details: `Role changed to ${role}`
        }); 

        res.status(200).json({
            message:
                "Role updated successfully"
        });

    } catch (error) {
        res.status(500).json({
            message:
                "Role update failed"
        });
    }
};

/*
  Lock / unlock account
*/

const updateSecurityStatus = async (
    req,
    res
) => {
    try {
        const { security_status } = req.body;

        await systemUserService.updateSecurityStatus(
            req.params.id,
            security_status
        );

        await auditLogService.createAuditLog({
            actor_id: req.user.id,
            target_user_id: req.params.id,
            action:
                security_status === "locked"
                    ? "LOCK_ACCOUNT"
                    : "UNLOCK_ACCOUNT",
            module: "SECURITY",
            details:
                security_status === "locked"
                    ? "Account locked"
                    : "Account unlocked"
        });

        res.status(200).json({
            message:
                "Security status updated"
        });

    } catch (error) {
        res.status(500).json({
            message:
                "Security update failed"
        });
    }
};

module.exports = {
    getSystemUsers,
    updateUserRole,
    updateSecurityStatus
};