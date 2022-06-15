const test = require('tape');
const dlevel = require('..');
const { setTimeout: setTimeoutPromiseBased } = require('timers/promises');

test('db.test.js: Database should be created and opens', async function (t) {
    let status = await dlevel.db.status;
    t.equals(status,'opening');
    
    console.log('-------------actual---------------');
    console.log(status);
    console.log('-------------expected---------------');
    console.log('opening');  


    await setTimeoutPromiseBased(2000);
    status = await dlevel.db.status;
    t.equals(status, 'open' );

    console.log('-------------actual---------------');
    console.log(status);
    console.log('-------------expected---------------');
    console.log('open');  
    
    t.end();
});


