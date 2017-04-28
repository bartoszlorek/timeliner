const CARD_SELECTOR = '.todo-taskboard-card:not(.todo-taskboard-card-completed)';
const TODO_SELECTOR = '.todo-checklist-item:not(.todo-hidden)';
const YEAR = new Date().getFullYear();

let matchingTitle;

export default function(content, title) {
    if (typeof title !== 'string') {
        throw 'second parameter must be a string';
    }
    let cards = content.querySelectorAll(CARD_SELECTOR),
        length = cards.length,
        result = [],
        data,
        i = 0;

    matchingTitle = title;
    while (i < length) {
        data = cardData(cards[i]);
        if (data !== false) {
            result.push(data);
        }
        i += 1;
    }
    return result;
}

function cardData(card) {
    let topBar = card.querySelector(
            '.todo-taskboard-card-topBar'),
        bucket,
        todos;
        
    if (topBar === null) {
        return false;
    }
    bucket = cardBucket(topBar.children[0]);
    todos = bucket && cardTodos(topBar.children[1]);
    if (todos !== false) {
        return {
            bucket: bucket,
            terms: todosTerms(todos)
        }
    }
    return false;
}

function cardBucket(cardTitle) {
    let title = cardTitle.children[0].textContent;
    if (title.toLowerCase() === matchingTitle) {
        return cardTitle.children[1].textContent;
    } return false;
}

function cardTodos(cardMiddle) {
    let items = cardMiddle.querySelectorAll(TODO_SELECTOR),
        length = items.length,
        result = [],
        i = 0;

    while (i < length) {
        result.push(items[i]
            .children[1]
            .textContent);
        i += 1;
    }
    return result;
}

function todosTerms(todos) {
    var length = todos.length,
        result = [],
        todo,
        index,
        i = 0;

    while (i < length) {
        todo = todos[i];
        index = todo.indexOf(' ');
        result.push({
            date: convertDate(todo
                .slice(0, index)),
            title: todo
                .slice(index + 1)
                .replace(/^[\s-]+/gm,'')
        });
        i += 1;
    }
    return result;
}

// input [string]:
// dd.mm
// dd.mm-dd.mm
// dd.mm.yyyy-dd.mm.yyyy

// output [string]:
// yyyy-mm-dd
function convertDate(date) {
    if (date.indexOf('-') > -1) {
        date = date.split('-');
        return [convertDate(date[0]),
                convertDate(date[1])];
    }
    date = date.split('.');
    if (date.length === 2) {
        date.push(YEAR);
    }
    return date
        .reverse()
        .join('-');
}