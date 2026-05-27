const db = require("../config/db");

/*
  Create audit log
*/

const createAuditLog = (
    auditData,
    callback
) => {
    const sql = `
        INSERT INTO audit_logs (
            actor_id,
            target_user_id,
            action,
            module,
            details
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            auditData.actor_id,
            auditData.target_user_id,
            auditData.action,
            auditData.module,
            auditData.details
        ],
        callback
    );
};

/*
  Fetch audit logs
*/

const getAuditLogs = (
    callback
) => {
    const sql = `
        SELECT
            audit_logs.id,
            audit_logs.action,
            audit_logs.module,
            audit_logs.details,
            audit_logs.created_at,

            actor.fullname AS actor_name,
            actor.email AS actor_email,

            target.fullname AS target_name,
            target.email AS target_email

        FROM audit_logs

        LEFT JOIN users actor
            ON audit_logs.actor_id = actor.id

        LEFT JOIN users target
            ON audit_logs.target_user_id = target.id

        ORDER BY audit_logs.created_at DESC
    `;

    db.query(sql, callback);
};

module.exports = {
    createAuditLog,
    getAuditLogs
};