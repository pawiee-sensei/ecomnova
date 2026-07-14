const db = require("../config/db");

/*
  Create login attempt
*/

const createLoginAttempt = (
    loginData,
    callback
) => {
    // If a user_id is provided ensure it exists, otherwise insert null
    const insert = (userIdValue) => {
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
                userIdValue,
                loginData.email,
                loginData.status,
                loginData.reason || null
            ],
            callback
        );
    };

    if (!loginData.user_id) {
        // no user id provided
        insert(null);
        return;
    }

    // verify user exists before inserting to avoid FK failures
    db.query(
        `SELECT id FROM users WHERE id = ? LIMIT 1`,
        [loginData.user_id],
        (err, results) => {
            if (err) return callback(err);

            if (!results || results.length === 0) {
                insert(null);
            } else {
                insert(loginData.user_id);
            }
        }
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