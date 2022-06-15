
function slice(deepKeyOrLevel) {
    let parts = deepKeyOrLevel.split('!');
    // BUG - // check level valid !! etc
    let id = parts[parts.length - 1]
    let sublevels = parts.filter((v, i) => i % 2 == 1);
    let deepLevel = sublevels.map((sublevel) => '!' + sublevel + '!').join('');
    let deepKey = deepKeyOrLevel;
    return { sublevels, deepLevel, deepKey, id };
}

function join(deepKey, delimiter) {
    let parts = deepKey.split('!');
    let id = parts[parts.length - 1]
    let sublevels = parts.filter((v, i) => i % 2 == 1);
    sublevels.push(id);
    return sublevels.join(delimiter);
}

function sort(keys) {
    // Temporary array holds objects with position
    // and length of key element
    var lengths = keys.map(function (e, i) {
        return { index: i, value: e.length };
    });

    // Sorting the lengths array containing the lengths of
    // key names
    lengths.sort(function (a, b) {
        return +(a.value > b.value) || +(a.value === b.value) - 1;
    });

    // Copy element back to the key array
    var sortedKeys = lengths.map(function (e) {
        return keys[e.index];
    });

    return sortedKeys;
}

module.exports.slice = slice;
module.exports.join = join;
module.exports.sort = sort;



