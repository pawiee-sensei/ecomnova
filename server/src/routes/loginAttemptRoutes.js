const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getLoginAttempts
} = require(
    "../controllers/loginAttemptController"
);

router.get(
    "/",
    verifyToken,
    authorizeRoles("admin"),
    getLoginAttempts
);

module.exports = router;