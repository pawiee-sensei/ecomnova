require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const db = require('./src/config/db');

const queries = [
  'ALTER TABLE teams ADD COLUMN IF NOT EXISTS code VARCHAR(50) NULL AFTER name',
  'ALTER TABLE teams ADD COLUMN IF NOT EXISTS description TEXT NULL AFTER department_id',
  'ALTER TABLE users ENGINE=InnoDB',
  'ALTER TABLE login_attempts ENGINE=InnoDB',
  'SET FOREIGN_KEY_CHECKS=0',
  'ALTER TABLE login_attempts DROP FOREIGN KEY IF EXISTS login_attempts_ibfk_1',
  'SET FOREIGN_KEY_CHECKS=1',
  'ALTER TABLE login_attempts ADD CONSTRAINT login_attempts_ibfk_1 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL'
];

let index = 0;

function runNext() {
  if (index >= queries.length) {
    console.log('Schema repair complete');
    db.end();
    return;
  }

  const sql = queries[index];
  index += 1;

  db.query(sql, (err) => {
    if (err) {
      console.error('Failed on:', sql);
      console.error(err);
      db.end();
      process.exit(1);
    }
    runNext();
  });
}

runNext();
