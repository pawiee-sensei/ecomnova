require('dotenv').config({ path: __dirname + '/../.env' });
const db = require('../src/config/db');
const jwt = require('jsonwebtoken');

const userId = process.argv[2] || null;

if (!userId) {
  console.error('Usage: node genToken.js <userId>');
  process.exit(1);
}

db.query('SELECT id, token_version FROM users WHERE id = ?', [userId], (err, results) => {
  if (err) {
    console.error('DB error', err);
    process.exit(1);
  }

  if (results.length === 0) {
    console.error('User not found');
    process.exit(1);
  }

  const user = results[0];
  const token = jwt.sign({ id: user.id, tokenVersion: user.token_version || 0 }, process.env.JWT_SECRET, { expiresIn: '7d' });

  console.log(token);
  process.exit(0);
});
