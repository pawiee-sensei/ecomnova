const agentModel = require("../models/agentModel");

const getAgentProfile = async (agentId) => {
    return new Promise((resolve, reject) => {
        agentModel.getAgentProfile(agentId, (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
        });
    });
};

const getAgentAttendanceSummary = async (agentId) => {
    return new Promise((resolve, reject) => {
        agentModel.getAgentAttendanceSummary(agentId, (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
        });
    });
};

const getAgentLeaveSummary = async (agentId) => {
    return new Promise((resolve, reject) => {
        agentModel.getAgentLeaveSummary(agentId, (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
        });
    });
};

const getAgentAnnouncements = async (agentId) => {
    return new Promise((resolve, reject) => {
        agentModel.getAgentAnnouncements(agentId, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

const getAgentRecentAttendance = async (agentId) => {
    return new Promise((resolve, reject) => {
        agentModel.getAgentRecentAttendance(agentId, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

const getAgentAttendanceRecords = async (agentId) => {
    return new Promise((resolve, reject) => {
        agentModel.getAgentAttendanceRecords(agentId, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

const getAgentLeaveRequests = async (agentId) => {
    return new Promise((resolve, reject) => {
        agentModel.getAgentLeaveRequests(agentId, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

const createAgentLeaveRequest = async (
    agentId,
    leaveType,
    startDate,
    endDate,
    reason
) => {
    return new Promise((resolve, reject) => {
        agentModel.getAgentManagerId(agentId, (err, results) => {
            if (err) return reject(err);
            const managerId = results[0]?.manager_id;
            if (!managerId) return reject(new Error("No manager assigned to this agent"));

            agentModel.createAgentLeaveRequest(
                agentId,
                managerId,
                leaveType,
                startDate,
                endDate,
                reason,
                (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                }
            );
        });
    });
};

const getAgentTickets = async (agentId) => {
    return new Promise((resolve, reject) => {
        agentModel.getAgentTickets(agentId, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

const updateAgentTicketStatus = async (ticketId, agentId, status) => {
    return new Promise((resolve, reject) => {
        agentModel.updateAgentTicketStatus(ticketId, agentId, status, (err, result) => {
            if (err) return reject(err);
            if (result.affectedRows === 0) return reject(new Error("Ticket not found or unauthorized"));
            resolve(result);
        });
    });
};

const getAgentPerformance = async (agentId) => {
    return new Promise((resolve, reject) => {
        agentModel.getAgentPerformance(agentId, (err, results) => {
            if (err) return reject(err);

            const grouped = {};
            results.forEach((row) => {
                const key = `${row.month}-${row.year}`;
                if (!grouped[key]) {
                    grouped[key] = {
                        month: row.month,
                        year: row.year,
                        metrics: [],
                    };
                }
                grouped[key].metrics.push({
                    id: row.id,
                    metric_name: row.metric_name,
                    metric_unit: row.metric_unit,
                    metric_value: Number(row.metric_value),
                });
            });

            const records = Object.values(grouped).sort((a, b) =>
                b.year !== a.year ? b.year - a.year : b.month - a.month
            );

            resolve(records);
        });
    });
};

const getTodayAttendance = async (agentId) => {
    const today = new Date().toISOString().split("T")[0];
    return new Promise((resolve, reject) => {
        agentModel.getTodayAttendance(agentId, today, (err, results) => {
            if (err) return reject(err);
            resolve(results[0] || null);
        });
    });
};

const clockIn = async (agentId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const today = new Date().toISOString().split("T")[0];

            // Check if already clocked in today
            const existing = await getTodayAttendance(agentId);
            if (existing) return reject(new Error("Already clocked in today"));

            // Get agent profile for shift
            const profile = await getAgentProfile(agentId);
            const shiftName = profile?.shift;

            if (!shiftName) return reject(new Error("No shift assigned"));

            // Get shift schedule
            agentModel.getShiftSchedule(shiftName, (err, schedules) => {
                if (err) return reject(err);

                const now = new Date();
                let status = "present";

                if (schedules.length > 0) {
                    const schedule = schedules[0];
                    const [hours, minutes] = schedule.start_time.split(":").map(Number);
                    const graceMinutes = schedule.grace_period_minutes || 15;

                    const shiftStart = new Date(now);
                    shiftStart.setHours(hours, minutes, 0, 0);

                    const graceEnd = new Date(shiftStart);
                    graceEnd.setMinutes(graceEnd.getMinutes() + graceMinutes);

                    if (now > graceEnd) {
                        status = "late";
                    }
                }

                agentModel.clockIn(agentId, today, status, now, (err, result) => {
                    if (err) return reject(err);
                    resolve({ status, time_in: now });
                });
            });
        } catch (error) {
            reject(error);
        }
    });
};

const clockOut = async (agentId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const today = new Date().toISOString().split("T")[0];

            const existing = await getTodayAttendance(agentId);
            if (!existing) return reject(new Error("You have not clocked in today"));
            if (existing.time_out) return reject(new Error("Already clocked out today"));

            const now = new Date();
            agentModel.clockOut(agentId, today, now, (err, result) => {
                if (err) return reject(err);
                resolve({ time_out: now });
            });
        } catch (error) {
            reject(error);
        }
    });
};

const getTicketComments = async (ticketId, agentId) => {
    return new Promise((resolve, reject) => {
        agentModel.getTicketComments(ticketId, agentId, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

const addTicketComment = async (ticketId, agentId, userId, comment) => {
    return new Promise((resolve, reject) => {
        agentModel.addTicketComment(ticketId, agentId, userId, comment, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

module.exports = {
    getAgentProfile,
    getAgentAttendanceSummary,
    getAgentLeaveSummary,
    getAgentAnnouncements,
    getAgentRecentAttendance,
    getAgentAttendanceRecords,
    getAgentLeaveRequests,
    createAgentLeaveRequest,
    getAgentTickets,
    updateAgentTicketStatus,
    getAgentPerformance,
    getTodayAttendance,
    clockIn,
    clockOut,
    getTicketComments,
    addTicketComment,
};