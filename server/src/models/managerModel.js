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

const getTeamMemberById = (
    employeeId,
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
            manager_id,
            job_title,
            employment_type,
            hire_date,
            work_location,
            shift
        FROM users
        WHERE id = ?
        AND manager_id = ?
    `;

    db.query(
        sql,
        [
            employeeId,
            managerId
        ],
        callback
    );
};

const getTeamOverview = (
    managerId,
    callback
) => {

    const sql = `
        SELECT
            t.id,
            t.name AS team_name,
            t.status,
            d.name AS department_name,
            leader.fullname AS leader_name,
            (
                SELECT COUNT(*)
                FROM users u
                WHERE u.team_id = t.id
            ) AS member_count
        FROM users manager

        INNER JOIN teams t
            ON manager.team_id = t.id

        LEFT JOIN departments d
            ON t.department_id = d.id

        LEFT JOIN users leader
            ON t.leader_id = leader.id

        WHERE manager.id = ?
    `;

    db.query(
        sql,
        [managerId],
        callback
    );
};

const getTeamActivity = (
    managerId,
    callback
) => {

    const sql = `
        SELECT
            audit_logs.id,
            audit_logs.action,
            audit_logs.module,
            audit_logs.details,
            audit_logs.created_at,

            actor.fullname AS actor_name,
            target.fullname AS target_name

        FROM audit_logs

        LEFT JOIN users actor
            ON audit_logs.actor_id = actor.id

        LEFT JOIN users target
            ON audit_logs.target_user_id = target.id

        WHERE target.manager_id = ?

        ORDER BY audit_logs.created_at DESC

        LIMIT 10
    `;

    db.query(
        sql,
        [managerId],
        callback
    );
};

const createCoachingNote = (
    employeeId,
    managerId,
    note,
    callback
) => {

    const sql = `
        INSERT INTO coaching_notes (
            employee_id,
            manager_id,
            note
        )
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [
            employeeId,
            managerId,
            note
        ],
        callback
    );
};

const getCoachingNotes = (
    employeeId,
    callback
) => {

    const sql = `
        SELECT
            coaching_notes.id,
            coaching_notes.note,
            coaching_notes.created_at,

            users.fullname AS manager_name

        FROM coaching_notes

        INNER JOIN users
            ON coaching_notes.manager_id = users.id

        WHERE coaching_notes.employee_id = ?

        ORDER BY coaching_notes.created_at DESC
    `;

    db.query(
        sql,
        [employeeId],
        callback
    );
};

const validateManagedEmployee = (
    employeeId,
    managerId,
    callback
) => {

    const sql = `
        SELECT id
        FROM users
        WHERE id = ?
        AND manager_id = ?
    `;

    db.query(
        sql,
        [
            employeeId,
            managerId
        ],
        callback
    );
};

const createAnnouncement = (
    title,
    content,
    status,
    effectiveDate,
    managerId,
    callback
) => {

    const sql = `
        INSERT INTO announcements (
            title,
            content,
            status,
            effective_date,
            manager_id
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            title,
            content,
            status,
            effectiveDate,
            managerId
        ],
        callback
    );
};

const getAnnouncements = (
    managerId,
    callback
) => {

    const sql = `
        SELECT
            id,
            title,
            content,
            status,
            effective_date,
            created_at
        FROM announcements
        WHERE manager_id = ?
        ORDER BY effective_date DESC
    `;

    db.query(
        sql,
        [managerId],
        callback
    );
};

const archiveAnnouncement = (
    announcementId,
    managerId,
    callback
) => {

    const sql = `
        UPDATE announcements
        SET status = 'archived'
        WHERE id = ?
        AND manager_id = ?
    `;

    db.query(
        sql,
        [
            announcementId,
            managerId
        ],
        callback
    );
};

const updateAnnouncement = (
    announcementId,
    managerId,
    title,
    content,
    status,
    effectiveDate,
    callback
) => {

    const sql = `
        UPDATE announcements
        SET
            title = ?,
            content = ?,
            status = ?,
            effective_date = ?
        WHERE id = ?
        AND manager_id = ?
    `;

    db.query(
        sql,
        [
            title,
            content,
            status,
            effectiveDate,
            announcementId,
            managerId
        ],
        callback
    );
};




module.exports = {
    getManagerTeam,
    getTeamMemberById,
    getTeamOverview,
    getTeamActivity,
    createCoachingNote,
    getCoachingNotes,
    validateManagedEmployee,
    createAnnouncement,
    getAnnouncements,
    archiveAnnouncement,
    updateAnnouncement
};