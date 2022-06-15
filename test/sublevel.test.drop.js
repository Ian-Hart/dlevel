const test = require('tape');
const dlevel = require('..');
const { setTimeout: setTimeoutPromiseBased } = require('timers/promises');

test('sublevel.test.drop.js: Drop sublevel.', async function (t) {   
    
    //await setTimeoutPromiseBased(3000);
    let expected = await dlevel.db.deeplevels();
    expected.splice(0, 1);

    let levelDropped = await dlevel.sublevel.drop('!root!!users!');

    let actual = await dlevel.db.deeplevels();

    t.deepEqual(actual, expected);
  
    console.log('-------------actual---------------');
    console.log(actual);
    console.log('-------------expected---------------');
    console.log(expected);  
});