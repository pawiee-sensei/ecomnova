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

router.get(
    "/available-employees",
    verifyToken,
    authorizeRoles("admin", "super_admin"),
    getAvailableEmployees
);

router.get(
    "/:id/members",
    verifyToken,
    authorizeRoles("admin", "super_admin"),
    getTeamMembers
);

router.put(
    "/:id/assign-members",
    verifyToken,
    authorizeRoles("admin", "super_admin"),
    assignMembersToTeam
);

router.put(
    "/remove-member/:employeeId",
    verifyToken,
    authorizeRoles("admin", "super_admin"),
    removeMemberFromTeam
);

router.get(
    "/:id",
    verifyToken,
    authorizeRoles("admin", "super_admin"),
    getTeamById
);

router.put(
    "/:id",
    verifyToken,
    authorizeRoles("admin", "super_admin"),
    updateTeam
);

module.exports = router;