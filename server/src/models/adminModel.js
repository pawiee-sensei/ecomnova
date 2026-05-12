const db = require("../config/db");

const getTotalEmployees = (callback) => {
    db.query (
        `
        SELECT COUNT(*) AS totalEmployees
        FROM users
        WHERE role IN ('admin', 'manager', 'agent')
        `,
        callback
    );
};

const getActiveEmployees = (callback) => {
    db.query (
        `
        SELECT COUNT(*) AS activeEmployees
        FROM users
        WHERE role IN ('admin', 'manager', 'agent')
        `,

    callback
    );
};

const getTotalDepartments = (callback) => {
    db.query(
        `
        SELECT COUNT(*) AS totalDepartments
        FROM departments
        `,
        callback
    );
};

const getOpenTickets = (callback) => {
    db.query(
        `
        SELECT COUNT(*) AS openTickets
        FROM tickets
        WHERE status = 'open'
        `,
        callback
    );
};

const getEscalatedTickets = (callback) => {
    db.query(
        `
        SELECT COUNT(*) AS escalatedTickets
        FROM tickets
        WHERE status = 'escalated'
        `,
        callback
    );
};

const getResolvedToday = (callback) => {
    db.query(
        `
        SELECT COUNT(*) AS resolvedToday
        FROM tickets
        WHERE status = 'resolved'
        AND DATE(created_at) = CURDATE()
        `,
        callback
    );
};

module.exports = {
    getTotalEmployees,
    getActiveEmployees,
    getTotalDepartments,
    getOpenTickets,
    getEscalatedTickets,
    getResolvedToday
};
