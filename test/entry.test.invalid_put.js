const test = require('tape');
const dlevel = require('..');

test('entry.test.invalid_put.js: Entry put invalid.  Level does not exist', async function (t) {
    let invalid_level_key = {deepKey:'!root!!searches!!shop_endpoints!!hg5afb!!products99999!shoes', product_cat:'shoes'}
    let deepKey = await dlevel.entry.put(invalid_level_key);
    t.notOk(deepKey, deepKey)
    console.log('-------------expected---------------');
    console.log(deepKey);
    t.end();
});