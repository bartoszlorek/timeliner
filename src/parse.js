import { forEach, indexOf } from './utils/utils.js';
import { query } from './utils/dom.js';

const GROUP_SELECTOR = '.column';
const TITLE_SELECTOR = '.title';
const CARD_SELECTOR = '.todo-taskboard-card:not(.todo-taskboard-card-completed)';
const CARD_TITLE_SELECTOR = '.todo-taskboard-card-title';
const TODO_SELECTOR = '.todo-checklist-item:not(.todo-hidden)';
const DATE_SELECTOR = '.todo-taskboard-card-dueDate';

const DATE_REGEX = /^(\d{1,2})\.?(\d{2})?\.?(\d{4})?\s*\-?\s*(\d{1,2})?\.?(\d{2})?\.?(\d{4})?/;
const YEAR = new Date().getFullYear();

export default function(content) {
    let groups = query(GROUP_SELECTOR, content),
        result = [],
        data;
    forEach(groups, (i, group) => {
        if (data = groupData(group)) {
            result.push(data);
        }
    });
    return result;
}

function groupData(column) {
    let cards = query(CARD_SELECTOR, column),
        title = query(TITLE_SELECTOR, column)[0].textContent,
        result = [],
        terms,
        date;
    forEach(cards, (i, card) => {
        terms = validTerms(query(TODO_SELECTOR, card));
        if (terms.length) {
            result = result.concat(terms);
        }
        else if (date = cardDueDate(card)) {
            result.push({
                entry: card,
                date
            });
        }
    });
    if (!result.length) {
        return false;
    }
    return {
        terms: result,
        title
    }
}

function validTerms(todos) {
    let result = [],  
        date;
    forEach(todos, (i, todo) => {
        date = parseDate(todo
            .children[1]
            .textContent);

        if (date) {
            result.push({
                entry: todo,
                date
            });
        }
    });
    return result;
}

// possible date format:
// dd.mm.yyyy-dd.mm.yyyy
// dd.mm-dd.mm.yyyy
// dd.mm-dd.mm
// dd.mm.yyyy
// dd.mm

// regex returns:
// [full, dd, mm, yyyy, ddd, mm, yyyy]

function parseDate(string) {
    let match = DATE_REGEX.exec(string);
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

function cardDueDate(card) {
    let date = query(DATE_SELECTOR, card)[0].title;
    if (!date) {
        return false;
    }
    date = date.split('-');
    return new Date(
        date[0],
        parseInt(date[1], 10) - 1,
        date[2],
        0, 0, 0, 0
    );
}