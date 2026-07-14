require('dotenv').config({ path: __dirname + '/../.env' });
const db = require('../src/config/db');

const sql = `SELECT id, fullname, role, status FROM users WHERE role IN ('leader','manager') AND status='active' ORDER BY fullname`;

db.query(sql, (err, results) => {
  if (err) {
    console.error('DB error', err);
    process.exit(1);
  }

  console.log('Leaders:', results);
  process.exit(0);
});
