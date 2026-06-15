const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    getDepartmentPerformance
} = require("../controllers/performanceController");


router.get(
    "/department-performance",
    verifyToken,
    getDepartmentPerformance
);

module.exports = router;