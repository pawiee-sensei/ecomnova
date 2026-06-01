
const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const authorizePermission = require("../middleware/permissionMiddleware");

const {getDashboardMetrics} = require("../controllers/systemDashboardController");

router.get(
    "/metrics",
    verifyToken,
    authorizePermission(
        "VIEW_SYSTEM_DASHBOARD"
    ),
    getDashboardMetrics
);

module.exports = router;