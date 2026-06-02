const express = require("express");

const router = express.Router();


const verifyToken = require("../middleware/authMiddleware");


const {
    getMyTeam
} = require(
    "../controllers/managerController"
);

router.get(
    "/team",
    verifyToken,
    getMyTeam
);

module.exports = router;