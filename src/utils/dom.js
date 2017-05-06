import { forEach, isArray, isElement } from 'lodash';
import { u } from 'umbrellajs';

export {
    create
}

const arraySlice = Array.prototype.slice;
const SCROLLTO_MARGIN = 32;

function create(tagName, attributes, children) {
    let element = document.createElement(tagName);
    
    forEach(attributes, (value, prop) => {
        if (prop === 'text') {
            element.textContent = value;
        }
        else if (prop === 'style') {
            forEach(value, (valueStyle, propStyle) => {
                element.style[propStyle] = valueStyle;
            });
        }
        else if (prop === 'event') {
            forEach(value, (valueEvent, propEvent) => {
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

function appends(element, children) {
    let frag;
    if (!isElement(element)) {
        return element;
    }
    if (isArray(children)) {
        frag = document.createDocumentFragment();
        forEach(children, (value, i) => {
            frag.appendChild(value);
        });
    }
    element.appendChild(frag || children);
    return element;
}