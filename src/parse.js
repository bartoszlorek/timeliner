import { isArray, isString, isNaN } from 'lodash';
import { u } from 'umbrellajs';

import {
    GROUP_SELECTOR,
    TITLE_SELECTOR,
    CARD_SELECTOR,
    CARD_TITLE_SELECTOR,
    TODO_SELECTOR,
    DATE_SELECTOR,
    DATE_REGEX,
    YEAR
} from './constants.js';

export {
    groupData,
    validTodos,
    cardDueDate,
    parseDate,
    newDate
}

export default function(content) {
    if (content instanceof u) {
        let result = content
            .find(GROUP_SELECTOR).nodes
            .map(group => groupData(u(group)))
            .filter(data => data !== false);

        if (result.length) {
            return result;
        }
    }
    return false;
}

function groupData(column) {
    if (column instanceof u) {
        let result = [],
            todos,
            date;

        column
            .find(CARD_SELECTOR)
            .each(card => {
                card = u(card);
                if (todos = validTodos(card)) {
                    result = result.concat(todos);
                }
                else if (date = cardDueDate(card)) {
                    result.push({
                        entry: card,
                        date
                    });
                }
            });
        if (result.length) {
            return {
                terms: result,
                title: column
                    .find(TITLE_SELECTOR)
                    .text()
            }
        }
    }
    return false;
}

function validTodos(card) {
    if (card instanceof u) {
        let todos = [],
            date;

        card
            .find(TODO_SELECTOR)
            .each(todo => {
                todo = u(todo);
                date = parseDate(todo
                    .text());

                if (date) {
                    todos.push({
                        entry: todo,
                        date
                    });
                }
            });
        if (todos.length) {
            return todos;
        }
    }
    return false;
}

function cardDueDate(card) {
    if (card instanceof u) {
        return newDate(card
            .find(DATE_SELECTOR)
            .attr('title'));
    }
    return false;
}

// possible date format:
// dd.mm.yyyy-dd.mm.yyyy
// dd.mm-dd.mm.yyyy
// dd.mm-dd.mm
// dd.mm.yyyy
// dd.mm

// regex returns:
// [full, dd, mm, yyyy, ddd, mm, yyyy]

function parseDate(text) {
    if (! isString(text)) {
        return false;
    }
    let match = DATE_REGEX
        .exec(text
        .trim());

    if (match !== null) {
        if (!match[4]) {
            match[3] = match[3] || YEAR;
            return newDate([ match[3], match[2], match[1] ]);
        }
        else {
            match[2] = match[2] || match[5];
            match[3] = match[3] || match[6] || YEAR;
            match[6] = match[6] || YEAR;
            let start = newDate([ match[3], match[2], match[1] ]),
                end = newDate([ match[6], match[5], match[4] ]); 
            if (start && end) {
                return [start, end];
            }
        }
    }
    return false;
}

function newDate(value) {
    if (isString(value)) {
        value =  value.split('-');
    }
    else if (!isArray(value)) {
        return false;
    }
    value = value
        .map(a =>  parseInt(a, 10))
        .filter(a => !isNaN(a) && a > 0);

    if (value.length === 3) {
        if (value[0] < 1970) {
            value = value.reverse();
        }
        let [ year, month, day ] = value;
        if (month <= 12 && day <= 31) {
            return new Date(
                year,
                month - 1,
                day,
                0, 0, 0, 0
            );
        }
    }
    return false;
}