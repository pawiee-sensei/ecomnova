const db = require("../config/db");

const getLeaveRequests = (managerId, callback) => {
    const sql = `
        SELECT
            leave_requests.id,
            leave_requests.leave_type,
            leave_requests.start_date,
            leave_requests.end_date,
            leave_requests.reason,
            leave_requests.status,
            leave_requests.manager_note,
            leave_requests.created_at,
            users.fullname AS employee_name,
            users.job_title,
            users.employee_id AS employee_code
        FROM leave_requests
        INNER JOIN users
            ON leave_requests.employee_id = users.id
        WHERE leave_requests.manager_id = ?
        ORDER BY leave_requests.created_at DESC
    `;
    db.query(sql, [managerId], callback);
};

const getLeaveRequestById = (id, managerId, callback) => {
    const sql = `
        SELECT
            leave_requests.*,
            users.fullname AS employee_name,
            users.job_title,
            users.employee_id AS employee_code
        FROM leave_requests
        INNER JOIN users
            ON leave_requests.employee_id = users.id
        WHERE leave_requests.id = ?
        AND leave_requests.manager_id = ?
    `;
    db.query(sql, [id, managerId], callback);
};

const approveLeaveRequest = (id, managerId, managerNote, callback) => {
    const sql = `
        UPDATE leave_requests
        SET status = 'approved', manager_note = ?
        WHERE id = ?
        AND manager_id = ?
        AND status = 'pending'
    `;
    db.query(sql, [managerNote, id, managerId], callback);
};

const rejectLeaveRequest = (id, managerId, managerNote, callback) => {
    const sql = `
        UPDATE leave_requests
        SET status = 'rejected', manager_note = ?
        WHERE id = ?
        AND manager_id = ?
        AND status = 'pending'
    `;
    db.query(sql, [managerNote, id, managerId], callback);
};

const createLeaveRequest = (
    employeeId,
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
    db.query(
        sql,
        [employeeId, managerId, leaveType, startDate, endDate, reason],
        callback
    );
};

module.exports = {
    getLeaveRequests,
    getLeaveRequestById,
    approveLeaveRequest,
    rejectLeaveRequest,
    createLeaveRequest,
};