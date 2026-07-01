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

const getTickets = async (req, res) => {
    try {
        const agentId = req.user.id;
        const tickets = await agentService.getAgentTickets(agentId);

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

const updateTicketStatus = async (req, res) => {
    try {
        const agentId = req.user.id;
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ["open", "pending", "resolved", "closed"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        await agentService.updateAgentTicketStatus(id, agentId, status);
        res.json({ message: "Ticket status updated" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

const getPerformance = async (req, res) => {
    try {
        const agentId = req.user.id;
        const records = await agentService.getAgentPerformance(agentId);
        res.json(records);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to load performance" });
    }
};
const getTodayAttendance = async (req, res) => {
    try {
        const agentId = req.user.id;
        const record = await agentService.getTodayAttendance(agentId);
        res.json(record);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to load today's attendance" });
    }
};

const clockIn = async (req, res) => {
    try {
        const agentId = req.user.id;
        const result = await agentService.clockIn(agentId);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

const clockOut = async (req, res) => {
    try {
        const agentId = req.user.id;
        const result = await agentService.clockOut(agentId);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

const getTicketComments = async (req, res) => {
    try {
        const agentId = req.user.id;
        const { id } = req.params;
        const comments = await agentService.getTicketComments(id, agentId);
        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to load comments" });
    }
};

const addTicketComment = async (req, res) => {
    try {
        const agentId = req.user.id;
        const { id } = req.params;
        const { comment } = req.body;
        if (!comment?.trim()) {
            return res.status(400).json({ message: "Comment is required" });
        }
        await agentService.addTicketComment(id, agentId, agentId, comment);
        res.status(201).json({ message: "Comment added" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add comment" });
    }
};

const createTicket = async (req, res) => {
    try {
        const agentId = req.user.id;
        const { title, description, priority, customerName, referenceNumber } = req.body;

        if (!title?.trim()) {
            return res.status(400).json({ message: "Title is required" });
        }

        const result = await agentService.createAgentTicket(
            agentId,
            title,
            description,
            priority || "medium",
            customerName || null,
            referenceNumber || null
        );

        res.status(201).json({ message: "Ticket created successfully", ticketNumber: result.ticketNumber });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create ticket" });
    }
};

const getAnnouncements = async (req, res) => {
    try {
        const agentId = req.user.id;
        const announcements = await agentService.getAgentAnnouncements(agentId);
        res.json(announcements);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to load announcements" });
    }
};

module.exports = {
    getDashboard,
    getAttendance,
    getLeave,
    createLeave,
    getTickets,
    updateTicketStatus,
    getPerformance,
    getTodayAttendance,
    clockIn,
    clockOut,
    getTicketComments,
    addTicketComment,
    createTicket,
    getAnnouncements,
};