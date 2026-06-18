const db = require("../config/db");

const getDepartmentPerformance = (
    callback
) => {

    const sql = `
SELECT

    d.id,
    d.name AS department_name,

    kpi.target_value,
    kpi.actual_value,

    evaluation.rating,
    evaluation.comments,

    ROUND(
        AVG(
            CASE

                WHEN attendance_records.status = 'present'
                THEN 100

                WHEN attendance_records.status = 'late'
                THEN 50

                ELSE 0

            END
        )
    ) AS attendance_score

FROM departments d

LEFT JOIN department_kpis kpi
    ON d.id = kpi.department_id

LEFT JOIN department_evaluations evaluation
    ON d.id = evaluation.department_id

LEFT JOIN users
    ON users.department_id = d.id

LEFT JOIN attendance_records
    ON attendance_records.employee_id = users.id

WHERE
    kpi.month = MONTH(CURRENT_DATE())
AND
    kpi.year = YEAR(CURRENT_DATE())

GROUP BY
    d.id

ORDER BY
    d.name
    `;

    db.query(
        sql,
        callback
    );
};

const getDepartmentPerformanceHistory = (
    departmentId,
    callback
) => {

    const sql = `
        SELECT

            month,
            year,

            attendance_score,
            kpi_achievement,
            manager_rating,
            performance_score

        FROM department_performance_history

        WHERE department_id = ?

        ORDER BY year, month
    `;

    db.query(
        sql,
        [departmentId],
        callback
    );
};

const getManagerDepartmentId = (managerId, callback) => {
    const sql = `
        SELECT DISTINCT department_id
        FROM users
        WHERE manager_id = ?
        AND department_id IS NOT NULL
        LIMIT 1
    `;
    db.query(sql, [managerId], callback);
};

const getKPIByDepartment = (departmentId, callback) => {
    const sql = `
        SELECT
            department_kpis.id,
            department_kpis.month,
            department_kpis.year,
            department_kpis.target_value,
            department_kpis.actual_value,
            department_kpis.created_at,
            departments.name AS department_name
        FROM department_kpis
        INNER JOIN departments
            ON department_kpis.department_id = departments.id
        WHERE department_kpis.department_id = ?
        ORDER BY department_kpis.year DESC, department_kpis.month DESC
    `;
    db.query(sql, [departmentId], callback);
};

const setKPI = (departmentId, month, year, targetValue, callback) => {
    const sql = `
        INSERT INTO department_kpis (
            department_id,
            month,
            year,
            target_value,
            actual_value
        )
        VALUES (?, ?, ?, ?, 0)
        ON DUPLICATE KEY UPDATE
            target_value = VALUES(target_value)
    `;
    db.query(sql, [departmentId, month, year, targetValue], callback);
};

const updateActualValue = (id, departmentId, actualValue, callback) => {
    const sql = `
        UPDATE department_kpis
        SET actual_value = ?
        WHERE id = ?
        AND department_id = ?
    `;
    db.query(sql, [actualValue, id, departmentId], callback);
};

module.exports = {
    getDepartmentPerformance,
    getDepartmentPerformanceHistory,
    getManagerDepartmentId,
    getKPIByDepartment,
    setKPI,
    updateActualValue
};