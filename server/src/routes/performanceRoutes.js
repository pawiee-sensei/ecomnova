const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    getDepartmentPerformance,
    getDepartmentPerformanceHistory,
    getInsights,
    getAlerts
} = require("../controllers/performanceController");


router.get(
    "/department-performance",
    verifyToken,
    getDepartmentPerformance
);

router.get(
    "/history",
    verifyToken,
    getDepartmentPerformanceHistory
);

router.get(
    "/insights",
    verifyToken,
    getInsights
);

router.get(
    "/alerts",
    verifyToken,
    getAlerts
);

module.exports = router;