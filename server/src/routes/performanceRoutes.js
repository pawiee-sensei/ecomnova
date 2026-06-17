const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    getDepartmentPerformance,
    getDepartmentPerformanceHistory,
    getInsights
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

module.exports = router;