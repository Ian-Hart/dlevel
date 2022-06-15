const test = require('tape');
const dlevel = require('..');

test('sublevel.test.branch.js: Creates branched sublevel from entry.', async function (t) {   
    let branched = await dlevel.sublevel.branch('!root!!searches!!shop_endpoints!!hg5afb!!products!shoes');
    t.equal(branched, true);
    console.log('Branch created');
    console.log('-------------actual---------------');
    console.log(branched);
    console.log('-------------expected---------------');
    console.log("true");  


    let value = await dlevel.entry.get('!root!!searches!!shop_endpoints!!hg5afb!!products!shoes'); 
    t.equal(value.parent, true);
    console.log('Entry value contains parent property with true value');
    console.log('-------------actual---------------');
    console.log(value.parent);
    console.log('-------------expected---------------');
    console.log("true"); 

    let exists = await dlevel.sublevel.exists('!root!!searches!!shop_endpoints!!hg5afb!!products!!shoes!')   
    t.equal(exists, true);
    console.log('Sublevel created');
    console.log('-------------actual---------------');
    console.log(exists);
    console.log('-------------expected---------------');
    console.log("true"); 

    let header_key = '!root!!searches!!shop_endpoints!!hg5afb!!products!!shoes!'+'----HEADER----'
    let header_value = await dlevel.entry.get(header_key); 
    t.equal(header_value.child, true);
    console.log('Sublevel header contains child property with true value');
    console.log('-------------actual---------------');
    console.log(header_value.child);
    console.log('-------------expected---------------');
    console.log("true");


    console.log('-------------Add entry to new sublevel---------------');
 
    let entry = {deepKey:'!root!!searches!!shop_endpoints!!hg5afb!!products!!shoes!nike_air', product:'Nike Air Jordan'}
    let deepKey = await dlevel.entry.put(entry);
    t.ok(deepKey, '!root!!searches!!shop_endpoints!!hg5afb!!products!!shoes!nike_air')

    t.end();
});