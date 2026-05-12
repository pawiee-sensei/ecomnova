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

module.exports = {
    getAllEmployees,
    createEmployee
};