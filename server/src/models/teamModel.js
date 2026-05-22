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

module.exports = {
    getTeams,
    createTeam
};