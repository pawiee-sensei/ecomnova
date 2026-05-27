const express = require("express");
const router = express.Router();

const verifyToken = require(
    "../middleware/authMiddleware"
);
const authorizePermission = require(
    "../middleware/permissionMiddleware"
);

const {
    getPermissionMatrix,
    updateRolePermissions
} = require(
    "../controllers/permissionController"
);

router.get(
    "/",
    verifyToken,
    authorizePermission("VIEW_PERMISSIONS"),
    getPermissionMatrix
);

router.put(
    "/roles/:role",
    verifyToken,
    authorizePermission("MANAGE_PERMISSIONS"),
    updateRolePermissions
);

module.exports = router;
