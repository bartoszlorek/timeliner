import { u } from 'umbrellajs';
import { query, scrollTo } from './utils/dom.js';

export {
    hover,
    select
}

const PREFIX = 'timeliner-';
const SELECT_CLASS = PREFIX + 'task-select';
const FREEZE_CLASS = PREFIX + 'task-freeze';
const CARD_CLASS = 'todo-taskboard-card';
const CONTENT_SELECTOR = '#tasks-content-pane .scroll';

let inSelect = null,
    inHover = null,
    content = null;

function hover(entry, color, force) {
    if (!force && (inHover === entry || inSelect !== null)) {
        return;
    }
    if (inHover) {
        inHover.style.backgroundColor = '';
        inHover.style.boxShadow = '';
    }
    if (entry && color) {
        let prop, value;

        if (u(entry).hasClass(CARD_CLASS)) {
            prop = 'boxShadow';
            value = 'inset 0px 0px 0px 4px ' + color;
        }
        else {
            prop = 'backgroundColor';
            value = color;
        }
        if (content === null) {
            content = query(CONTENT_SELECTOR)[0] || null;
        }
        entry.style[prop] = value;
        scrollTo(content, entry);
    }
    inHover = entry || null;
}

function select(element) {
    if (element && inSelect && element.task === inSelect.task) {
        return;
    }
    if (inSelect) {
        u(inSelect.task)
            .removeClass(SELECT_CLASS).parent()
            .removeClass(FREEZE_CLASS);
    }
    if (element) {
        u(element.task)
            .addClass(SELECT_CLASS).parent()
            .addClass(FREEZE_CLASS);
        hover(element.entry, element.color, true);
    }
    else {
        hover(false, false, true);
    }
    inSelect = element || null;
}