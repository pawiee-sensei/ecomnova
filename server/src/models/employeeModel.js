const db = require("../config/db");

/*
  Fetch workforce directory
  Model = SQL only
*/

/*
  Workforce directory with search support
*/

/*
  Workforce directory with search + filters
*/

const getAllEmployees = (
    search,
    role,
    status,
    callback
) => {
    let sql = `
        SELECT
            id,
            employee_id,
            fullname,
            email,
            role,
            status,
            created_at
        FROM users
        WHERE 1=1
    `;

    const values = [];

    /*
      Search filter
    */
    if (search) {
        sql += `
            AND (
                employee_id LIKE ?
                OR fullname LIKE ?
                OR email LIKE ?
            )
        `;

        const keyword = `%${search}%`;

        values.push(
            keyword,
            keyword,
            keyword
        );
    }

    /*
      Role filter
    */
    if (role) {
        sql += `
            AND role = ?
        `;

        values.push(role);
    }

    /*
      Status filter
    */
    if (status) {
        sql += `
            AND status = ?
        `;

        values.push(status);
    }

    sql += `
        ORDER BY created_at DESC
    `;

    db.query(sql, values, callback);
};
const createEmployee = (
    employeeData,
    callback
) => {
    const sql = `
        INSERT INTO users (
            employee_id,
            fullname,
            email,
            password,
            role,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            employeeData.employee_id,
            employeeData.fullname,
            employeeData.email,
            employeeData.password,
            employeeData.role,
            employeeData.status
        ],
        callback
    );
};

/*
  Fetch single employee profile
*/

const getEmployeeById = (
    id,
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
            department_id,
            team_id,
            manager_id,
            created_at
        FROM users
        WHERE id = ?
    `;

    db.query(sql, [id], callback);
};
/*
  Update employee profile + role
*/

const updateEmployee = (
    id,
    employeeData,
    callback
) => {
    const sql = `
        UPDATE users
        SET
            fullname = ?,
            email = ?,
            role = ?,
            department_id = ?,
            team_id = ?,
            manager_id = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            employeeData.fullname,
            employeeData.email,
            employeeData.role,
            employeeData.department_id || null,
            employeeData.team_id || null,
            employeeData.manager_id || null,
            id
        ],
        callback
    );
};

/*
  Update employee account status
*/

const updateEmployeeStatus = (
    id,
    status,
    callback
) => {
    const sql = `
        UPDATE users
        SET status = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [status, id],
        callback
    );
};

/*
  Reset employee password
*/

const resetEmployeePassword = (
    id,
    hashedPassword,
    callback
) => {
    const sql = `
        UPDATE users
        SET password = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [hashedPassword, id],
        callback
    );
};
/*
  Insert audit log record
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
            details
        )
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            auditData.actor_id,
            auditData.target_user_id,
            auditData.action,
            auditData.details
        ],
        callback
    );
};

/*
  Fetch audit logs
*/

const getAuditLogs = (callback) => {
    const sql = `
        SELECT
            audit_logs.id,
            audit_logs.action,
            audit_logs.details,
            audit_logs.created_at,

            actor.fullname AS actor_name,
            target.fullname AS target_name

        FROM audit_logs

        JOIN users AS actor
            ON audit_logs.actor_id = actor.id

        JOIN users AS target
            ON audit_logs.target_user_id = target.id

        ORDER BY audit_logs.created_at DESC
    `;

    db.query(sql, callback);
};

/*
  Fetch audit logs for one employee
*/

const getEmployeeAuditLogs = (
    employeeId,
    callback
) => {
    const sql = `
        SELECT
            audit_logs.id,
            audit_logs.action,
            audit_logs.details,
            audit_logs.created_at,

            actor.fullname AS actor_name

        FROM audit_logs

        JOIN users AS actor
            ON audit_logs.actor_id = actor.id

        WHERE audit_logs.target_user_id = ?

        ORDER BY audit_logs.created_at DESC
    `;

    db.query(sql, [employeeId], callback);
};

module.exports = {
    getAllEmployees,
    createEmployee,
    getEmployeeById,
    updateEmployee,
    updateEmployeeStatus,
    resetEmployeePassword,
    createAuditLog,
    getAuditLogs,
    getEmployeeAuditLogs
};