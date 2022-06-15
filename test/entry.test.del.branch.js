const test = require('tape');
const dlevel = require('..');

test('entry.test.del.branch.js: Delete a branch entry.', async function (t) {   
   
    let dk = '!root!!searches!!shop_endpoints!!hg5afb!!products!shoes';
    let dl = '!root!!searches!!shop_endpoints!!hg5afb!!products!!shoes!';
   
    let keyexists =  await dlevel.db.haskey(dk);
    t.equal(keyexists, true);

    let levelexists = await dlevel.sublevel.exists(dl);
    t.equal(levelexists, true);

    let deepKey = await dlevel.entry.del(dk);
    t.ok(deepKey, '!root!!searches!!shop_endpoints!!hg5afb!!products!!shoes')

    keyexists =  await dlevel.db.haskey(dk);
    t.equal(keyexists, false);

    levelexists = await dlevel.sublevel.exists(dl);
    t.equal(levelexists, false);

    t.end();
});