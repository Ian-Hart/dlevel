
const log = require('./log');
const db = require('./db');
const sublevel = require('./sublevel');
const part = require('./part');
const cuid = require('cuid');

async function get(deepKey) {
    let parts = part.slice(deepKey);

    try {
        let value = await db.get(deepKey);
        log.msg({ sublevel: parts.deepLevel, query: 'GET', id: parts.id, value: value });
        return value;
    } catch (err) {
        log.msg({ sublevel: parts.deepLevel, query: 'GET', id: parts.id, error: err });
        return null;
    }
}

async function put(value, generate_uid = false, header = false) {
    value.timestamp = Date.now();
    let parts = part.slice(value.deepKey);
    let exists = await sublevel.exists(parts.deepLevel);

    if (!exists && !header) {
        log.msg({ sublevel: parts.deepLevel, query: 'PUT', id: parts.id, error: "LEVEL NOT FOUND" });
        return null;
    }

    if (generate_uid === true) {
        uid = cuid();
        value.deepKey = parts.deepLevel + uid;
        parts.id = uid;
    }

    try {
        await db.put(value.deepKey, value);
        log.msg({ sublevel: parts.deepLevel, query: 'PUT', id: parts.id, value: value });
        return value.deepKey;
    } catch (err) {
        log.msg({ sublevel: parts.deepLevel, query: 'PUT', id: parts.id, error: err });
        return null;
    }
}

async function del(deepKey) {
    let parts = part.slice(deepKey);
    let deepLevel = parts.deepLevel +`!`+ parts.id + `!`;
    let branch = await sublevel.exists(deepLevel);
    try {
        if(branch){
            await sublevel.drop(deepLevel);
            log.msg({ sublevel: parts.deepLevel, query: 'DEL_DROP_BRANCH'});
        }
        await db.del(deepKey);
        log.msg({ sublevel: parts.deepLevel, query: 'DEL', id: parts.id });
        return deepKey;
    } catch (err) {
        log.msg({ sublevel: parts.deepLevel, query: 'DEL', id: parts.id, error: err });
        return null;
    }
}

module.exports.get = get;
module.exports.put = put;
module.exports.del = del;
