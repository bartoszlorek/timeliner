const isDate = isTypeofProto('Date');
const isArray = isTypeofProto('Array');
const isNodeList = isTypeofProto('NodeList');

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
    let indexed,
        length,
        props,
        prop,
        i = 0;

    if (isNodeList(list)) {
        list = Array.prototype.slice.call(list);
    }
    indexed = isArray(list);
    if (! (indexed || isObject(list))) {
        return list;
    }
    props = indexed ? list : Object.keys(list);
    length = props.length;
    while (i < length) {
        prop = indexed ? i : props[i];
        if (callback(prop, list[prop], list) === false) {
            break;
        }
        i += 1;
    }
    return list;
}