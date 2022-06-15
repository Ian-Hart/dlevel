const test = require('tape');
const dlevel = require('..');

test('db.test.data.js: List all db data.', async function (t) {
    let actual = await dlevel.db.data();
    console.log('List all database data');
    console.log(actual);
    
    t.end();
});