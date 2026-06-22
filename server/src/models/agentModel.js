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

module.exports = {
    getAgentProfile,
    getAgentAttendanceSummary,
    getAgentLeaveSummary,
    getAgentAnnouncements,
    getAgentRecentAttendance,
};