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
    updateEmployeeShift
};
