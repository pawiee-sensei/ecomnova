const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    getMyTeam,
    getTeamMember,
    getTeamOverview
} = require("../controllers/managerController");

router.get(
    "/team-overview",
    verifyToken,
    getTeamOverview
);

router.get(
    "/team",
    verifyToken,
    getMyTeam
);

router.get(
    "/team/:id",
    verifyToken,
    getTeamMember
);

module.exports = router;