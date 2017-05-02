import { forEach, isArray } from './utils.js';

export {
    query,
    create,
    appends,
    empty,
    hasClass,
    addClass,
    removeClass
}

const arraySlice = Array.prototype.slice;

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
    return element.className
        .split(' ')
        .indexOf(value) > -1;
}

function addClass(element, className) {
    if (!hasClass(element, className)) {
        element.className += ' ' + className;
    } return element;
}

function removeClass(element, className) {
    if (hasClass(element, className)) {
        let classes = element.className,
            regex = new RegExp(className +'\\s?');  
        classes = classes.replace(regex, '');
        if (classes[classes.length - 1] === ' ') {
            classes = classes.slice(0, -1);
        }
        element.className = classes;
   } return element;
}