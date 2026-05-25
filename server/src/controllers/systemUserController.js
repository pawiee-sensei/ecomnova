const systemUserService = require(
    "../services/systemUserService"
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