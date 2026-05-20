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

/*
  Fetch one department
*/

const getDepartmentById = (
    id,
    callback
) => {
    const sql = `
        SELECT
            id,
            name,
            code,
            description,
            head_id,
            status
        FROM departments
        WHERE id = ?
    `;

    db.query(sql, [id], callback);
};

/*
  Update department
*/

const updateDepartment = (
    id,
    departmentData,
    callback
) => {
    const sql = `
        UPDATE departments
        SET
            name = ?,
            code = ?,
            description = ?,
            head_id = ?,
            status = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            departmentData.name,
            departmentData.code || null,
            departmentData.description || null,
            departmentData.head_id || null,
            departmentData.status,
            id
        ],
        callback
    );
};

/*
  Fetch eligible department heads
*/

const getDepartmentHeads = (
    callback
) => {
    const sql = `
        SELECT
            id,
            fullname,
            role
        FROM users
        WHERE role IN (
            'manager',
            'admin',
            'super_admin'
        )
        ORDER BY fullname ASC
    `;

    db.query(sql, callback);
};


module.exports = {
    getDepartments,
    createDepartment,
    getDepartmentById,
    updateDepartment,
    getDepartmentHeads
};