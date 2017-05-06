import { create } from './utils/dom.js';
import { getRange, loopRange } from './range.js';
import { getTasks } from './tasks.js';
import { select } from './select.js';
import {
    PREFIX,
    MONTHS,
    WEEKDAYS,
    DAY_MS,
    TODAY,
    TASK_HEIGHT
} from './constants.js';

export default function(container, data) {
    if (!data) {
        return false;
    }
    let range = getRange(data),
        tasks;
        
    if (range.length <= 2) {
        return;
    }
    tasks = getTasks(range, data);
    
    container
        .empty()
        .appends(
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
        );

    select(false);
    return true;
}

const addMonths = loopRange((day, frag, data) => {
    if (typeof data.index === 'undefined') {
        data.index =  0;
        data.prev = -1;
        data.left = 0;
    }
    let last = data.index === data.range.length-1,
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
                    width: width / data.range.length * 100 + '%'
                }
            })
        );
        data.left = data.index;
    }    
    data.prev = current;
    data.index += 1;
},  fragment());

const addDays = loopRange((day, frag, data) => {
    let text = day.getDate();
    if (data.range.length < 14) {
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