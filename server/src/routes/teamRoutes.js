const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getDepartments,
    getTeamLeaders,
    getTeamById,
    updateTeam,
    getTeamMembers,
    getAvailableEmployees,
    assignMembersToTeam,
    removeMemberFromTeam
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
    authorizeRoles("hr", "super_admin"),
    getDepartments
);

router.get(
    "/leaders",
    verifyToken,
    authorizeRoles("hr", "super_admin"),
    getTeamLeaders
);



router.get(
    "/",
    verifyToken,
    authorizeRoles("hr", "super_admin"),
    getTeams
);

router.post(
    "/",
    verifyToken,
    authorizeRoles("hr", "super_admin"),
    createTeam
);

router.get(
    "/:id/members",
    verifyToken,
    authorizeRoles("hr", "super_admin"),
    getTeamMembers
);

router.get(
    "/:id/available-employees",
    verifyToken,
    authorizeRoles("hr", "super_admin"),
    getAvailableEmployees
);

router.put(
    "/:id/assign-members",
    verifyToken,
    authorizeRoles("hr", "super_admin"),
    assignMembersToTeam
);

router.put(
    "/remove-member/:employeeId",
    verifyToken,
    authorizeRoles("hr", "super_admin"),
    removeMemberFromTeam
);

router.get(
    "/:id",
    verifyToken,
    authorizeRoles("hr", "super_admin"),
    getTeamById
);

router.put(
    "/:id",
    verifyToken,
    authorizeRoles("hr", "super_admin"),
    updateTeam
);

module.exports = router;

