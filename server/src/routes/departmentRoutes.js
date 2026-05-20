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
    authorizeRoles("admin", "super_admin"),
    getDepartments
);

router.get(
    "/heads",
    verifyToken,
    authorizeRoles("admin", "super_admin"),
    getDepartmentHeads
);

router.get(
    "/:id/members",
    verifyToken,
    authorizeRoles("admin", "super_admin"),
    getDepartmentMembers
);

router.post(
    "/",
    verifyToken,
    authorizeRoles("admin", "super_admin"),
    createDepartment
);


router.get(
    "/:id",
    verifyToken,
    authorizeRoles("admin", "super_admin"),
    getDepartmentById
);

router.put(
    "/:id",
    verifyToken,
    authorizeRoles("admin", "super_admin"),
    updateDepartment
);

module.exports = router;
