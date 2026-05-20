const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    getDepartmentById,
    updateDepartment,
    getDepartmentHeads
} = require("../controllers/departmentController");

const {
    getDepartments,
    createDepartment
} = require("../controllers/departmentController");

router.get(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    getDepartments
);

router.get(
    "/heads",
    verifyToken,
    authorizeRoles("admin", "super_admin"),
    getDepartmentHeads
);

router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
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