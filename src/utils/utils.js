const objectString = Object.prototype.toString;
const arraySlice = Array.prototype.slice;

const isDate = isTypeofProto('Date');
const isArray = isTypeofProto('Array');
const isNodeList = isTypeofProto('NodeList');

export {
    isDate,
    isArray,
    isObject,
    forEach,
    indexOf
}

function isTypeofProto(name) {
    return value => objectString.call(value) === '[object '+ name +']';
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
        list = arraySlice.call(list);
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

function indexOf(data, match) {
    if (! (isArray(data) || typeof data === 'string')) {
        return -1;
    }
    if (typeof match !== 'function') {
        return data.indexOf(match); 
    }
    else {
        let length = data.length,
            i = 0;
        while (i < length) {
            if (match(data[i]) === true) {
                return i;
            }
            i += 1;
        }
        return -1;
    }
}