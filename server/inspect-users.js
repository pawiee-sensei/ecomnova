require('dotenv').config({path: require('path').resolve(__dirname, '.env')});
const db = require('./src/config/db');
db.query('SHOW TABLE STATUS LIKE "users"', (err, rows) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(JSON.stringify(rows, null, 2));
});
