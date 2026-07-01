const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const {
    getDashboard,
    getAttendance,
    getLeave,
    createLeave,
    getTickets,
    updateTicketStatus,
    getPerformance,
    getTodayAttendance,
    clockIn,
    clockOut,
    getTicketComments,
    addTicketComment,
    createTicket,
    getAnnouncements,
} = require("../controllers/agentController");

router.get(
    "/dashboard",
    verifyToken,
    getDashboard
);

router.get(
    "/attendance",
    verifyToken,
    getAttendance
);

router.get(
    "/leave",
    verifyToken,
    getLeave
);

router.post(
    "/leave",
    verifyToken,
    createLeave
);

router.get(
    "/tickets",
    verifyToken,
    getTickets
);

router.post(
    "/tickets",
    verifyToken,
    createTicket
);

router.get(
    "/announcements",
    verifyToken,
    getAnnouncements
);

router.put(
    "/tickets/:id/status",
    verifyToken,
    updateTicketStatus
);

router.get(
    "/tickets/:id/comments",
    verifyToken,
    getTicketComments
);

router.post(
    "/tickets/:id/comments",
    verifyToken,
    addTicketComment
);

router.get(
    "/performance",
    verifyToken,
    getPerformance
);

router.get(
    "/attendance/today",
    verifyToken,
    getTodayAttendance
);

router.post(
    "/attendance/clock-in",
    verifyToken,
    clockIn
);

router.post(
    "/attendance/clock-out",
    verifyToken,
    clockOut
);



module.exports = router;