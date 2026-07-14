require('dotenv').config({ path: __dirname + '/../.env' });
const db = require('../src/config/db');

const sql = `SELECT id, name, code, status FROM departments ORDER BY id`;

db.query(sql, (err, results) => {
  if (err) {
    console.error('DB error', err);
    process.exit(1);
  }

  console.log('Departments:', results);
  process.exit(0);
});
