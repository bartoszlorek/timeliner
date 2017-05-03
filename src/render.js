import { isArray, forEach } from './utils/utils.js';
import { create, appends, empty } from './utils/dom.js';
import { getRange, loopRange } from './range.js';
import { select, hover } from './select.js';
import { getColor } from './colors.js';

const MONTHS = [ 'styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec',
     'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień' ];
const WEEKDAYS = [ 'niedz', 'pon', 'wt', 'śr', 'czw', 'pt', 'sob' ];
const PREFIX = 'timeliner-';

const TASK_HEIGHT = 12;
const DAY_MS = 24 * 60 * 60 * 1000;
const TODAY = new Date();
TODAY.setHours(0,0,0,0);

export default function(container, data) {
    if (!data.length) {
        return false;
    }
    let range = getRange(data),
        tasks = getTasks(range, data);
       
    appends(empty(container), [
        create('div', { class: PREFIX + 'head' }, addMonths(range)),
        create('div', {
            class: PREFIX + 'body',
            style: {
                height: tasks.height * TASK_HEIGHT + 'px'
            },
            event: {
                click: (e) => {
                    e.stopPropagation();
                    select(false);
                }
            }
        }, [
            create('div', { class: PREFIX + 'days' }, addDays(range)),
            create('div', { class: PREFIX + 'tasks' }, tasks.frag)
        ])
    ]);

    select(false);
    return true;
}

const addDays = loopRange((day, frag, data) => {
    let text = day.getDate();
    if (data.range.total < 14) {
        text += ' (' + WEEKDAYS[day.getDay()] + ')';
    }
    frag.appendChild(
        create('div', { class: dayClass(day) },
            create('span', {
                class: PREFIX + 'day-head',
                text
            })
        )
    );
}, fragment());

const addMonths = loopRange((day, frag, data) => {
    if (typeof data.index === 'undefined') {
        data.index =  0;
        data.prev = -1;
        data.left = 0;
    }
    let last = data.index === data.range.total-1,
        current = day.getMonth();

    if (current != data.prev && data.index > 0 || last) {
        let width = data.index - data.left,
            month = data.prev,
            year = day.getFullYear();

        if (month === -1) {
            month = current;
        }
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
                    width: width / data.range.total * 100 + '%'
                }
            })
        );
        data.left = data.index;
    }    
    data.prev = current;
    data.index += 1;
},  fragment());

/* ---------------------------------------- */

function getTasks(range, data) {
    let dataLength = data.length,
        rangeTotal = range.total,
        rangeRoot = +range.min,
        frag = fragment(),
        tasks = [],
        maxTop = 0;

    forEach(data, (i, group) => {
        let taskColor = getColor(i),
            entryColor = getColor(i, .5);

        forEach(group.terms, (j, task) => {
            let isOneDay = !isArray(task.date),
                start = isOneDay ? +task.date : +task.date[0],
                end = isOneDay ? start : +task.date[1],
                left = (start - rangeRoot) / DAY_MS,
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
                        left: left / rangeTotal * 100 + '%',
                        width: width / rangeTotal * 100 + '%',
                        height: TASK_HEIGHT + 'px'
                    },
                    event: {
                        mouseenter: () => hover(task.entry, entryColor),
                        mouseleave: () => hover(false),
                        click: function(e) {
                            e.stopPropagation();
                            select({
                                task: this,
                                entry: task.entry,
                                color: entryColor
                            });
                        }
                    }
                }, 
                    create('div', {
                        class: PREFIX + 'task-bar',
                        style: {
                            backgroundColor: taskColor
                        }
                    })
                )
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