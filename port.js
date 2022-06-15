const log = require('./log');
const db = require('./db');
const sublevel = require('./sublevel');
const entry = require('./entry');
const part = require('./part');
const unflatten = require('flat').unflatten;

async function toObject(){
    let dbObject = {};
    let entries = await db.data();

    entries.forEach(entry => {
        let dbObjectKey = part.join(entry.key, '.')
        dbObject[dbObjectKey] = entry.value;
    });
    
    dbObject = unflatten(dbObject,{safe: true, object: true});
    return dbObject;
}

function filter(obj, levelsFromJSON, entriesFromJSON) {   
    for (var key in obj) {
        if (obj[key] !== null && typeof(obj[key])=='object') {
            //going one step down in the object tree!
            filter(obj[key], levelsFromJSON, entriesFromJSON);
        }else if (key =='deepKey'){
            let isLevel =  obj[key].includes('----HEADER----');
            if(isLevel){
                levelsFromJSON.push(obj[key].replace('----HEADER----', ''));
            }else{
                entriesFromJSON.push(obj);
            }
        }
    }
}

async function toJSON(){
    let dbObject  = await toObject();
    let dbJSON = JSON.stringify(dbObject,null, 5);
    log.msg({sublevel: db, query: 'TO_JSON', value:'All sublevels exported'});
    return dbJSON;
}

async function fromJSON(dbJSON){
    let levelsFromJSON =[];
    let entriesFromJSON = [];
    let dbObject = JSON.parse(dbJSON);
 
    filter(dbObject, levelsFromJSON, entriesFromJSON);

    try {
        const levelsToCreate = levelsFromJSON.map((levelFromJSON) => sublevel.create(levelFromJSON));
        await Promise.all(levelsToCreate);
        log.msg({sublevel: db, query: 'FROM_JSON', value:'All sublevels imported'});
    } catch (e) {
        log.msg({sublevel: db, query: 'FROM_JSON', error:'Failed to import sublevels'});
    }

    try {
        const entriesToPut = entriesFromJSON.map((entryFromJSON) => entry.put(entryFromJSON));
        await Promise.all(entriesToPut);
        log.msg({sublevel: db, query: 'FROM_JSON', value:'All entries made'});
    } catch (e) {
        log.msg({sublevel: db, query: 'FROM_JSON', error:'Failed to create entries'});
    }
}

module.exports.toJSON = toJSON;
module.exports.fromJSON = fromJSON;