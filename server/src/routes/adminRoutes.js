const express = require("express");

const verifyToken =
    require("../middleware/authMiddleware");

const authorizeRoles =
    require("../middleware/roleMiddleware");

const {
    getDashboardStats
} = require("../controllers/adminController");

const router = express.Router();

/*
  Only admin can access dashboard stats
*/

router.get(
    "/dashboard",
    verifyToken,
    authorizeRoles("admin", "super_admin"),
    getDashboardStats
);

module.exports = router;