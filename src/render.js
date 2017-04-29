import { isDate, isArray, forEach } from './utils.js';
import { create, empty } from './dom.js';

const PREFIX = 'timeliner-';
const DAY_MS = 24*60*60*1000;
const MONTHS = [ 'styczeń', 'luty', 'marzec', 'kwiecień',
     'maj', 'czerwiec', 'lipiec', 'sierpień', 'wrzesień',
     'październik', 'listopad', 'grudzień' ];

const TODAY = new Date();
TODAY.setHours(0,0,0,0);

export default function(container, data) {
    if (! data.length) {
        return false;
    }
    let range = getRange(data),
        board = create('div', { class: PREFIX + 'board' }, [
            create('div', { class: PREFIX + 'months' }, monthsIn(range)),
            create('div', { class: PREFIX + 'days' }, daysIn(range))
        ]);

    empty(container);
    container.appendChild(board);
    console.log(range)
}

const daysIn = inRange((day, frag) => {
    frag.appendChild(
        create('div', { class: dayClass(day) },[
            create('span', {
                class: PREFIX + 'day-head',
                text: day.getDate()
            })
        ])
    );
}, fragment());

const monthsIn = inRange((day, frag, data) => {
    let last = data.index === data.range.count-1,
        current = day.getMonth();

    if (current != data.prev && data.index > 0 || last) {
        let left = data.left,
            width = data.index - left,
            month = data.prev,
            year = day.getFullYear(),
            range = data.range.count;

        if (last) {
            width += 1;
        }
        if (!last && month === 11) {
            year -= 1;
        }
        frag.appendChild(
            create('div', {
                class: PREFIX + 'month',
                text: MONTHS[month] + ' ' + year,
                style: {
                    width: width / range * 100 + '%',
                    left: left / range * 100 + '%'
                }
            })
        );
        data.left = data.index;
    }    
    data.prev = current;
    data.index += 1;
},
    fragment(),
{
    index: 0,
    prev: -1,
    left: 0
});

/* ---------------------------------------- */

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
        count: ((+maxDate - +minDate) / DAY_MS) + 1,
        min: minDate,
        max: maxDate
    }
}

function inRange(callback, store, data) {
    return (range) => {
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

function dayClass(day) {
    let date = day.getDate(),
        week = day.getDay(),
        name = PREFIX + 'day';

    if (date === 1) {
        name += ' ' + PREFIX + 'first';
    }
    if (week === 0 || week === 6) {
        name += ' ' + PREFIX + 'weekend';
    }
    if (+day === +TODAY) {
        name += ' ' + PREFIX + 'today';
    }
    return name;
}

function fragment() {
    return document.createDocumentFragment();
}

function addBuckets() {

}