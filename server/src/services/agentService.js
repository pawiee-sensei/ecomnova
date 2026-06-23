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
    updateAgentTicketStatus
};