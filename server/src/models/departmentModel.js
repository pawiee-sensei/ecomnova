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
            users.fullname AS head_name,
            COUNT(members.id) AS member_count

        FROM departments

        LEFT JOIN users
            ON departments.head_id = users.id

        LEFT JOIN users AS members
            ON members.department_id = departments.id

        GROUP BY
            departments.id,
            departments.name,
            departments.code,
            departments.description,
            departments.status,
            departments.created_at,
            users.fullname

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
    db.beginTransaction((transactionError) => {
        if (transactionError) {
            return callback(transactionError);
        }

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
            (err, result) => {
                if (err) {
                    return db.rollback(() =>
                        callback(err)
                    );
                }

                syncDepartmentHead(
                    result.insertId,
                    departmentData.head_id,
                    (syncError) => {
                        if (syncError) {
                            return db.rollback(() =>
                                callback(syncError)
                            );
                        }

                        db.commit((commitError) => {
                            if (commitError) {
                                return db.rollback(() =>
                                    callback(commitError)
                                );
                            }

                            callback(null, result);
                        });
                    }
                );
            }
        );
    });
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

const getDepartmentHeadAssignment = (
    headId,
    excludedDepartmentId,
    callback
) => {
    let sql = `
        SELECT
            id,
            name
        FROM departments
        WHERE head_id = ?
    `;

    const values = [headId];

    if (excludedDepartmentId) {
        sql += `
            AND id <> ?
        `;

        values.push(excludedDepartmentId);
    }

    sql += `
        LIMIT 1
    `;

    db.query(sql, values, callback);
};

const getDepartmentHeadCandidate = (
    headId,
    callback
) => {
    const sql = `
        SELECT
            id,
            fullname,
            role
        FROM users
        WHERE id = ?
            AND role IN (
                'manager',
                'hr',
                'super_admin'
            )
    `;

    db.query(sql, [headId], callback);
};

/*
  Update department
*/

const updateDepartment = (
    id,
    departmentData,
    callback
) => {
    db.beginTransaction((transactionError) => {
        if (transactionError) {
            return callback(transactionError);
        }

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
            (err, result) => {
                if (err) {
                    return db.rollback(() =>
                        callback(err)
                    );
                }

                syncDepartmentHead(
                    id,
                    departmentData.head_id,
                    (syncError) => {
                        if (syncError) {
                            return db.rollback(() =>
                                callback(syncError)
                            );
                        }

                        db.commit((commitError) => {
                            if (commitError) {
                                return db.rollback(() =>
                                    callback(commitError)
                                );
                            }

                            callback(null, result);
                        });
                    }
                );
            }
        );
    });
};

const syncDepartmentHead = (
    departmentId,
    headId,
    callback
) => {
    if (!headId) {
        return callback(null);
    }

    const sql = `
        UPDATE users
        SET department_id = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [departmentId, headId],
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
            users.id,
            users.fullname,
            users.role,
            users.department_id,
            departments.name AS department_name,
            headed_department.id AS headed_department_id,
            headed_department.name AS headed_department_name
        FROM users
        LEFT JOIN departments
            ON users.department_id = departments.id
        LEFT JOIN departments AS headed_department
            ON headed_department.head_id = users.id
        WHERE users.role IN (
            'manager',
            'hr',
            'super_admin'
        )
        ORDER BY users.fullname ASC
    `;

    db.query(sql, callback);
};

/*
  Fetch department members
*/

const getDepartmentMembers = (
    departmentId,
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
            CASE
                WHEN departments.head_id = users.id THEN 'Department Head'
                ELSE 'Department Member'
            END AS assignment_label
        FROM users
        LEFT JOIN departments
            ON departments.id = users.department_id
        WHERE users.department_id = ?
        ORDER BY users.fullname ASC
    `;

    db.query(
        sql,
        [departmentId],
        callback
    );
};


module.exports = {
    getDepartments,
    createDepartment,
    getDepartmentById,
    getDepartmentHeadAssignment,
    getDepartmentHeadCandidate,
    updateDepartment,
    getDepartmentHeads,
    getDepartmentMembers
};
