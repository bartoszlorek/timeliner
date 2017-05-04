import { u } from 'umbrellajs';
import { scrollTo } from './utils/dom.js';
import {
    CONTENT_SCROLL_SELECTOR,
    CARD_SELECTOR,
    SELECT_CLASS
} from './constants.js';

export {
    hover,
    select
}

let inSelect = null,
    inHover = null,
    content = null;

function hover(entry, color, force) {
    if (!force && (inHover === entry || inSelect !== null)) {
        return;
    }
    if (inHover && inHover.length) {
        inHover
            .css('backgroundColor', '')
            .css('boxShadow', '');
    }
    if (entry && entry.length && color) {
        let prop, value;

        if (u(entry).is(CARD_SELECTOR)) {
            prop = 'boxShadow';
            value = 'inset 0px 0px 0px 4px ' + color;
        }
        else {
            prop = 'backgroundColor';
            value = color;
        }
        if (content === null || !content.length) {
            content = u(CONTENT_SCROLL_SELECTOR);
        }
        scrollTo(content, entry
            .css(prop, value)
            .closest(CARD_SELECTOR));
    }
    inHover = entry || null;
}

function select(element) {
    if (element && inSelect && element.task === inSelect.task) {
        return;
    }
    if (inSelect) {
        u(inSelect.task).removeClass(SELECT_CLASS);
    }
    if (element) {
        u(element.task).addClass(SELECT_CLASS);
        hover(element.entry, element.color, true);
    }
    else {
        hover(false, false, true);
    }
    inSelect = element || null;
}