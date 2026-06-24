const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    getMyTeam,
    getTeamMember,
    getTeamOverview,
    getTeamActivity,
    createCoachingNote,
    getCoachingNotes,
    createAnnouncement,
    getAnnouncements,
    archiveAnnouncement,
    updateAnnouncement,
    createAttendanceRecord,
    getTeamAttendance,
    getAttendanceSummary,
    getAttendanceAnalytics,
    getEmployeeAttendanceHistory,
    getAttendanceAlerts,
    updateEmployeeShift,
    exportAttendanceReport,
    exportLeaveReport,
    exportPerformanceReport,
    getShiftSchedules,
    updateShiftSchedule,
} = require("../controllers/managerController");

router.get(
    "/attendance-alerts",
    verifyToken,
    getAttendanceAlerts
);

router.get(
    "/attendance-history/:employeeId",
    verifyToken,
    getEmployeeAttendanceHistory
);

router.get(
    "/attendance-analytics",
    verifyToken,
    getAttendanceAnalytics
);

router.post(
    "/attendance-records",
    verifyToken,
    createAttendanceRecord
);

router.post(
    "/attendance",
    verifyToken,
    createAttendanceRecord
);

router.get(
    "/attendance",
    verifyToken,
    getTeamAttendance
);

router.get(
    "/attendance-summary",
    verifyToken,
    getAttendanceSummary
);

router.get(
    "/announcements",
    verifyToken,
    getAnnouncements
);

router.put(
    "/announcements/:id/archive",
    verifyToken,
    archiveAnnouncement
);

router.put(
    "/announcements/:id",
    verifyToken,
    updateAnnouncement
);

router.post(
    "/coaching-notes",
    verifyToken,
    createCoachingNote
);

router.get(
    "/coaching-notes/:employeeId",
    verifyToken,
    getCoachingNotes
);

router.get(
    "/team-overview",
    verifyToken,
    getTeamOverview
);

router.get(
    "/team-activity",
    verifyToken,
    getTeamActivity
);

router.get(
    "/team",
    verifyToken,
    getMyTeam
);

router.get(
    "/team/:id",
    verifyToken,
    getTeamMember
);

router.put(
    "/team/:id/shift",
    verifyToken,
    updateEmployeeShift
);

router.get(
    "/shift-schedules",
    verifyToken,
    getShiftSchedules
);

router.put(
    "/shift-schedules/:id",
    verifyToken,
    updateShiftSchedule
);

router.get(
    "/reports/attendance",
    verifyToken,
    exportAttendanceReport
);

router.get(
    "/reports/leave",
    verifyToken,
    exportLeaveReport
);

router.get(
    "/reports/performance",
    verifyToken,
    exportPerformanceReport
);



module.exports = router;