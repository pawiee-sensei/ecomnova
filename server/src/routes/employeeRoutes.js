const express = require("express");

const verifyToken = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

const { getEmployees, createEmployee } = require("../controllers/employeeController");

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

router.post(
    "/",
    verifyToken,
    authorizeRoles("admin", "super_admin"),
    createEmployee
);

module.exports = router;