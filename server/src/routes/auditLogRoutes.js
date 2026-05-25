const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getAuditLogs
} = require(
    "../controllers/auditLogController"
);

router.get(
    "/",
    verifyToken,
    authorizeRoles("admin", "super_admin"),
    getAuditLogs
);

module.exports = router;