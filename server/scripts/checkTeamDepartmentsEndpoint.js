require('dotenv').config({ path: __dirname + '/../.env' });
const db = require('../src/config/db');
const jwt = require('jsonwebtoken');
const http = require('http');

const getHrUser = () => new Promise((resolve, reject) => {
  db.query('SELECT id, token_version, status FROM users WHERE role = ? AND status = ? LIMIT 1', ['hr', 'active'], (err, rows) => {
    if (err) return reject(err);
    if (!rows || rows.length === 0) return reject(new Error('No active hr user found'));
    resolve(rows[0]);
  });
});

const requestDepartments = (token) => new Promise((resolve, reject) => {
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/hr/teams/departments',
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => resolve({ status: res.statusCode, body: data }));
  });
  req.on('error', reject);
  req.end();
});

(async () => {
  try {
    const user = await getHrUser();
    const token = jwt.sign({ id: user.id, tokenVersion: user.token_version || 0 }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const result = await requestDepartments(token);
    console.log('HR user:', user);
    console.log('Departments endpoint response:', result.status, result.body);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();
