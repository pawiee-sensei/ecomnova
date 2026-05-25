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
            users.id,
            users.employee_id,
            users.fullname,
            users.email,
            users.role,
            users.status,
            users.created_at,
            departments.name AS department_name,
            teams.name AS team_name,
            manager.fullname AS manager_name,
            leader.fullname AS leader_name
        FROM users
        LEFT JOIN departments
            ON users.department_id = departments.id
        LEFT JOIN teams
            ON users.team_id = teams.id
        LEFT JOIN users AS manager
            ON users.manager_id = manager.id
        LEFT JOIN users AS leader
            ON teams.leader_id = leader.id
        WHERE 1=1
    `;

    const values = [];

    /*
      Search filter
    */
    if (search) {
        sql += `
            AND (
                users.employee_id LIKE ?
                OR users.fullname LIKE ?
                OR users.email LIKE ?
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
            AND users.role = ?
        `;

        values.push(role);
    }

    /*
      Status filter
    */
    if (status) {
        sql += `
            AND users.status = ?
        `;

        values.push(status);
    }

    sql += `
        ORDER BY users.created_at DESC
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
            department_id,
            team_id,
            manager_id,
            status,
            job_title,
            employment_type,
            hire_date,
            work_location,
            shift
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            employeeData.employee_id,
            employeeData.fullname,
            employeeData.email,
            employeeData.password,
            employeeData.role,
            employeeData.department_id || null,
            employeeData.team_id || null,
            employeeData.manager_id || null,
            employeeData.status || "active",
            employeeData.job_title || null,
            employeeData.employment_type || null,
            employeeData.hire_date || null,
            employeeData.work_location || null,
            employeeData.shift || null
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
            users.id,
            users.employee_id,
            users.fullname,
            users.email,
            users.role,
            users.status,
            users.department_id,
            users.team_id,
            users.manager_id,
            users.created_at,
            users.job_title,
            users.employment_type,
            users.hire_date,
            users.work_location,
            users.shift,

            departments.name AS department_name,
            teams.name AS team_name,
            manager.fullname AS manager_name

        FROM users

        LEFT JOIN departments
            ON users.department_id = departments.id

        LEFT JOIN teams
            ON users.team_id = teams.id

        LEFT JOIN users AS manager
            ON users.manager_id = manager.id

        WHERE users.id = ?
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
            manager_id = ?,
            status = ?,
            job_title = ?,
            employment_type = ?,
            hire_date = ?,
            work_location = ?,
            shift = ?
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
            employeeData.status,
            employeeData.job_title || null,
            employeeData.employment_type || null,
            employeeData.hire_date || null,
            employeeData.work_location || null,
            employeeData.shift || null,
            id
        ],
        callback
    );
};

const getTeamById = (
    id,
    callback
) => {
    const sql = `
        SELECT
            id,
            name,
            department_id
        FROM teams
        WHERE id = ?
    `;

    db.query(sql, [id], callback);
};

const getManagerById = (
    id,
    callback
) => {
    const sql = `
        SELECT
            id,
            fullname,
            role,
            department_id
        FROM users
        WHERE id = ?
            AND role = 'manager'
    `;

    db.query(sql, [id], callback);
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

/*
  Fetch departments
*/

const getDepartments = (callback) => {
    const sql = `
        SELECT id, name
        FROM departments
        ORDER BY name ASC
    `;

    db.query(sql, callback);
};

/*
  Fetch teams
*/

const getTeams = (callback) => {
    const sql = `
        SELECT
            teams.id,
            teams.name,
            teams.department_id,
            departments.name AS department_name
        FROM teams
        LEFT JOIN departments
            ON teams.department_id = departments.id
        ORDER BY departments.name ASC, teams.name ASC
    `;

    db.query(sql, callback);
};

/*
  Fetch managers
*/

const getManagers = (callback) => {
    const sql = `
        SELECT
            users.id,
            users.fullname,
            users.department_id,
            departments.name AS department_name
        FROM users
        LEFT JOIN departments
            ON users.department_id = departments.id
        WHERE users.role = 'manager'
        ORDER BY users.fullname ASC
    `;

    db.query(sql, callback);
};

module.exports = {
    getAllEmployees,
    createEmployee,
    getEmployeeById,
    updateEmployee,
    getTeamById,
    getManagerById,
    updateEmployeeStatus,
    resetEmployeePassword,
    createAuditLog,
    getAuditLogs,
    getEmployeeAuditLogs,
    getDepartments,
    getTeams,
    getManagers
};
