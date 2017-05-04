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

export default function(content) {
    let data;
    return content
        .find(GROUP_SELECTOR).nodes
        .reduce((arr, group) => {
            group = u(group);
            if (data = groupData(group)) {
                arr.push(data);
            }
            return arr;
        }, []);
}

function groupData(column) {
    let todos,
        date,
        result = column
            .find(CARD_SELECTOR).nodes
            .reduce((arr, card) => {
                card = u(card);
                todos = validTodos(card);
                if (todos.length) {
                    return arr.concat(todos);
                }
                if (date = cardDueDate(card)) {
                    arr.push({
                        entry: card,
                        date
                    });
                }
                return arr;
            }, []);

    if (result.length) {
        return {
            terms: result,
            title: column
                .find(TITLE_SELECTOR)
                .text()
        }
    }
}

function validTodos(card) {
    let date;
    return card
        .find(TODO_SELECTOR).nodes
        .reduce((arr, todo) => {
            todo = u(todo);
            if (date = parseDate(todo.text())) {
                arr.push({
                    entry: todo,
                    date
                });
            }
            return arr;
        }, []);
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
    let match = DATE_REGEX
        .exec(text
        .trim());

    if (match === null) {
        return false;
    }
    if (!match[4]) {
        match[3] = match[3] || YEAR;
        return newDate([match[1], match[2], match[3]]);
    }
    else {
        match[2] = match[2] || match[5];
        match[3] = match[3] || match[6] || YEAR;
        match[6] = match[6] || YEAR;
        let start = newDate([match[1], match[2], match[3]]),
            end = newDate([match[4], match[5], match[6]]);
        if (start && end) {
            return [start, end];
        }
    }
    return false;
}

function cardDueDate(card) {
    let date = card
        .find(DATE_SELECTOR)
        .attr('title');
    if (date) {
        return newDate(date
            .split('-')
            .reverse());
    }
    return false;
}

function newDate(array) {
    let day,
        month;
    if (array.indexOf(undefined) > -1) {
        return false;
    }
    day = parseInt(array[0], 10);
    month = parseInt(array[1], 10);
    if (day > 31 || month > 12) {
        return false;
    }
    return new Date(
        parseInt(array[2], 10),
        month - 1,
        day,
        0, 0, 0, 0
    );
}