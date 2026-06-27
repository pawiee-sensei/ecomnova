const managerService = require(
    "../services/managerService"
);

const getMyTeam =
    async (req, res) => {
        try {

            const managerId =
                req.user.id;

            const employees =
                await managerService.getManagerTeam(
                    managerId
                );

            res.status(200).json(
                employees
            );

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Failed to load team members"
            });
        }
    };

    const getTeamMember =
    async (
        req,
        res
    ) => {

        try {

            const employeeId =
                req.params.id;

            const managerId =
                req.user.id;

            const employee =
                await managerService.getTeamMemberById(
                    employeeId,
                    managerId
                );

            if (
                !employee
            ) {
                return res
                    .status(404)
                    .json({
                        message:
                            "Employee not found"
                    });
            }

            res.json(
                employee
            );

        } catch (
            error
        ) {

            console.error(
                error
            );

            res
                .status(500)
                .json({
                    message:
                        "Failed to fetch employee"
                });
        }
    };

    const getTeamOverview =
    async (req, res) => {

        try {

            const overview =
                await managerService.getTeamOverview(
                    req.user.id
                );

            res.json(
                overview
            );

        } catch (error) {

            console.error(
                error
            );

            res.status(500).json({
                message:
                    "Failed to load team overview"
            });
        }
    };

    const getTeamActivity =
    async (req, res) => {

        try {

            const activity =
                await managerService.getTeamActivity(
                    req.user.id
                );

            res.json(
                activity
            );

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Failed to load team activity"
            });
        }
    };

    const createCoachingNote =
    async (req, res) => {

        try {

            const {
                employeeId,
                category,
                note
            } = req.body;

            await managerService.createCoachingNote(
                employeeId,
                req.user.id,
                category,
                note
            );

            res.status(201).json({
                message:
                    "Coaching note created"
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    error.message
            });
        }
    };

const getCoachingNotes =
    async (req, res) => {

        try {

            const notes =
                await managerService.getCoachingNotes(
                    req.params.employeeId,
                    req.user.id
                );

            res.json(notes);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    error.message
            });
        }
    };

    const createAnnouncement =
    async (req, res) => {

        try {

            const {
                title,
                content,
                status,
                effectiveDate
            } = req.body;

            await managerService.createAnnouncement(
                title,
                content,
                status,
                effectiveDate,
                req.user.id
            );

            res.status(201).json({
                message:
                    "Announcement created"
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Failed to create announcement"
            });
        }
    };

