import { forEach, isArray } from 'lodash';
import { create } from './utils/dom.js';
import { getColor } from './colors.js';
import { select, hover } from './select.js';
import {
    PREFIX,
    DAY_MS,
    TASK_HEIGHT
} from './constants.js';

export function getTasks(range, data) {
    let dataLength = data.length,
        rangeLength = range.length,
        rangeRoot = +range.min,
        frag = document.createDocumentFragment(),
        tasks = [],
        maxTop = 0;

    forEach(data, (group, i) => {
        let taskColor = getColor(i),
            entryColor = getColor(i, .5);

        forEach(group.terms, (task, j) => {
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
                        left: left / rangeLength * 100 + '%',
                        width: width / rangeLength * 100 + '%',
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