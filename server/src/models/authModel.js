const db = require("../config/db");

const createUser = (fullname, email, password, role,  callback) => {
    const sql = `INSERT INTO users (fullname, email, password, role)VALUES (?, ?, ?, ?)`;

    db.query(sql, [fullname, email, password, role], callback);
};

const findUserByEmail = (email, callback) => {
    const sql = `SELECT * FROM users WHERE email = ?`;

    db.query(sql, [email], callback);
};

module.exports = {createUser,findUserByEmail};