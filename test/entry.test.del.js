const test = require('tape');
const dlevel = require('..');

test('entry.test.delete.js: Delete an entry.', async function (t) {   
   
    let dk = '!root!!searches!!shop_endpoints!!hg5afb!!products!!shoes!nike_air';
   
    let keyexists =  await dlevel.db.haskey(dk);
    t.equal(keyexists, true);

    let deepKey = await dlevel.entry.del(dk);
    t.ok(deepKey, '!root!!searches!!shop_endpoints!!hg5afb!!products!!shoes!nike_air')

    keyexists =  await dlevel.db.haskey(dk);
    t.equal(keyexists, false);

    t.end();
});