const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const { getDashboard } = require("../controllers/agentController");

router.get(
    "/dashboard",
    verifyToken,
    getDashboard
);

module.exports = router;