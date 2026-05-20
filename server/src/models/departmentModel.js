const db = require("../config/db");

/*
  Fetch departments
*/

const getDepartments = (callback) => {
    const sql = `
        SELECT
            departments.id,
            departments.name,
            departments.code,
            departments.description,
            departments.status,
            departments.created_at,
            users.fullname AS head_name

        FROM departments

        LEFT JOIN users
            ON departments.head_id = users.id

        ORDER BY departments.created_at DESC
    `;

    db.query(sql, callback);
};

/*
  Create department
*/

const createDepartment = (
    departmentData,
    callback
) => {
    const sql = `
        INSERT INTO departments (
            name,
            code,
            description,
            head_id,
            status
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            departmentData.name,
            departmentData.code,
            departmentData.description || null,
            departmentData.head_id || null,
            departmentData.status || "active"
        ],
        callback
    );
};

module.exports = {
    getDepartments,
    createDepartment
};