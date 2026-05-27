const db = require("../config/db");

/*
  Get security settings
*/

const getSecuritySettings = (
    callback
) => {
    const sql = `
        SELECT *
        FROM security_settings
        LIMIT 1
    `;

    db.query(sql, callback);
};

/*
  Update security settings
*/

const updateSecuritySettings = (
    settings,
    callback
) => {
    const sql = `
        UPDATE security_settings
        SET
            failed_attempt_threshold = ?,
            failed_attempt_window_minutes = ?,
            auto_lock_enabled = ?,
            jwt_expiration = ?,
            password_min_length = ?
        WHERE id = 1
    `;

    db.query(
        sql,
        [
            settings.failed_attempt_threshold,
            settings.failed_attempt_window_minutes,
            settings.auto_lock_enabled,
            settings.jwt_expiration,
            settings.password_min_length
        ],
        callback
    );
};

module.exports = {
    getSecuritySettings,
    updateSecuritySettings
};