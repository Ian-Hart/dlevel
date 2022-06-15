require('dotenv').config({ path: __dirname + `./.env` }); 
const log = require('./log');
const part = require('./part');
const { Level } = require('level');
const concat = require('level-concat-iterator');
const dbPath =  process.env.NODE_ENV==='production' ? process.env.DB : process.env.DB_TEST;
const db = new Level(dbPath, { valueEncoding: 'json' })
const root = db.sublevel('root', { valueEncoding: 'json' });


async function data() {
    let entries = await concat(db.iterator());
    log.msg({sublevel: 'db', query: 'ALL', value:'Success: All db entries returned'});
    return entries;
}

async function deepkeys(){
    let keys = await db.keys().all();
    let sorted_keys = part.sort(keys);
    return sorted_keys;
}

async function haskey(deepKey){
    let keys = await deepkeys();
    return keys.includes(deepKey);
}

async function deeplevels(){   
    let dbKeys = await db.deepkeys();
    let levelsWithDuplicates = dbKeys.map(k => part.slice(k).deepLevel)
    let levelsSet = new Set(levelsWithDuplicates);
    let levelsArray = Array.from(levelsSet);
    return levelsArray;
}

async function clearDB(){  
    await db.clear(function (err) {
        if(err)
            log.msg({ sublevel: 'db', query: 'CLEAR_DB', error: err });
        else{
            log.msg({sublevel: 'db', query: 'CLEAR_DB', value:'Success: Database cleared'});
        }
    });
}

module.exports = db;
module.exports.root = root;
module.exports.data = data;
module.exports.deepkeys = deepkeys;
module.exports.haskey = haskey;
module.exports.deeplevels = deeplevels;
module.exports.clearDB = clearDB;







