const permissionService = require(
    "../services/permissionService"
);

const authorizePermission = (permission) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: "Access denied"
            });
        }

        try {
            const allowed =
                await permissionService.roleHasPermission(
                    req.user.role,
                    permission
                );

            if (!allowed) {
                return res.status(403).json({
                    message: "Permission denied"
                });
            }

            next();
        } catch (error) {
            res.status(500).json({
                message:
                    "Permission check failed"
            });
        }
    };
};

module.exports = authorizePermission;
