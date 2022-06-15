
const dlevel = require('..');

async function dlevel_example() {
// Set the database location and logging parameters

// Create a database with a sublevel named 'searches' with associated schema. Schema 'deepKey' and 'timestamp' added by default
let searches_schema = { category: 'Search category', description: 'Search description', logo: 'base64 encoded logo icon'};
await dlevel.sublevel.create('!root!!searches!', searches_schema);

// Add a entry to the searches sublevel.  
// Key for the entry is: cl3bk9xj
// deepKey for entry is: !root!!searches!cl3bk9xj
let shop_search = {deepKey:'!root!!searches!cl3bk9xj', category: 'Shopping', description: 'Black Friday shopping specials', logo: 'shoppingbase64logo'};
await dlevel.entry.put(shop_search);

// Create a sublevel under searches corresponding to the endpoints of the websites to search 
let endpoint_schema = {deepKey:'deepKey', url: 'url of website to search'};
await dlevel.sublevel.create('!root!!searches!!shop_endpoints!', endpoint_schema);

// Add a entry for amazon under shop_endpoints sublevel. 
// Key for entry is: fx1w07.
// deepKey for entry is :!root!!searches!!shop_endpoint!fx1w07
await dlevel.entry.put({deepKey:'!root!!searches!!shop_endpoint!fx1w07', url: 'www.amazon.com'});

// Add a entry for ebay under shop_endpoints sublevel. 
// Key for entry is: hg5afb.
// deepKey for entry is :!root!!searches!!shop_endpoint!hg5afb
await dlevel.entry.put({deepKey:'!root!!searches!!shop_endpoint!hg5afb', url: 'www.ebay.com'});

// Create a branched sublevel for ebay for different products
let product_schema = {product_cat: 'Category of product'};
await dlevel.sublevel.branch('!root!!searches!!shop_endpoints!hg5afb!products', product_schema);

// Add a entry for ebay products branch for shoes. 
// Key for entry is: hg5afb.
// deepKey for entry is :!root!!searches!!shop_endpoint!hg5afb
await dlevel.entry.put({deepKey:'!root!!searches!!shop_endpoint!hg5afb!products!shoes', product_cat: 'shoes'});

// etc etc etc

// Check if a sublevel exists
let deepLevel = '!root!!searches!!shop_endpoint!';
let doesExist = await dlevel.sublevel.exists(deepLevel)
console.log(doesExist);  // True

// Get the a entry in the searches sublevel using specific deepKey of !root!!searches!cl3bk9xj
let shop_search_value = await dlevel.entry.get('!root!!searches!cl3bk9xj');
console.log(shop_search_value);
// {deepKey:'!root!!searches!cl3bk9xj', name: 'Shopping', description: 'Black Friday shopping specials', logo: 'shoppingbase64logo', timestamp:1651586054268}

// Delete this entry in the searches sublevel 
await dlevel.entry.del('!root!!searches!cl3bk9xj');

// Get all data under the endpoint sublevel

let data = await dlevel.sublevel.data('!root!!searches!!shop_endpoint!');
console.log(data);
//

// Drop the products sublevel '!root!!searches!!shop_endpoint!hg5afb!products! 
await dlevel.sublevel.drop('!root!!searches!!shop_endpoint!hg5afb!products!');

// Select the shop_endpoint sublevel and work with it as a 'level' instance

let subdb = await dlevel.sublevel.select('!root!!searches!!shop_endpoint!');

 // Iterate entries using sublevel instance
for await (const [key, value] of subdb.iterator()) {
  //console.log(key, value); 
}

// Get database status
let status = await dlevel.db.status;
console.log(status);
 
// Get all database data
let allData = await dlevel.db.data();
console.log(allData);

// Export database to JSON
let dataJson = await dlevel.port.toJSON();
console.log(dataJson);

// List all database deepKeys
let keys = await dlevel.db.deepkeys()
console.log(keys)

// Extract information from deepLevel key.
// {sublevels, deepLevel, deepKey, id};
// Array of sublevels
let sublevels = dlevel.part.slice('!root!!searches!!shop_endpoint!fx1w07').sublevels;
console.log(sublevels);
// deepLevel
let deepLevels = dlevel.part.slice('!root!!searches!!shop_endpoint!fx1w07').deepLevel;
console.log(deepLevels);
// deepKey
let deepKey = dlevel.part.slice('!root!!searches!!shop_endpoint!fx1w07').deepKey;
console.log(deepKey);
// id
let id = dlevel.part.slice('!root!!searches!!shop_endpoint!fx1w07').id;
console.log(id);
}

(async function () {
    await dlevel_example();
})()


