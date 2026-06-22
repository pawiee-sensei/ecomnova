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

module.exports = {
    getAgentProfile,
    getAgentAttendanceSummary,
    getAgentLeaveSummary,
    getAgentAnnouncements,
    getAgentRecentAttendance,
};