const getAnnouncements =
    async (req, res) => {

        try {

            const announcements =
                await managerService.getAnnouncements(
                    req.user.id
                );

            res.json(
                announcements
            );

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Failed to load announcements"
            });
        }
    };

    const archiveAnnouncement =
    async (req, res) => {

        try {

            await managerService.archiveAnnouncement(
                req.params.id,
                req.user.id
            );

            res.json({
                message:
                    "Announcement archived"
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Failed to archive announcement"
            });
        }
    };

    const updateAnnouncement =
    async (req, res) => {

        try {

            const {
                title,
                content,
                status,
                effectiveDate
            } = req.body;

            await managerService.updateAnnouncement(
                req.params.id,
                req.user.id,
                title,
                content,
                status,
                effectiveDate
            );

            res.json({
                message:
                    "Announcement updated"
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Failed to update announcement"
            });
        }
    };

    const createAttendanceRecord =
    async (req, res) => {

        try {

            const {
                employeeId,
                attendanceDate,
                status
            } = req.body;

            await managerService.createAttendanceRecord(
                employeeId,
                attendanceDate,
                status
            );

            res.status(201).json({
                message:
                    "Attendance record created"
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Failed to create attendance record"
            });
        }
    };

    const getTeamAttendance =
    async (req, res) => {

        try {

            const attendance =
                await managerService.getTeamAttendance(
                    req.user.id
                );

            res.json(
                attendance
            );

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Failed to load attendance"
            });
        }
    };

    const getAttendanceSummary =
    async (req, res) => {

        try {

            const summary =
                await managerService.getAttendanceSummary(
                    req.user.id
                );

            res.json(
                summary
            );

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Failed to load attendance summary"
            });
        }
    };
    const getAttendanceAnalytics =
    async (req, res) => {

        try {

            const analytics =
                await managerService.getAttendanceAnalytics(
                    req.user.id
                );

            res.json(
                analytics
            );

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Failed to load attendance analytics"
            });
        }
    };

    const getEmployeeAttendanceHistory =
    async (req, res) => {

        try {

            const history =
                await managerService.getEmployeeAttendanceHistory(
                    req.params.employeeId,
                    req.user.id
                );

            res.json(
                history
            );

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Failed to load attendance history"
            });
        }
    };

    const getAttendanceAlerts =
    async (req, res) => {

        try {

            const records =
                await managerService.getAttendanceAlerts(
                    req.user.id
                );

            const employeeMap =
                {};

            records.forEach(
                (
                    record
                ) => {

                    if (
                        !employeeMap[
                            record.id
                        ]
                    ) {

                        employeeMap[
                            record.id
                        ] = {
                            fullname:
                                record.fullname,
                            records: []
                        };
                    }

                    employeeMap[
                        record.id
                    ].records.push(
                        record.status
                    );
                }
            );

            const alerts =
                [];

            Object.values(
                employeeMap
            ).forEach(
                (
                    employee
                ) => {

                    const recent =
                        employee.records.slice(
                            0,
                            3
                        );
                    
                    const presentCount =
                        employee.records.filter(
                            (
                                status
                            ) =>
                                status ===
                                "present"
                        ).length;

                    const lateCount =
                        employee.records.filter(
                            (
                                status
                            ) =>
                                status ===
                                "late"
                        ).length;

                    const absentCount =
                        employee.records.filter(
                            (
                                status
                            ) =>
                                status ===
                                "absent"
                        ).length;

                    const leaveCount =
                        employee.records.filter(
                            (
                                status
                            ) =>
                                status ===
                                "leave"
                        ).length;

                    const totalRecords =
                        presentCount +
                        lateCount +
                        absentCount +
                        leaveCount;

                    const attendanceRate =
                        totalRecords === 0
                            ? 0
                            : Math.round(
                                (
                                    presentCount /
                                    totalRecords
                                ) *
                                    100
                            );

                        const allAbsent =
                            recent.length === 3 &&
                            recent.every(
                                (status) =>
                                    status === "absent"
                            );

                        const allLate =
                            recent.length === 3 &&
                            recent.every(
                                (status) =>
                                    status === "late"
                            );

                    if (
                        allAbsent
                    ) {

                        alerts.push({
                            type:
                                "absence",
                            employee:
                                employee.fullname,
                            message:
                                "3 consecutive absences"
                        });
                    }

                    if (
                        allLate
                    ) {

                        alerts.push({
                            type:
                                "late",
                            employee:
                                employee.fullname,
                            message:
                                "3 consecutive late records"
                        });
                    }

                    if (
                        totalRecords >= 5 &&
                        attendanceRate < 75
                    ) {

                        alerts.push({
                            type:
                                "attendance-risk",

                            employee:
                                employee.fullname,

                            message:
                                `Attendance Rate below 75% (${attendanceRate}%)`
                        });
                    }

                    const recentFive =
                        employee.records.slice(
                            0,
                            5
                        );

                    const perfectAttendance =
                        recentFive.length === 5 &&
                        recentFive.every(
                            (
                                status
                            ) =>
                                status ===
                                "present"
                        );

                    if (
                        perfectAttendance
                    ) {

                        alerts.push({
                            type:
                                "recognition",

                            employee:
                                employee.fullname,

                            message:
                                "Perfect attendance candidate (5 consecutive presents)"
                        });
                    }
                }
            );

            res.json(
                alerts
            );

        } catch (
            error
        ) {

            console.error(
                error
            );

            res.status(
                500
            ).json({
                message:
                    "Failed to load alerts"
            });
        }
    };

    const updateEmployeeShift = async (req, res) => {
    try {
        const managerId = req.user.id;
        const { id } = req.params;
        const { shift } = req.body;

        if (!shift) {
            return res.status(400).json({ message: "Shift is required" });
        }

        await managerService.updateEmployeeShift(id, managerId, shift);
        res.json({ message: "Shift updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

const exportAttendanceReport = async (req, res) => {
    try {
        const managerId = req.user.id;
        const { startDate, endDate } = req.query;

        const attendance = await managerService.getTeamAttendance(managerId);

        let filtered = attendance;
        if (startDate && endDate) {
            filtered = attendance.filter((r) => {
                const date = new Date(r.attendance_date);
                return date >= new Date(startDate) && date <= new Date(endDate);
            });
        }

        const headers = ["Employee", "Date", "Status"];
        const rows = filtered.map((r) => [
            r.fullname,
            new Date(r.attendance_date).toLocaleDateString(),
            r.status
        ]);

        const csv = [headers, ...rows]
            .map((row) => row.join(","))
            .join("\n");

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="attendance-report-${Date.now()}.csv"`
        );
        res.send(csv);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to export attendance report" });
    }
};

const exportLeaveReport = async (req, res) => {
    try {
        const managerId = req.user.id;

        const db = require("../config/db");

        const sql = `
            SELECT
                users.fullname AS employee,
                leave_requests.leave_type,
                leave_requests.start_date,
                leave_requests.end_date,
                leave_requests.reason,
                leave_requests.status,
                leave_requests.manager_note,
                leave_requests.created_at
            FROM leave_requests
            INNER JOIN users ON leave_requests.employee_id = users.id
            WHERE leave_requests.manager_id = ?
            ORDER BY leave_requests.created_at DESC
        `;

        db.query(sql, [managerId], (err, results) => {
            if (err) {
                return res.status(500).json({ message: "Failed to export leave report" });
            }

            const headers = [
                "Employee", "Leave Type", "Start Date",
                "End Date", "Reason", "Status", "Manager Note", "Filed Date"
            ];

            const rows = results.map((r) => [
                r.employee,
                r.leave_type,
                new Date(r.start_date).toLocaleDateString(),
                new Date(r.end_date).toLocaleDateString(),
                `"${r.reason}"`,
                r.status,
                r.manager_note ? `"${r.manager_note}"` : "",
                new Date(r.created_at).toLocaleDateString()
            ]);

            const csv = [headers, ...rows]
                .map((row) => row.join(","))
                .join("\n");

            res.setHeader("Content-Type", "text/csv");
            res.setHeader(
                "Content-Disposition",
                `attachment; filename="leave-report-${Date.now()}.csv"`
            );
            res.send(csv);
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to export leave report" });
    }
};

const exportPerformanceReport = async (req, res) => {
    try {
        const managerId = req.user.id;

        const analytics = await managerService.getAttendanceAnalytics(managerId);

        const headers = [
            "Employee", "Present", "Late", "Absent", "Leave", "Total Records", "Attendance Rate %"
        ];

        const rows = analytics.map((e) => {
            const total =
                Number(e.presentCount) +
                Number(e.lateCount) +
                Number(e.absentCount) +
                Number(e.leaveCount);
            const rate = total === 0 ? 0 : Math.round((Number(e.presentCount) / total) * 100);
            return [
                e.fullname,
                e.presentCount,
                e.lateCount,
                e.absentCount,
                e.leaveCount,
                total,
                `${rate}%`
            ];
        });

        const csv = [headers, ...rows]
            .map((row) => row.join(","))
            .join("\n");

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="performance-report-${Date.now()}.csv"`
        );
        res.send(csv);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to export performance report" });
    }
};
const getShiftSchedules = async (req, res) => {
    try {
        const schedules = await managerService.getShiftSchedules();
        res.json(schedules);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to load shift schedules" });
    }
};

const updateShiftSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const { startTime, endTime, gracePeriod } = req.body;
        await managerService.updateShiftSchedule(id, startTime, endTime, gracePeriod);
        res.json({ message: "Shift schedule updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update shift schedule" });
    }
};

const getManagerTickets = async (req, res) => {
    try {
        const managerId = req.user.id;
        const tickets = await managerService.getManagerTickets(managerId);

        const summary = {
            open: tickets.filter((t) => t.status === "open").length,
            pending: tickets.filter((t) => t.status === "pending").length,
            escalated: tickets.filter((t) => t.status === "escalated").length,
            resolved: tickets.filter((t) => t.status === "resolved").length,
            closed: tickets.filter((t) => t.status === "closed").length,
        };

        res.json({ summary, tickets });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to load tickets" });
    }
};

const createManagerTicket = async (req, res) => {
    try {
        const managerId = req.user.id;
        const { title, description, priority, agentId, departmentId, customerName, referenceNumber } = req.body;

        if (!title || !agentId) {
            return res.status(400).json({ message: "Title and agent are required" });
        }

        await managerService.createManagerTicket(
            managerId,
            title,
            description,
            priority || "medium",
            agentId,
            departmentId || null,
            customerName || null,
            referenceNumber || null
        );

        res.status(201).json({ message: "Ticket created successfully" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

const updateManagerTicketStatus = async (req, res) => {
    try {
        const managerId = req.user.id;
        const { id } = req.params;
        const { status } = req.body;

        await managerService.updateManagerTicketStatus(managerId, id, status);
        res.json({ message: "Ticket status updated" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

const getTicketComments = async (req, res) => {
    try {
        const { id } = req.params;
        const comments = await managerService.getTicketComments(id);
        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to load comments" });
    }
};

const addTicketComment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { comment } = req.body;
        if (!comment?.trim()) {
            return res.status(400).json({ message: "Comment is required" });
        }
        await managerService.addTicketComment(id, userId, comment);
        res.status(201).json({ message: "Comment added" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add comment" });
    }
};

module.exports = {
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
    getManagerTickets,
    createManagerTicket,
    updateManagerTicketStatus,
    getTicketComments,
    addTicketComment,
};
