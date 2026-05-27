const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const authorizePermission = require(
    "../middleware/permissionMiddleware"
);

const {
    getSystemUsers,
    updateUserRole,
    updateSecurityStatus,
    forceLogoutUser
} = require(
    "../controllers/systemUserController"
);

router.get(
    "/",
    verifyToken,
    authorizePermission("VIEW_SYSTEM_USERS"),
    getSystemUsers
);

router.put(
    "/:id/force-logout",
    verifyToken,
    authorizePermission("FORCE_LOGOUT"),
    forceLogoutUser
);

router.put(
    "/:id/role",
    verifyToken,
    authorizePermission("MANAGE_USER_ROLES"),
    updateUserRole
);

router.put(
    "/:id/security-status",
    verifyToken,
    authorizePermission("LOCK_ACCOUNT"),
    updateSecurityStatus
);

module.exports = router;
