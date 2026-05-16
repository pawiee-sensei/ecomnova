const express = require("express");

const verifyToken = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

const { getEmployees,
        createEmployee,
        getEmployeeById,
        updateEmployee,
        updateEmployeeStatus
    } = require("../controllers/employeeController");

const router = express.Router();

/*
  Admin-only workforce directory
*/

router.get(
    "/",
    verifyToken,
    authorizeRoles("admin", "super_admin"),
    getEmployees
);

router.get(
    "/:id",
    verifyToken,
    authorizeRoles("admin", "super_admin"),
    getEmployeeById
);

router.put(
    "/:id",
    verifyToken,
    authorizeRoles("admin", "super_admin"),
    updateEmployee
);

router.post(
    "/",
    verifyToken,
    authorizeRoles("admin", "super_admin"),
    createEmployee
);

router.patch(
    "/:id/status",
    verifyToken,
    authorizeRoles("admin", "super_admin"),
    updateEmployeeStatus
);

module.exports = router;