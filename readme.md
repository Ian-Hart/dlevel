# deep-level

deep-level is a collection of convenience utilities that wraps [`classic-level`](https://github.com/Level/classic-level) in Node.js, a LevelDB back database.  It was developed to easily manage highly dynamic deep hierachies of sublevels which are regularly created and destroyed. The database and individual sublevels are also able to exported and imported in JSON format. All database operations are logged with entries timestamped.

[![Node version](https://img.shields.io/node/v/level.svg)](https://www.npmjs.com/package/level)

## Table of Contents

<details><summary>Click to expand</summary>

- [deep-level](#deep-level)
  - [Table of Contents](#table-of-contents)
  - [Concepts](#concepts)
  - [Environment Variables](#environment-variables)
  - [Usage](#usage)
  - [Logging](#logging)

</details>

## Concepts
classic-level allows separation of a levelup database into sections - or sublevels.    Each sublevel is a levelup of its own. This means it has the exact same interface as its parent database, but its own keyspace and events. 

Naming of a sublevel is prefixed and postfixed with a '!' character. A sublevel database is able to be referenced by combining the parent sublevels names including the prefix and postfix character '!'.   e.g. '!one!!two!'.  In deep-level the first sublevel is always '!root!'. A new sublevel with a name of "user" would be referenced as !root!!user! .   A sublevel of "images' as !root!images! .  A sublevel named "png" below "images" referenced as !root!images!!png! etc.  

This full path to reference a sublevel is referred to in deep-level as the deepLevel path.  For example the deepLevel path of images sublevel is !root!images! . Each entry within the sublevel is comprised of key-value pair. deep-level utilises 'utf8' encoded keys and 'json' encoded values. In deep-level keys are created by adding an id to the deepLevel path. For example if the id of the entry is 0agfefd then its key would be !root!images!!png!0agfefd. The 'json' value associated with this key also must include a key value pair with a json value key being named 'deepKey' and the value being the parent key value.  

 ```js
 {
   key: '!root!images!!png!0agfefd',  CHECK THIS FOR UNDERSTANDING
   value: {
     deepKey: '!root!images!!png!0agfefd',
    // Other key value pairs based on database implementation
   }
}
```

## Environment Variables
.env file 
```
NODE_ENV="test"

DB="./local_store/db"
DB_TEST="./test/local_store/db"

LOGS="./local_store/logs/%DATE%.log"
LOGS_TEST="./test/local_store/logs/%DATE%.log"
LOGS_PATH_TEST="./test/local_store/logs"

LOCAL_STORE_TEST="./test/local_store"
```

## Usage

```js
const db = require('./db');
const sublevel = require('./sublevel');
const entry = require('./entry');
const port = require('./port');

// Set the database location and logging parameters

// Create a database with a sublevel named 'searches' with associated schema. Schema 'deepKey' and 'timestamp' added by default
let searches_schema = { category: 'Search category', description: 'Search description', logo: 'base64 encoded logo icon'};
await sublevel.create('!root!!searches!', searches_schema);

// Add a entry to the searches sublevel.  
// Key for the entry is: cl3bk9xj
// deepKey for entry is: !root!!searches!cl3bk9xj
let shop_search = {deepKey:'!root!!searches!cl3bk9xj', category: 'Shopping', description: 'Black Friday shopping specials', logo: 'shoppingbase64logo'};
await entry.put(search_shopping);

// Create a sublevel under searches corresponding to the endpoints of the websites to search 
let endpoint_schema = {deepKey:'deepKey', url: 'url of website to search'};
await sublevel.create('!root!!searches!!shop_endpoints!', endpoint_schema);

// Add a entry for amazon under shop_endpoints sublevel. 
// Key for entry is: fx1w07.
// deepKey for entry is :!root!!searches!!shop_endpoint!fx1w07
await entry.put({deepKey:'!root!!searches!!shop_endpoint!fx1w07', url: 'www.amazon.com'});

// Add a entry for ebay under shop_endpoints sublevel. 
// Key for entry is: hg5afb.
// deepKey for entry is :!root!!searches!!shop_endpoint!hg5afb
await entry.put({deepKey:'!root!!searches!!shop_endpoint!hg5afb', url: 'www.ebay.com'});

// Create a branched sublevel for ebay for different products
let product_schema = {product_cat: 'Category of product'};
await sublevel.create('!root!!searches!!shop_endpoints!hg5afb!products', product_schema);

// Add a entry for ebay products branch for shoes. 
// Key for entry is: hg5afb.
// deepKey for entry is :!root!!searches!!shop_endpoint!hg5afb
await entry.put({deepKey:'!root!!searches!!shop_endpoint!hg5afb!products!shoes', product_cat: 'shoes'});

// etc etc etc

// Check if a sublevel exists
let deepLevel = '!root!!searches!!shop_endpoint!';
let doesExist = await level.exists(deepLevel)
console.log(doesExist);  // True

// Get the a entry in the searches sublevel using specific deepKey of !root!!searches!cl3bk9xj
let shop_search = await entry.get('!root!!searches!cl3bk9xj');
console.log(shop_search);
// {deepKey:'!root!!searches!cl3bk9xj', name: 'Shopping', description: 'Black Friday shopping specials', logo: 'shoppingbase64logo', timestamp:1651586054268}

// Delete this entry in the searches sublevel 
await entry.del('!root!!searches!cl3bk9xj');

// Get all data under the endpoint sublevel

let data = await sublevel.data('!root!!searches!!shop_endpoint!');
console.log(data);
//

// Drop the products sublevel '!root!!searches!!shop_endpoint!hg5afb!products! 
await sublevel.drop('!root!!searches!!shop_endpoint!hg5afb!products!');

// Select the shop_endpoint sublevel and work with it as a 'level' instance

let subdb = await sublevel.select()

 // Iterate entries using sublevel instance
for await (const [key, value] of subdb.iterator()) {
  console.log(key, value) 
}

// Get database status
let status = await db.status();
console.log(status);
 
// Get all database data
let allData = await db.data();
console.log(allData);

// Export database to JSON
let dataJson = await port.toJSON();
console.log(dataJson);

// List all database deepKeys
let keys = await db.keys()
console.log(keys)

// Extract information from deepLevel key.
// {sublevels, deepLevel, deepKey, id};
// Array of sublevels
let sublevels = part.slice('!root!!searches!!shop_endpoint!fx1w07').sublevels;
console.log(sublevels);
// deepLevel
let deepLevel = part.slice('!root!!searches!!shop_endpoint!fx1w07').deepLevel;
console.log(deepLevel);
// deepKey
let deepKey = part.slice('!root!!searches!!shop_endpoint!fx1w07').deepKey;
console.log(deepKey);
// id
let id = part.slice('!root!!searches!!shop_endpoint!fx1w07').id;
console.log(id);

```

## Logging

'deep-level' uses winston and specifically winston-daily-rotate-file.  Formatting of log files can be set in the logConfiguration contsant in the log.js file.

```js 

const logConfiguration = {
  transports: transport,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'MM-DD-YY HH:mm:ss'
    }),
    winston.format.splat(),
    winston.format.errors({ stack: true }),
    winston.format.prettyPrint(),
    winston.format.printf(info => `${info.level}: ${[info.timestamp]}: log: ${info.message}`),
  )
};

```



