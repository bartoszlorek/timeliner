import { isArray, forEach } from './utils.js';
import { create, appends, empty } from './dom.js';

const PREFIX = 'timeliner-';
const DAY_MS = 24*60*60*1000;
const TASK_HEIGHT = 10;
const MONTHS = [ 'styczeń', 'luty', 'marzec', 'kwiecień',
     'maj', 'czerwiec', 'lipiec', 'sierpień', 'wrzesień',
     'październik', 'listopad', 'grudzień' ];

const TODAY = new Date();
TODAY.setHours(0,0,0,0);

export default function(container, data) {
    console.log(data)

    if (! data.length) {
        return false;
    }
    let range = getRange(data),
        tasks = getTasks(range, data);
        
    appends(empty(container), [
        create('div', { class: PREFIX + 'head' }, monthsIn(range)),
        create('div', {
            class: PREFIX + 'body',
            style: {
                height: tasks.height * TASK_HEIGHT + 16 + 'px'
            }
        }, [
            create('div', { class: PREFIX + 'days' }, daysIn(range)),
            create('div', { class: PREFIX + 'tasks' }, tasks.frag)
        ])
    ]);
    return true;
}

const daysIn = inRange((day, frag) => {
    frag.appendChild(
        create('div', { class: dayClass(day) },
            create('span', {
                class: PREFIX + 'day-head',
                text: day.getDate()
            })
        )
    );
}, fragment());

const monthsIn = inRange((day, frag, data) => {
    if (typeof data.index === 'undefined') {
        data.index =  0;
        data.prev = -1;
        data.left = 0;
    }
    let last = data.index === data.range.count-1,
        current = day.getMonth();

    if (current != data.prev && data.index > 0 || last) {
        let width = data.index - data.left,
            month = data.prev,
            year = day.getFullYear();

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
                    width: width / data.range.count * 100 + '%'
                }
            })
        );
        data.left = data.index;
    }    
    data.prev = current;
    data.index += 1;
},  fragment());

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

function inRange(callback, store) {
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

function getTasks(range, data) {
    let count = range.count,
        root = +range.min,
        frag = fragment(),
        tasks = [],
        maxTop = 0;

    forEach(data, (i, bucket) => {
        forEach(bucket.terms, (j, task) => {
            let period = isArray(task.date),
                start = period ? +task.date[0] : +task.date,
                end = period ? +task.date[1] : start,
                left = (start - root) / DAY_MS,
                width = (end - start) / DAY_MS + 1,
                top = nonOverlappingTop(tasks, left, width);

            if (top > maxTop) {
                maxTop = top;
            }
            frag.appendChild(
                create('div', {
                    class: PREFIX + 'task',
                    style: {
                        top: top * TASK_HEIGHT + 'px',
                        left: left / count * 100 + '%',
                        width: width / count * 100 + '%',
                        height: TASK_HEIGHT + 'px'
                    },
                    event: {
                        mouseover: () => highlight(task.item, true),
                        mouseout: () => highlight(task.item, false)
                    }
                })
            );
        });
    });
    return {
        height: maxTop + 1,
        frag
    }
}

function segmentsOverlap(a, b) {
    if (a[2] !== b[2]) {
        return false;
    }
    let min = Math.min(a[0] + a[1], b[0] + b[1]),
        max = Math.max(a[0], b[0]);
    return Math.max(0, min - max) > 0;
}

function nonOverlappingTop(tasks, left, width) {
    let task = [left, width, 0],
        length = tasks.length;

    if (length) {
        let overlap,
            i;
        while (true) {
            overlap = false;
            i = 0;
            while (i < length) {
                if (segmentsOverlap(tasks[i], task)) {
                    overlap = true;
                    break;
                }
                i += 1;
            }
            if (overlap) {
                task[2] += 1;
            } else {
                break;
            }
        }
    }
    tasks.push(task);
    return task[2];
}

function fragment() {
    return document.createDocumentFragment();
}

function highlight(element, state) {
    element.style.backgroundColor = state ? '#c7e0f4' : '';  
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