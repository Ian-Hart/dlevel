const test = require('tape');
const dlevel = require('..');
const del = require('del');
const { setTimeout: setTimeoutPromiseBased } = require('timers/promises');

test('port.test.json.js: Port database to JSON, Delete database and reimport from JSON.', async function (t) {   
    let dbJSON = await dlevel.port.toJSON();
    console.log('Database exported to JSON');
    console.log(dbJSON);
    console.log('Clear datbase');
    await dlevel.db.clearDB();
    await setTimeoutPromiseBased(2000);
    console.log('Database imported from JSON');
    await dlevel.port.fromJSON(dbJSON);
    dbJSON = await dlevel.port.toJSON();
    console.log(dbJSON);
    t.end();
});