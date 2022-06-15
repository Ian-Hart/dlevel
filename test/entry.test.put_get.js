const test = require('tape');
const dlevel = require('..');

test('entry.test.put_get.js: Entry put and get value', async function (t) {
    let value = {deepKey:'!root!!searches!!shop_endpoints!!hg5afb!!products!shoes', product_cat:'shoes'}
    let deepKey = await dlevel.entry.put(value);
    t.equal(deepKey, '!root!!searches!!shop_endpoints!!hg5afb!!products!shoes')
    
    console.log('-------------PUT---------------');
    console.log('-------------actual---------------');
    console.log(deepKey);
    console.log('-------------expected---------------');
    console.log('!root!!searches!!shop_endpoints!!hg5afb!!products!shoes');  

    let expected = value;
    let actual = await dlevel.entry.get('!root!!searches!!shop_endpoints!!hg5afb!!products!shoes');
    t.deepEqual(actual, expected);

    console.log('-------------GET---------------');
    console.log('-------------actual---------------');
    console.log(actual);
    console.log('-------------expected---------------');
    console.log(expected);  

    
    t.end();
});