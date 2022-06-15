const test = require('tape');
const fse = require('fs-extra');
require('dotenv').config({ path: __dirname + `./.env` }); 

test('db.test.exists.js: Database CURRENT file should exist', t => {
    const file = ( process.env.DB_TEST +'/CURRENT');
    let exists = fse.pathExistsSync(file);
    t.equal(exists, true);
   
    console.log('-------------actual---------------');
    console.log(exists);
    console.log('-------------expected---------------');
    console.log('true');  
   
    t.end();
  });
