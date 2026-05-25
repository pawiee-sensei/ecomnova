const db = require("../config/db");

/*
  Fetch all system users
*/

const getSystemUsers = (
    callback
) => {
    const sql = `
        SELECT
            id,
            employee_id,
            fullname,
            email,
            role,
            status,
            security_status,
            created_at
        FROM users
        ORDER BY created_at DESC
    `;

    db.query(sql, callback);
};

/*
  Update user role
*/

const updateUserRole = (
    userId,
    role,
    callback
) => {
    const sql = `
        UPDATE users
        SET role = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [role, userId],
        callback
    );
};

/*
  Update security status
*/

const updateSecurityStatus = (
    userId,
    securityStatus,
    callback
) => {
    const sql = `
        UPDATE users
        SET security_status = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [securityStatus, userId],
        callback
    );
};

module.exports = {
    getSystemUsers,
    updateUserRole,
    updateSecurityStatus
};