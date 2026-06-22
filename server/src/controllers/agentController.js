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

module.exports = {
    getDashboard,
};