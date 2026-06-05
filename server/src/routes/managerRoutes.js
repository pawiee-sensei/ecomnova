const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    getMyTeam,
    getTeamMember,
    getTeamOverview,
    getTeamActivity,
    createCoachingNote,
    getCoachingNotes
} = require("../controllers/managerController");

router.post(
    "/coaching-notes",
    verifyToken,
    createCoachingNote
);

router.get(
    "/coaching-notes/:employeeId",
    verifyToken,
    getCoachingNotes
);

router.get(
    "/team-overview",
    verifyToken,
    getTeamOverview
);

router.get(
    "/team-activity",
    verifyToken,
    getTeamActivity
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