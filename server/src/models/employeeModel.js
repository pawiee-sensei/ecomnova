const db = require("../config/db");

/*
  Fetch workforce directory
  Model = SQL only
*/

const getAllEmployees = (callback) => {
    const sql = `
        SELECT
            id,
            employee_id,
            fullname,
            email,
            role,
            status,
            created_at
        FROM users
        ORDER BY created_at DESC
    `;

    db.query(sql, callback);
};

module.exports = {
    getAllEmployees
};