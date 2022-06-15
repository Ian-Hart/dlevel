const test = require('tape');
const dlevel = require('..');

test('db.test.deeplevels.js: List all db sublevels.', async function (t) {
    let actual = await dlevel.db.deeplevels();
   
    let expected = [
        '!root!!users!',
        '!root!!searches!',
        '!root!!searches!!shop_endpoints!',
        '!root!!searches!!shop_endpoints!!hg5afb!!products!',
        '!root!!searches!!shop_endpoints!!hg5afb!!products!!shoes!',  
      ];

    t.deepEqual(actual, expected);
    console.log('List all database sublevels');
    console.log('-------------actual---------------');
    console.log(actual);
    console.log('-------------expected---------------');
    console.log(expected);  

    t.end();
});