const db = require("../config/db");

/*
  Fetch teams
*/

const getTeams = (callback) => {
    const sql = `
        SELECT
            teams.id,
            teams.name,
            teams.code,
            teams.description,
            teams.status,
            teams.created_at,

            departments.name AS department_name,
            users.fullname AS leader_name,

            (
                SELECT COUNT(*)
                FROM users
                WHERE users.team_id = teams.id
            ) AS member_count

        FROM teams

        LEFT JOIN departments
            ON teams.department_id = departments.id

        LEFT JOIN users
            ON teams.leader_id = users.id

        ORDER BY teams.created_at DESC
    `;

    db.query(sql, callback);
};

/*
  Create team
*/

const createTeam = (
    teamData,
    callback
) => {
    const sql = `
        INSERT INTO teams (
            name,
            code,
            department_id,
            description,
            leader_id,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            teamData.name,
            teamData.code,
            teamData.department_id || null,
            teamData.description || null,
            teamData.leader_id || null,
            teamData.status || "active"
        ],
        callback
    );
};

/*
  Fetch departments
*/

const getDepartments = (callback) => {
    const sql = `
        SELECT id, name
        FROM departments
        WHERE status = 'active'
        ORDER BY name ASC
    `;

    db.query(sql, callback);
};

/*
  Fetch eligible team leaders
*/

const getTeamLeaders = (callback) => {
    const sql = `
        SELECT
            id,
            fullname
        FROM users
        WHERE role = 'leader'
        AND status = 'active'
        ORDER BY fullname ASC
    `;

    db.query(sql, callback);
};

/*
  Fetch one team
*/

const getTeamById = (
    id,
    callback
) => {
    const sql = `
        SELECT
            id,
            name,
            code,
            department_id,
            description,
            leader_id,
            status
        FROM teams
        WHERE id = ?
    `;

    db.query(sql, [id], callback);
};

/*
  Update team
*/

const updateTeam = (
    id,
    teamData,
    callback
) => {
    const sql = `
        UPDATE teams
        SET
            name = ?,
            code = ?,
            department_id = ?,
            description = ?,
            leader_id = ?,
            status = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            teamData.name,
            teamData.code || null,
            teamData.department_id || null,
            teamData.description || null,
            teamData.leader_id || null,
            teamData.status,
            id
        ],
        callback
    );
};

/*
  Fetch team members
*/

const getTeamMembers = (
    teamId,
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
        WHERE team_id = ?
        ORDER BY fullname ASC
    `;

    db.query(
        sql,
        [teamId],
        callback
    );
};

/*
  Fetch available employees
  Employees not yet assigned to teams in the same department
*/

const getAvailableEmployees = (
    teamId,
    callback
) => {
    const sql = `
        SELECT
            users.id,
            users.employee_id,
            users.fullname,
            users.email,
            users.role,
            users.department_id
        FROM users
        INNER JOIN teams
            ON teams.id = ?
        WHERE users.team_id IS NULL
        AND users.department_id = teams.department_id
        AND users.role IN (
            'agent',
            'qa',
            'leader'
        )
        AND users.status = 'active'
        ORDER BY users.fullname ASC
    `;

    db.query(
        sql,
        [teamId],
        callback
    );
};

/*
  Count employees eligible for assignment to a team
*/

const countAssignableMembers = (
    teamId,
    employeeIds,
    callback
) => {
    const sql = `
        SELECT COUNT(*) AS eligible_count
        FROM users
        INNER JOIN teams
            ON teams.id = ?
        WHERE users.id IN (?)
        AND users.team_id IS NULL
        AND users.department_id = teams.department_id
        AND users.status = 'active'
        AND users.role IN (
            'agent',
            'qa',
            'leader'
        )
    `;

    db.query(
        sql,
        [teamId, employeeIds],
        callback
    );
};

/*
  Bulk assign employees to team
*/

const assignMembersToTeam = (
    teamId,
    employeeIds,
    callback
) => {
    const sql = `
        UPDATE users
        INNER JOIN teams
            ON teams.id = ?
        SET users.team_id = teams.id
        WHERE users.id IN (?)
        AND users.team_id IS NULL
        AND users.department_id = teams.department_id
        AND users.status = 'active'
        AND users.role IN (
            'agent',
            'qa',
            'leader'
        )
    `;

    db.query(
        sql,
        [teamId, employeeIds],
        callback
    );
};

/*
  Remove one employee from team
*/

const removeMemberFromTeam = (
    employeeId,
    callback
) => {
    const sql = `
        UPDATE users
        SET team_id = NULL
        WHERE id = ?
    `;

    db.query(
        sql,
        [employeeId],
        callback
    );
};

module.exports = {
    getTeams,
    createTeam,
    getDepartments,
    getTeamLeaders,
    getTeamById,
    updateTeam,
    getTeamMembers,
    getAvailableEmployees,
    countAssignableMembers,
    assignMembersToTeam,
    removeMemberFromTeam
};
