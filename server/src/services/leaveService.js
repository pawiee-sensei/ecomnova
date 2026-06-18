const leaveModel = require("../models/leaveModel");

const getLeaveRequests = async (managerId) => {
    return new Promise((resolve, reject) => {
        leaveModel.getLeaveRequests(managerId, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

const approveLeaveRequest = async (id, managerId, managerNote) => {
    return new Promise((resolve, reject) => {
        leaveModel.getLeaveRequestById(id, managerId, (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return reject(new Error("Leave request not found"));
            if (results[0].status !== "pending") return reject(new Error("Only pending requests can be approved"));

            leaveModel.approveLeaveRequest(id, managerId, managerNote || null, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    });
};

const rejectLeaveRequest = async (id, managerId, managerNote) => {
    return new Promise((resolve, reject) => {
        leaveModel.getLeaveRequestById(id, managerId, (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return reject(new Error("Leave request not found"));
            if (results[0].status !== "pending") return reject(new Error("Only pending requests can be rejected"));

            leaveModel.rejectLeaveRequest(id, managerId, managerNote || null, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    });
};

const createLeaveRequest = async (
    employeeId,
    managerId,
    leaveType,
    startDate,
    endDate,
    reason
) => {
    return new Promise((resolve, reject) => {
        leaveModel.createLeaveRequest(
            employeeId,
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
};

module.exports = {
    getLeaveRequests,
    approveLeaveRequest,
    rejectLeaveRequest,
    createLeaveRequest,
};