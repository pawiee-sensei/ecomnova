const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const authorizePermission = require("../middleware/permissionMiddleware");

const {
    getAuditLogs
} = require(
    "../controllers/auditLogController"
);

router.get(
    "/",
    verifyToken,
    authorizePermission("VIEW_AUDIT_LOGS"),
    getAuditLogs
);

module.exports = router;
