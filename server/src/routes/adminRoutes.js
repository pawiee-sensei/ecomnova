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
  HR can access workforce dashboard stats
*/

router.get(
    "/dashboard",
    verifyToken,
    authorizeRoles("hr", "super_admin"),
    getDashboardStats
);

module.exports = router;
