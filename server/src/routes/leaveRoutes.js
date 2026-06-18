const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");

const {
    getLeaveRequests,
    approveLeaveRequest,
    rejectLeaveRequest,
    createLeaveRequest,
} = require("../controllers/leaveController");

router.get(
    "/",
    verifyToken,
    getLeaveRequests
);

router.put(
    "/:id/approve",
    verifyToken,
    approveLeaveRequest
);

router.put(
    "/:id/reject",
    verifyToken,
    rejectLeaveRequest
);

router.post(
    "/",
    verifyToken,
    createLeaveRequest
);

module.exports = router;