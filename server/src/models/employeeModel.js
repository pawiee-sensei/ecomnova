const db = require("../config/db");

/*
  Fetch workforce directory
  Model = SQL only
*/

const getAllEmployees = (callback) => {
    const sql = `
        SELECT
            id,
            employee_id,
            fullname,
            email,
            role,
            status,
            created_at
        FROM users
        ORDER BY created_at DESC
    `;

    db.query(sql, callback);
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
  Fetch single employee
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
            status
        FROM users
        WHERE id = ?
    `;

    db.query(sql, [id], callback);
};

/*
  Update employee basic profile
*/

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
            role = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            employeeData.fullname,
            employeeData.email,
            employeeData.role,
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

module.exports = {
    getAllEmployees,
    createEmployee,
    getEmployeeById,
    updateEmployee,
    updateEmployeeStatus
};