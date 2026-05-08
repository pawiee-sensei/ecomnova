const express = require("express");

const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getCurrentUser,
    updateUserRole
} = require("../controllers/userController");

const router = express.Router();

router.get(
    "/me",
    verifyToken,
    getCurrentUser
);

router.put(
    "/role/:id",
    verifyToken,
    authorizeRoles("admin"),
    updateUserRole
);

module.exports = router;