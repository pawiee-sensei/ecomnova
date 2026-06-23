const db = require("../config/db");

const getAgentProfile = (agentId, callback) => {
    const sql = `
        SELECT
            users.id,
            users.employee_id,
            users.fullname,
            users.email,
            users.role,
            users.status,
            users.job_title,
            users.employment_type,
            users.hire_date,
            users.work_location,
            users.shift,
            teams.name AS team_name,
            departments.name AS department_name
        FROM users
        LEFT JOIN teams ON users.team_id = teams.id
        LEFT JOIN departments ON users.department_id = departments.id
        WHERE users.id = ?
    `;
    db.query(sql, [agentId], callback);
};

const getAgentAttendanceSummary = (agentId, callback) => {
    const sql = `
        SELECT
            SUM(status = 'present') AS presentCount,
            SUM(status = 'late') AS lateCount,
            SUM(status = 'absent') AS absentCount,
            SUM(status = 'leave') AS leaveCount
        FROM attendance_records
        WHERE employee_id = ?
    `;
    db.query(sql, [agentId], callback);
};

const getAgentLeaveSummary = (agentId, callback) => {
    const sql = `
        SELECT
            SUM(status = 'pending') AS pendingCount,
            SUM(status = 'approved') AS approvedCount,
            SUM(status = 'rejected') AS rejectedCount
        FROM leave_requests
        WHERE employee_id = ?
    `;
    db.query(sql, [agentId], callback);
};

const getAgentAnnouncements = (agentId, callback) => {
    const sql = `
        SELECT
            announcements.id,
            announcements.title,
            announcements.content,
            announcements.status,
            announcements.effective_date,
            announcements.created_at
        FROM announcements
        INNER JOIN users ON announcements.manager_id = users.manager_id
        WHERE users.id = ?
        AND announcements.status != 'archived'
        ORDER BY announcements.created_at DESC
        LIMIT 5
    `;
    db.query(sql, [agentId], callback);
};

const getAgentRecentAttendance = (agentId, callback) => {
    const sql = `
        SELECT
            id,
            attendance_date,
            status
        FROM attendance_records
        WHERE employee_id = ?
        ORDER BY attendance_date DESC
        LIMIT 7
    `;
    db.query(sql, [agentId], callback);
};

const getAgentAttendanceRecords = (agentId, callback) => {
    const sql = `
        SELECT
            id,
            attendance_date,
            status
        FROM attendance_records
        WHERE employee_id = ?
        ORDER BY attendance_date DESC
    `;
    db.query(sql, [agentId], callback);
};

const getAgentLeaveRequests = (agentId, callback) => {
    const sql = `
        SELECT
            id,
            leave_type,
            start_date,
            end_date,
            reason,
            status,
            manager_note,
            created_at
        FROM leave_requests
        WHERE employee_id = ?
        ORDER BY created_at DESC
    `;
    db.query(sql, [agentId], callback);
};

const createAgentLeaveRequest = (
    agentId,
    managerId,
    leaveType,
    startDate,
    endDate,
    reason,
    callback
) => {
    const sql = `
        INSERT INTO leave_requests (
            employee_id,
            manager_id,
            leave_type,
            start_date,
            end_date,
            reason
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [agentId, managerId, leaveType, startDate, endDate, reason], callback);
};

const getAgentManagerId = (agentId, callback) => {
    const sql = `
        SELECT manager_id
        FROM users
        WHERE id = ?
    `;
    db.query(sql, [agentId], callback);
};

const getAgentTickets = (agentId, callback) => {
    const sql = `
        SELECT
            tickets.id,
            tickets.title,
            tickets.description,
            tickets.status,
            tickets.priority,
            tickets.created_at,
            tickets.updated_at,
            tickets.resolved_at,
            departments.name AS department_name
        FROM tickets
        LEFT JOIN departments
            ON tickets.department_id = departments.id
        WHERE tickets.agent_id = ?
        ORDER BY tickets.created_at DESC
    `;
    db.query(sql, [agentId], callback);
};

const updateAgentTicketStatus = (ticketId, agentId, status, callback) => {
    const resolvedAt = status === "resolved" ? new Date() : null;
    const sql = `
        UPDATE tickets
        SET
            status = ?,
            resolved_at = ?
        WHERE id = ?
        AND agent_id = ?
    `;
    db.query(sql, [status, resolvedAt, ticketId, agentId], callback);
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
    getAgentManagerId,
    getAgentTickets,
    updateAgentTicketStatus
};