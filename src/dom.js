import { forEach, isArray } from './utils.js';

export {
    create,
    hasClass,
    empty
}

function hasClass(element, value) {
    return element.className.indexOf(value) > -1;
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
        else {
            element.setAttribute(prop, value);
        }
    });

    if (typeof children !== 'undefined') {
        if (isArray(children)) {
            forEach(children, (i, value) => {
                element.appendChild(value);
            });
        } else {
            element.appendChild(children);
        }
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