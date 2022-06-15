const test = require('tape');
const dlevel = require('..');

test('sublevel.test.create.js: Sublevels created', async function (t) {

  let user_schema = { category: 'Users', description: 'User profiles'};
  await dlevel.sublevel.create('!root!!users!', user_schema);

  let searches_schema = { category: 'Search category', description: 'Search description', logo: 'base64 encoded logo icon'};
  await dlevel.sublevel.create('!root!!searches!', searches_schema);

  let endpoint_schema = {deepKey:'deepKey', url: 'url of website to search'};
  await dlevel.sublevel.create('!root!!searches!!shop_endpoints!', endpoint_schema);

  let product_schema = {product_cat: 'Category of product'};
  await dlevel.sublevel.create('!root!!searches!!shop_endpoints!!hg5afb!!products!', product_schema);

  let actual = await dlevel.db.deepkeys();

  let expected = [       
    '!root!!users!----HEADER----',   
    '!root!!searches!----HEADER----',
    '!root!!searches!!shop_endpoints!----HEADER----',                
    '!root!!searches!!shop_endpoints!!hg5afb!!products!----HEADER----',      
  ]
  t.deepEqual(actual, expected);

  console.log('-------------actual---------------');
  console.log(actual);
  console.log('-------------expected---------------');
  console.log(expected);  

  t.end();
});