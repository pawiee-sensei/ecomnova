const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getDepartments,
    createDepartment,
    getDepartmentById,
    updateDepartment,
    getDepartmentHeads,
    getDepartmentMembers
} = require("../controllers/departmentController");

router.get(
    "/",
    verifyToken,
    authorizeRoles("hr", "super_admin"),
    getDepartments
);

router.get(
    "/heads",
    verifyToken,
    authorizeRoles("hr", "super_admin"),
    getDepartmentHeads
);

router.get(
    "/:id/members",
    verifyToken,
    authorizeRoles("hr", "super_admin"),
    getDepartmentMembers
);

router.post(
    "/",
    verifyToken,
    authorizeRoles("hr", "super_admin"),
    createDepartment
);


router.get(
    "/:id",
    verifyToken,
    authorizeRoles("hr", "super_admin"),
    getDepartmentById
);

router.put(
    "/:id",
    verifyToken,
    authorizeRoles("hr", "super_admin"),
    updateDepartment
);

module.exports = router;

