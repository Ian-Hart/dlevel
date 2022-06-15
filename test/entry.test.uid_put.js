const test = require('tape');
const dlevel = require('..');

test('entry.test.uid_put.js: Entry put generate UID.', async function (t) {
    let level_only = {deepKey:'!root!!searches!!shop_endpoints!!hg5afb!!products!', product_cat:'hats'}
    let deepKey_uid = await dlevel.entry.put(level_only, true);
    t.ok(deepKey_uid, deepKey_uid)

    let parts = dlevel.part.slice(deepKey_uid);
    t.ok(parts.id, parts.id)

    console.log('-------------actual---------------');
    console.log(parts.id);
    console.log('-------------expected---------------');
    console.log('UUID');

    t.end();
});