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
        getEmployeeAuditLogs,
        getDepartments,
        getTeams,
        getManagers
    } = require("../controllers/employeeController");

const router = express.Router();

/*
  HR-only workforce directory
*/

router.get(
    "/",
    verifyToken,
    authorizeRoles("hr", "super_admin"),
    getEmployees
);

router.get(
    "/audit-logs",
    verifyToken,
    authorizeRoles("hr", "super_admin"),
    getAuditLogs
);

router.get(
    "/:id/audit-logs",
    verifyToken,
    authorizeRoles("hr", "super_admin"),
    getEmployeeAuditLogs
);

router.get(
    "/departments",
    verifyToken,
    authorizeRoles("hr", "super_admin"),
    getDepartments
);

router.get(
    "/teams",
    verifyToken,
    authorizeRoles("hr", "super_admin"),
    getTeams
);

router.get(
    "/managers",
    verifyToken,
    authorizeRoles("hr", "super_admin"),
    getManagers
);

router.get(
    "/:id",
    verifyToken,
    authorizeRoles("hr", "super_admin"),
    getEmployeeById
);

router.put(
    "/:id",
    verifyToken,
    authorizeRoles("hr", "super_admin"),
    updateEmployee
);

router.post(
    "/",
    verifyToken,
    authorizeRoles("hr", "super_admin"),
    createEmployee
);

router.patch(
    "/:id/status",
    verifyToken,
    authorizeRoles("hr", "super_admin"),
    updateEmployeeStatus
);

router.patch(
    "/:id/reset-password",
    verifyToken,
    authorizeRoles("hr", "super_admin"),
    resetEmployeePassword
);

module.exports = router;
