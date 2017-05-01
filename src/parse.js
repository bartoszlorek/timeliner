import { forEach } from './utils.js';

const CARD_SELECTOR = '.todo-taskboard-card:not(.todo-taskboard-card-completed)';
const TODO_SELECTOR = '.todo-checklist-item:not(.todo-hidden)';
const BUCKET_SELECTOR = '.todo-taskboard-card-bucketName';
const TOPBAR_SELECTOR = '.todo-taskboard-card-topBar';

// dd.mm
// dd.mm.yyyy
// dd.mm-dd.mm
// dd.mm-dd.mm.yyyy
// dd.mm.yyyy-dd.mm.yyyy
const DATE_REGEX = /^(\d{1,2})\.?(\d{2})?\.?(\d{4})?\s*\-?\s*(\d{1,2})?\.?(\d{2})?\.?(\d{4})?/;
const YEAR = new Date().getFullYear();

export default function(content) {
    let cards = content.querySelectorAll(CARD_SELECTOR),
        result = [],
        data;
    forEach(cards, (i, card) => {
        data = cardData(card);
        if (data !== false) {
            result.push(data);
        }
    });
    return result;
}

function cardData(card) {
    let topBar = card.querySelector(TOPBAR_SELECTOR);
    if (topBar !== null) {
        let todos = todosTerms(cardTodos(topBar));
        if (todos.length) {
            return {
                bucket: topBar
                    .querySelector(BUCKET_SELECTOR)
                    .textContent,
                terms: todos
            }
        } 
    }
    return false;
}

function cardTodos(card) {
    let items = card.querySelectorAll(TODO_SELECTOR),
        result = [];
    forEach(items, (i, item) => {
        result.push({
            text: item
                .children[1]
                .textContent,
            item
        });
    });
    return result;
}

function todosTerms(todos) {
    let result = [],    
        date;
    forEach(todos, (i, todo) => {
        if (date = parseDate(todo.text)) {
            result.push({
                item: todo.item,
                date 
            });
        }
    });
    return result;
}

function parseDate(string) {
    // [full, dd, mm, yyyy, ddd, mm, yyyy]
    let match = DATE_REGEX.exec(string);
    if (match === null) {
        return false;
    }
    if (!match[4]) {
        match[3] = match[3] || YEAR;
        return newDate([match[1], match[2], match[3]]);

    } else {
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