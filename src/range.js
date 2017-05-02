import { isArray } from './utils/utils.js';

const DAY_MS = 24 * 60 * 60 * 1000;

export {
    getRange,
    loopRange
}
function getRange(data) {
    let length = data.length,
        minDate,
        maxDate,
        current,
        minCurr,
        maxCurr,
        i = 0;

    while (i < length) {
        current = data[i];

        if (current.hasOwnProperty('terms')) {
            let term = getRange(current.terms);
            minCurr = term.min;
            maxCurr = term.max;
        }
        else if (current.hasOwnProperty('date')) {
            let date = current.date;
            if (isArray(date)) {
                minCurr = date[0];
                maxCurr = date[1];
            } else {
                minCurr = date;
                maxCurr = date;
            }
        }
        if (minDate === undefined
        || +minCurr < +minDate) {
            minDate = minCurr;
        }
        if (maxDate === undefined
        || +maxCurr > +maxDate) {
            maxDate = maxCurr;
        }
        i += 1;
    }
    return {
        total: ((+maxDate - +minDate) / DAY_MS) + 1,
        min: minDate,
        max: maxDate
    }
}

function loopRange(callback, store) {
    return (range, data) => {
        let day = new Date(range.min.getTime()),
            max = new Date(range.max.getTime());
        if (day > max) {
            return store;
        }
        data = data || {};
        data.range = range;
        while (day <= max) {
            callback(day, store, data);
            day.setDate(day.getDate()+1);
        }
        return store;
    }
}