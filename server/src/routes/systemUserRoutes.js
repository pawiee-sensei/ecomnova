const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getSystemUsers,
    updateUserRole,
    updateSecurityStatus
} = require(
    "../controllers/systemUserController"
);

router.get(
    "/",
    verifyToken,
    authorizeRoles("admin", "super_admin"),
    getSystemUsers
);

router.put(
    "/:id/role",
    verifyToken,
    authorizeRoles("admin", "super_admin"),
    updateUserRole
);

router.put(
    "/:id/security-status",
    verifyToken,
    authorizeRoles("admin", "super_admin"),
    updateSecurityStatus
);

module.exports = router;