const db = require("../config/db");

const getTotalEmployees = (callback) => {
    const sql = `
        SELECT COUNT(*) AS totalEmployees
        FROM users
        WHERE role IN ('admin', 'manager', 'agent')
    `;

    db.query(sql, callback);
};

const getActiveEmployees = (callback) => {
    const sql = `
        SELECT COUNT(*) AS activeEmployees
        FROM users
        WHERE role IN ('admin', 'manager', 'agent')
    `;

    db.query(sql, callback);
};

module.exports = {
    getTotalEmployees,
    getActiveEmployees
};
