import { forEach, isArray } from './utils.js';

export {
    create,
    appends,
    empty,
    hasClass
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
                element.addEventListener(propEvent, valueEvent);
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
    if (element && element.nodeType) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    } return element;
}

function appends(element, children) {
    let frag;
    
    if (isArray(children)) {
        frag = document.createDocumentFragment();
        forEach(children, (i, value) => {
            frag.appendChild(value);
        });
    }
    element.appendChild(frag || children);
    return element;
}

function hasClass(element, value) {
    return element.className.indexOf(value) > -1;
}