import { addClass, removeClass } from './utils/dom.js';

export {
    hover,
    select
}

const PREFIX = 'timeliner-';
const SELECT_CLASS = PREFIX + 'task-select';
const FREEZE_CLASS = PREFIX + 'task-freeze';

let inSelect = null,
    inHover = null;

function hover(todo, color, force) {
    if (!force && (inHover === todo || inSelect !== null)) {
        return;
    }
    if (inHover) {
        inHover.style.backgroundColor = '';
    }
    if (todo) {
        todo.style.backgroundColor = color ? color : '';
        todo.scrollIntoView();
    }
    inHover = todo || null;
}

function select(element) {
    if (element && inSelect && element.task === inSelect.task) {
        return;
    }
    if (inSelect) {
        removeClass(inSelect.task, SELECT_CLASS);
        removeClass(inSelect.task.parentElement, FREEZE_CLASS);
    }
    if (element) {
        addClass(element.task, SELECT_CLASS);
        addClass(element.task.parentElement, FREEZE_CLASS);
        hover(element.todo, element.color, true);
    } else {
        hover(false, false, true);
    }
    inSelect = element || null;
}