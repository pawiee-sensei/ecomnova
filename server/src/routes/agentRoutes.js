const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const {
    getDashboard,
    getAttendance,
    getLeave,
    createLeave
} = require("../controllers/agentController");

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

router.get(
    "/leave",
    verifyToken,
    getLeave
);

router.post(
    "/leave",
    verifyToken,
    createLeave
);

module.exports = router;