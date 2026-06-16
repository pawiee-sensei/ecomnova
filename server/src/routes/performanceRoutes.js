const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    getDepartmentPerformance,
    getDepartmentPerformanceHistory
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

module.exports = router;