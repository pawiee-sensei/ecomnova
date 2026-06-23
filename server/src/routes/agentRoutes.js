const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const { getDashboard, getAttendance } = require("../controllers/agentController");

router.get(
    "/dashboard",
    verifyToken,
    getDashboard
);

router.get(
    "/attendance",
    verifyToken,
    getAttendance
);

module.exports = router;