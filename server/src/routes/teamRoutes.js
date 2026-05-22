const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getDepartments,
    getTeamLeaders
    } = require("../controllers/teamController");

const {
    getTeams,
    createTeam
} = require(
    "../controllers/teamController"
);

router.get(
    "/departments",
    verifyToken,
    authorizeRoles("admin", "super_admin"),
    getDepartments
);

router.get(
    "/leaders",
    verifyToken,
    authorizeRoles("admin", "super_admin"),
    getTeamLeaders
);

router.get(
    "/",
    verifyToken,
    authorizeRoles("admin", "super_admin"),
    getTeams
);

router.post(
    "/",
    verifyToken,
    authorizeRoles("admin", "super_admin"),
    createTeam
);

module.exports = router;