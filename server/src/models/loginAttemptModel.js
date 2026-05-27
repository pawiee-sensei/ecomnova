const db = require("../config/db");

/*
  Create login attempt
*/

const createLoginAttempt = (
    loginData,
    callback
) => {
    const sql = `
        INSERT INTO login_attempts (
            user_id,
            email,
            status,
            reason
        )
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            loginData.user_id || null,
            loginData.email,
            loginData.status,
            loginData.reason || null
        ],
        callback
    );
};

/*
  Fetch login attempts
*/

const getLoginAttempts = (
    callback
) => {
    const sql = `
        SELECT
            login_attempts.*,
            users.fullname
        FROM login_attempts
        LEFT JOIN users
            ON login_attempts.user_id = users.id
        ORDER BY login_attempts.created_at DESC
    `;

    db.query(sql, callback);
};

module.exports = {
    createLoginAttempt,
    getLoginAttempts
};