const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const authorizePermission = require(
    "../middleware/permissionMiddleware"
);

const {
    getLoginAttempts
} = require(
    "../controllers/loginAttemptController"
);

router.get(
    "/",
    verifyToken,
    authorizePermission("VIEW_LOGIN_MONITORING"),
    getLoginAttempts
);

module.exports = router;
