const isDate = isTypeofProto('Date');
const isArray = isTypeofProto('Array');

export {
    isDate,
    isArray,
    isObject,
    forEach
}

function isTypeofProto(name) {
    return value => Object.prototype.toString.call(value) === '[object '+ name +']';
}
function isObject(value) {
    return value !== null && isTypeofProto('Object')(value) && !isArray(value);
}
function forEach(list, callback) {
    let indexed = isArray(list),
        length,
        props,
        prop,
        i = 0;

    if (! (indexed || isObject(list))) {
        return list;
    }
    props = indexed ? list : Object.keys(list);
    length = props.length;
    while (i < length) {
        prop = indexed ? i : props[i];
        callback(prop, list[prop], list);
        i += 1;
    }
}