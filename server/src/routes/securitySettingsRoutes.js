const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const authorizePermission = require("../middleware/permissionMiddleware");

const {
    getSecuritySettings,
    updateSecuritySettings
} = require(
    "../controllers/securitySettingsController"
);

router.get(
    "/",
    verifyToken,
    authorizePermission(
        "MANAGE_SECURITY_SETTINGS"
    ),
    getSecuritySettings
);

router.put(
    "/",
    verifyToken,
    authorizePermission(
        "MANAGE_SECURITY_SETTINGS"
    ),
    updateSecuritySettings
);

module.exports = router;