const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    getDepartmentPerformance,
    getDepartmentPerformanceHistory,
    getInsights,
    getAlerts,
    getKPIs,
    setKPI,
    updateActualValue
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

router.get(
    "/kpi",
    verifyToken,
    getKPIs
);

router.post(
    "/kpi",
    verifyToken,
    setKPI
);

router.put(
    "/kpi/:id",
    verifyToken,
    updateActualValue
);

module.exports = router;