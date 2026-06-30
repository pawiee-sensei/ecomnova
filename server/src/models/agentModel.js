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
            users.department_id,
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
            tickets.ticket_number,
            tickets.title,
            tickets.description,
            tickets.status,
            tickets.priority,
            tickets.customer_name,
            tickets.reference_number,
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

const getAgentPerformance = (agentId, callback) => {
    const sql = `
        SELECT
            employee_performance.id,
            employee_performance.metric_value,
            employee_performance.month,
            employee_performance.year,
            employee_performance.created_at,
            performance_metrics.metric_name,
            performance_metrics.metric_unit
        FROM employee_performance
        INNER JOIN performance_metrics
            ON employee_performance.metric_id = performance_metrics.id
        WHERE employee_performance.employee_id = ?
        ORDER BY employee_performance.year DESC,
                 employee_performance.month DESC,
                 performance_metrics.metric_name ASC
    `;
    db.query(sql, [agentId], callback);
};

const getTodayAttendance = (agentId, today, callback) => {
    const sql = `
        SELECT id, status, time_in, time_out
        FROM attendance_records
        WHERE employee_id = ?
        AND attendance_date = ?
    `;
    db.query(sql, [agentId, today], callback);
};

const clockIn = (agentId, today, status, timeIn, callback) => {
    const sql = `
        INSERT INTO attendance_records (
            employee_id,
            attendance_date,
            status,
            time_in
        )
        VALUES (?, ?, ?, ?)
    `;
    db.query(sql, [agentId, today, status, timeIn], callback);
};

const clockOut = (agentId, today, timeOut, callback) => {
    const sql = `
        UPDATE attendance_records
        SET time_out = ?
        WHERE employee_id = ?
        AND attendance_date = ?
        AND time_out IS NULL
    `;
    db.query(sql, [timeOut, agentId, today], callback);
};

const getShiftSchedule = (shiftName, callback) => {
    const sql = `
        SELECT
            id,
            shift_name,
            start_time,
            end_time,
            grace_period_minutes
        FROM shift_schedules
        WHERE shift_name = ?
        LIMIT 1
    `;
    db.query(sql, [shiftName], callback);
};

const getTicketComments = (ticketId, agentId, callback) => {
    const sql = `
        SELECT
            ticket_comments.id,
            ticket_comments.comment,
            ticket_comments.created_at,
            users.fullname AS author_name,
            users.role AS author_role
        FROM ticket_comments
        INNER JOIN users ON ticket_comments.user_id = users.id
        WHERE ticket_comments.ticket_id = ?
        AND tickets.agent_id = ?
        ORDER BY ticket_comments.created_at ASC
    `;
    const safeSql = `
        SELECT
            tc.id,
            tc.comment,
            tc.created_at,
            u.fullname AS author_name,
            u.role AS author_role
        FROM ticket_comments tc
        INNER JOIN users u ON tc.user_id = u.id
        INNER JOIN tickets t ON tc.ticket_id = t.id
        WHERE tc.ticket_id = ?
        AND t.agent_id = ?
        ORDER BY tc.created_at ASC
    `;
    db.query(safeSql, [ticketId, agentId], callback);
};

const addTicketComment = (ticketId, agentId, userId, comment, callback) => {
    const checkSql = `SELECT id FROM tickets WHERE id = ? AND agent_id = ?`;
    db.query(checkSql, [ticketId, agentId], (err, results) => {
        if (err) return callback(err);
        if (results.length === 0) return callback(new Error("Unauthorized"));
        const sql = `INSERT INTO ticket_comments (ticket_id, user_id, comment) VALUES (?, ?, ?)`;
        db.query(sql, [ticketId, userId, comment], callback);
    });
};

const createAgentTicket = (
    title,
    description,
    priority,
    agentId,
    departmentId,
    customerName,
    referenceNumber,
    callback
) => {
    const sql = `
        INSERT INTO tickets (
            title,
            description,
            priority,
            agent_id,
            department_id,
            customer_name,
            reference_number,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, 'open')
    `;
    db.query(sql, [title, description, priority, agentId, departmentId, customerName, referenceNumber], (err, result) => {
        if (err) return callback(err);

        const ticketNumber = `TKT-${String(result.insertId).padStart(5, "0")}`;
        const updateSql = `UPDATE tickets SET ticket_number = ? WHERE id = ?`;
        db.query(updateSql, [ticketNumber, result.insertId], (err2) => {
            if (err2) return callback(err2);
            callback(null, { ...result, ticketNumber });
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
    getAgentManagerId,
    getAgentTickets,
    updateAgentTicketStatus,
    getAgentPerformance,
    getTodayAttendance,
    clockIn,
    clockOut,
    getShiftSchedule,
    getTicketComments,
    addTicketComment,
    createAgentTicket,
};