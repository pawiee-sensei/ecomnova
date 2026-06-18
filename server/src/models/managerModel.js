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
    category,
    note,
    callback
) => {

    const sql = `
        INSERT INTO coaching_notes (
            employee_id,
            manager_id,
            category,
            note
        )
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            employeeId,
            managerId,
            category,
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
            coaching_notes.category,
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

const createAttendanceRecord = (
    employeeId,
    attendanceDate,
    status,
    callback
) => {

    const sql = `
        INSERT INTO attendance_records (
            employee_id,
            attendance_date,
            status
        )
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [
            employeeId,
            attendanceDate,
            status
        ],
        callback
    );
};

const getTeamAttendance = (
    managerId,
    callback
) => {

    const sql = `
        SELECT
            attendance_records.id,
            attendance_records.attendance_date,
            attendance_records.status,

            users.id AS employee_id,
            users.fullname

        FROM attendance_records

        INNER JOIN users
            ON attendance_records.employee_id = users.id

        WHERE users.manager_id = ?

        ORDER BY attendance_records.attendance_date DESC
    `;

    db.query(
        sql,
        [managerId],
        callback
    );
};

const getAttendanceSummary = (
    managerId,
    callback
) => {
    
const sql = `
    SELECT

        SUM(
            attendance_records.status = 'present'
        ) AS presentCount,

        SUM(
            attendance_records.status = 'late'
        ) AS lateCount,

        SUM(
            attendance_records.status = 'absent'
        ) AS absentCount,

        SUM(
            attendance_records.status = 'leave'
        ) AS leaveCount

    FROM attendance_records

    INNER JOIN users
        ON attendance_records.employee_id = users.id

    WHERE users.manager_id = ?
`;

    db.query(
        sql,
        [managerId],
        callback
    );
};

const getAttendanceAnalytics = (
    managerId,
    callback
) => {

    const sql = `
        SELECT
            users.id AS employee_id,
            users.fullname,
            users.department_id,

            COALESCE(
    SUM(
        attendance_records.status = 'present'
    ),
    0
) AS presentCount,

COALESCE(
    SUM(
        attendance_records.status = 'late'
    ),
    0
) AS lateCount,

COALESCE(
    SUM(
        attendance_records.status = 'absent'
    ),
    0
) AS absentCount,

COALESCE(
    SUM(
        attendance_records.status = 'leave'
    ),
    0
) AS leaveCount

        FROM users

        LEFT JOIN attendance_records
            ON attendance_records.employee_id = users.id

        WHERE users.manager_id = ?

        GROUP BY
            users.id,
            users.fullname

        ORDER BY users.fullname
    `;

    db.query(
        sql,
        [managerId],
        callback
    );
};

const getEmployeeAttendanceHistory = (
    employeeId,
    managerId,
    callback
) => {

    const sql = `
        SELECT
            attendance_records.id,
            attendance_records.attendance_date,
            attendance_records.status

        FROM attendance_records

        INNER JOIN users
            ON users.id =
               attendance_records.employee_id

        WHERE
            attendance_records.employee_id = ?
        AND
            users.manager_id = ?

        ORDER BY
            attendance_records.attendance_date DESC
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

const getAttendanceAlerts = (
    managerId,
    callback
) => {

    const sql = `
        SELECT
            users.id,
            users.fullname,
            attendance_records.status,
            attendance_records.attendance_date

        FROM users

        INNER JOIN attendance_records
            ON users.id =
               attendance_records.employee_id

        WHERE users.manager_id = ?

        ORDER BY
            users.id,
            attendance_records.attendance_date DESC
    `;

    db.query(
        sql,
        [managerId],
        callback
    );
};

const updateEmployeeShift = (
    employeeId,
    managerId,
    shift,
    callback
) => {
    const sql = `
        UPDATE users
        SET shift = ?
        WHERE id = ?
        AND manager_id = ?
    `;
    db.query(sql, [shift, employeeId, managerId], callback);
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
    updateAnnouncement,
    createAttendanceRecord,
    getTeamAttendance,
    getAttendanceSummary,
    getAttendanceAnalytics,
    getEmployeeAttendanceHistory,
    getAttendanceAlerts,
    updateEmployeeShift
};