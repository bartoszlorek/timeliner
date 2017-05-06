import { u } from 'umbrellajs';
import {
    CONTENT_SCROLL_SELECTOR,
    CARD_SELECTOR,
    SELECT_CLASS
} from './constants.js';

const SCROLLTO_MARGIN = 32;

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
        if (content === null) {
            content = u(CONTENT_SCROLL_SELECTOR);
            content = content.length
                ? content.first()
                : null;
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

function scrollTo(parent, element) {
    if (!parent) {
        return;
    }
    let parentSize = u(parent).size(),
        elementSize = u(element).size(),
        left = elementSize.left - parentSize.left,
        right = elementSize.right - parentSize.right,
        top = elementSize.top - parentSize.top,
        bottom = elementSize.bottom - parentSize.bottom;

    if (left < 0) {
        parent.scrollLeft += left - SCROLLTO_MARGIN;
    }
    else if (right > 0) {
        parent.scrollLeft += right + SCROLLTO_MARGIN;
    }
    if (top < 0 || bottom > 0) {
        parent.scrollTop += top;
    }
}