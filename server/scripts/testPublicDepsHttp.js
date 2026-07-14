const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/hr/teams/departments',
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    try {
      console.log('Body:', JSON.parse(data));
    } catch (e) {
      console.log('Body:', data);
    }
    process.exit(0);
  });
});

req.on('error', (err) => {
  console.error('Request error', err);
  process.exit(1);
});

req.end();
