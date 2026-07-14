require('dotenv').config({ path: __dirname + '/../.env' });
const db = require('../src/config/db');
const teamService = require('../src/services/teamService');

teamService.getDepartments()
  .then((deps) => {
    console.log('Departments from service:', deps);
    return teamService.getTeamLeaders();
  })
  .then((leaders) => {
    console.log('Leaders from service:', leaders);
    process.exit(0);
  })
  .catch((err) => {
    console.error('Service call failed', err);
    process.exit(1);
  });
