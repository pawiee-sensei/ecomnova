const express = require("express");

const verifyToken = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

const { getEmployees,
        createEmployee,
        getEmployeeById,
        updateEmployee,
        updateEmployeeStatus,
        resetEmployeePassword,
        getAuditLogs,
        getEmployeeAuditLogs
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
    "/audit-logs",
    verifyToken,
    authorizeRoles("admin", "super_admin"),
    getAuditLogs
);

router.get(
    "/:id/audit-logs",
    verifyToken,
    authorizeRoles("admin", "super_admin"),
    getEmployeeAuditLogs
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

router.patch(
    "/:id/reset-password",
    verifyToken,
    authorizeRoles("admin", "super_admin"),
    resetEmployeePassword
);

module.exports = router;