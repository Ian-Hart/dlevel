
const log = require('./log');
const concat = require('level-concat-iterator')
const db = require('./db');
const part = require('./part');
const entry = require('./entry');

async function create(deepLevel, schema={}, child=false){
    let doesExist = await exists(deepLevel);
    if (doesExist===true)
    {
        log.msg({sublevel: deepLevel, query: 'CREATE', error:'Error: Sublevel already exists'});
        return false;
    }

     let value = {deepKey:deepLevel+'----HEADER----', schema: schema, child: child}; 
     await entry.put(value, false, true);
     
     log.msg({sublevel: deepLevel, query: 'CREATE', value:'Success: Sublevel created'});
     return true
}

async function branch(deepKey, schema={}) {
    let parent_value = await entry.get(deepKey);
    parent_value.parent = true;
    await entry.put(parent_value)

    let parts = part.slice(deepKey);
    let deepLevel = parts.deepLevel +`!`+ parts.id + `!`;
    let child = true;
    return await create(deepLevel, schema, child);
}  

async function select(deepLevel) {     
    let doesExist = await exists(deepLevel);
    
    if (doesExist===false)
    {
        log.msg({sublevel: deepLevel, query: 'SELECT', error:'Error: Level does not exist'});
        return null;
    }

    let sublevels = part.slice(deepLevel).sublevels;
        
    let selectedLevel = db;
    sublevels.forEach(level => {
        selectedLevel = selectedLevel.sublevel(level)
    });
    log.msg({sublevel: deepLevel, query: 'SELECT', value:'Success: Level selected'});

    return selectedLevel;
}

async function drop(deepLevel) {
    let thisLevel = await select(deepLevel);
    if(thisLevel===null){
        log.msg({ sublevel: deepLevel, query: 'DROP', error: 'Error: Level does not exist'});
        return null;
    }

    await thisLevel.clear(function (err) {
        if(err){
            log.msg({ sublevel: deepLevel, query: 'DROP', error: err });
            return null;
        }
        else{
            log.msg({sublevel: deepLevel, query: 'DROP', value:'Success: Level dropped'});
        }
    });

    await atomic(deepLevel, false);  
    return (deepLevel);
}

async function data(deepLevel) {
    let thisLevel = await select(deepLevel);
    if(thisLevel===null){
        log.msg({sublevel: deepLevel, query: 'DATA', error:'Error: Level does not exist'});
        return null;
    }

    let entries = await concat(thisLevel.iterator());
    log.msg({sublevel: deepLevel, query: 'DATA', value: entries});
    return entries;
}

async function exists(deepLevel){
    let dbKeys = await db.deepkeys();
    let levels = dbKeys.map(k => part.slice(k).deepLevel)
    let levelsSet = new Set(levels);
    return (levelsSet.has(deepLevel));
}

async function deepkeys(deepLevel){  
    let dbkeys = await db.deepkeys();
    let subkeys = dbkeys.filter(k => k.includes(deepLevel));
    let sorted_subkeys = part.sort(subkeys);
    return sorted_subkeys;
}

async function atomic(deepLevel, endState){
    let atomic = endState;
    do {
        atomic = await exists(deepLevel)
    } while (atomic !== endState);
}

module.exports.create = create;
module.exports.branch = branch;
module.exports.select = select;
module.exports.drop = drop;
module.exports.data = data;
module.exports.exists = exists;
module.exports.deepkeys = deepkeys;


    // branch need to update the orginal entry as a marking as trunk
    // level created is a branch
    // based on branch and need to be chain related levels
    // hierachy based on next level up but also specfic entries in a level
    // trunk method  SUBLEVEL BRANCH
    // If you delete the entry the branch is also dropped
    // master and branch

    //BUG  - Sort keys