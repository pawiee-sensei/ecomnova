const express = require("express");

const verifyToken =
    require("../middleware/authMiddleware");

const authorizeRoles =
    require("../middleware/roleMiddleware");

const {
    getEmployees
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

module.exports = router;