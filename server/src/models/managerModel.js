const db = require("../config/db");

/*
  Get employees assigned to manager
*/

const getManagerTeam = (
    managerId,
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
            job_title,
            work_location
        FROM users
        WHERE manager_id = ?
        ORDER BY fullname ASC
    `;

    db.query(
        sql,
        [managerId],
        callback
    );
};

module.exports = {
    getManagerTeam
};