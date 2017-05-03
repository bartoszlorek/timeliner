import { u } from 'umbrellajs';
import { forEach, isArray, isElement } from './utils.js';

export {
    query,
    create,
    appends,
    empty,
    scrollTo
}

const arraySlice = Array.prototype.slice;
const SCROLLTO_MARGIN = 32;

function query(selector, container) {
    if (typeof selector === 'string') {
        container = container || document;
        if (selector[0] === '#') {
            let element = container.querySelector(selector);
            if (element !== null) {
                return [element];
            }
        } else {
            return arraySlice.call(container
                 .querySelectorAll(selector));
        }
    }
    return [];
}

function create(tagName, attributes, children) {
    let element = document.createElement(tagName);
    
    forEach(attributes, (prop, value) => {
        if (prop === 'text') {
            element.textContent = value;
        }
        else if (prop === 'style') {
            forEach(value, (propStyle, valueStyle) => {
                element.style[propStyle] = valueStyle;
            });
        }
        else if (prop === 'event') {
            forEach(value, (propEvent, valueEvent) => {
                element.addEventListener(propEvent,
                    valueEvent.bind(element));
            });
        }
        else {
            element.setAttribute(prop, value);
        }
    });

    if (typeof children !== 'undefined') {
        appends(element, children);
    }
    return element;
}

function empty(element) {
    if (isElement(element)) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }
    return element;
}

function appends(element, children) {
    let frag;
    if (!isElement(element)) {
        return element;
    }
    if (isArray(children)) {
        frag = document.createDocumentFragment();
        forEach(children, (i, value) => {
            frag.appendChild(value);
        });
    }
    element.appendChild(frag || children);
    return element;
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
        parent.scrollTop += top - parentSize.height/2 + elementSize.height/2;
    }
}