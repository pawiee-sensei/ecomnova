const leaveService = require("../services/leaveService");

const getLeaveRequests = async (req, res) => {
    try {
        const managerId = req.user.id;
        const requests = await leaveService.getLeaveRequests(managerId);
        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to load leave requests" });
    }
};

const approveLeaveRequest = async (req, res) => {
    try {
        const managerId = req.user.id;
        const { id } = req.params;
        const { managerNote } = req.body;
        await leaveService.approveLeaveRequest(id, managerId, managerNote);
        res.json({ message: "Leave request approved" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

const rejectLeaveRequest = async (req, res) => {
    try {
        const managerId = req.user.id;
        const { id } = req.params;
        const { managerNote } = req.body;
        await leaveService.rejectLeaveRequest(id, managerId, managerNote);
        res.json({ message: "Leave request rejected" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

const createLeaveRequest = async (req, res) => {
    try {
        const managerId = req.user.id;
        const {
            employeeId,
            leaveType,
            startDate,
            endDate,
            reason
        } = req.body;
        await leaveService.createLeaveRequest(
            employeeId,
            managerId,
            leaveType,
            startDate,
            endDate,
            reason
        );
        res.status(201).json({ message: "Leave request created" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create leave request" });
    }
};

module.exports = {
    getLeaveRequests,
    approveLeaveRequest,
    rejectLeaveRequest,
    createLeaveRequest,
};