const agentService = require("../services/agentService");

const getDashboard = async (req, res) => {
    try {
        const agentId = req.user.id;

        const [profile, attendance, leave, announcements, recentAttendance] =
            await Promise.all([
                agentService.getAgentProfile(agentId),
                agentService.getAgentAttendanceSummary(agentId),
                agentService.getAgentLeaveSummary(agentId),
                agentService.getAgentAnnouncements(agentId),
                agentService.getAgentRecentAttendance(agentId),
            ]);

        res.json({
            profile,
            attendance,
            leave,
            announcements,
            recentAttendance,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to load dashboard" });
    }
};

const getAttendance = async (req, res) => {
    try {
        const agentId = req.user.id;
        const [summary, records] = await Promise.all([
            agentService.getAgentAttendanceSummary(agentId),
            agentService.getAgentAttendanceRecords(agentId),
        ]);
        res.json({ summary, records });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to load attendance" });
    }
};

const getLeave = async (req, res) => {
    try {
        const agentId = req.user.id;
        const [summary, requests] = await Promise.all([
            agentService.getAgentLeaveSummary(agentId),
            agentService.getAgentLeaveRequests(agentId),
        ]);
        res.json({ summary, requests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to load leave requests" });
    }
};

const createLeave = async (req, res) => {
    try {
        const agentId = req.user.id;
        const { leaveType, startDate, endDate, reason } = req.body;

        if (!leaveType || !startDate || !endDate || !reason) {
            return res.status(400).json({ message: "All fields are required" });
        }

        await agentService.createAgentLeaveRequest(
            agentId,
            leaveType,
            startDate,
            endDate,
            reason
        );

        res.status(201).json({ message: "Leave request submitted successfully" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getDashboard,
    getAttendance,
    getLeave,
    createLeave,
};