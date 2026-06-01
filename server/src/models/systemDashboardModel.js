const db = require("../config/db");

const getDashboardMetrics = (
    callback
) => {
    const sql = `
        SELECT
            (SELECT COUNT(*)
             FROM users)
             AS totalUsers,

            (SELECT COUNT(*)
             FROM users
             WHERE security_status = 'locked')
             AS lockedAccounts,

            (SELECT COUNT(*)
             FROM login_attempts
             WHERE status = 'FAILED'
             AND DATE(created_at) = CURDATE())
             AS failedLoginsToday,

            (SELECT COUNT(*)
             FROM login_attempts
             WHERE status = 'BLOCKED'
             AND DATE(created_at) = CURDATE())
             AS blockedLoginsToday,

            (SELECT COUNT(*)
             FROM audit_logs
             WHERE DATE(created_at) = CURDATE())
             AS auditEventsToday,

            (SELECT COUNT(*)
             FROM audit_logs
             WHERE action = 'FORCE_LOGOUT'
             AND DATE(created_at) = CURDATE())
             AS forceLogoutsToday
    `;

    db.query(sql, callback);
};

module.exports = {
    getDashboardMetrics
};