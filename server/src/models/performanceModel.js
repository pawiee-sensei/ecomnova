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

module.exports = {
    getDepartmentPerformance,
    getDepartmentPerformanceHistory
};