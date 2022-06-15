const test = require('tape');
const fse = require('fs-extra');
require('dotenv').config({ path: __dirname + `./.env` }); 

test('log.test.exists.js: Winston log file should exist', t => {
    const logPath = (process.env.LOGS_PATH_TEST);
    let exists = fse.pathExistsSync(logPath);
    t.equal(exists, true);
    console.log('-------------actual---------------');
    console.log(exists);
    console.log('-------------expected---------------');
    console.log('opening');  
    t.end();
  });