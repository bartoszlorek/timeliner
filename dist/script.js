/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.empty = exports.hasClass = exports.create = undefined;

var _utils = __webpack_require__(1);

exports.create = create;
exports.hasClass = hasClass;
exports.empty = empty;


function hasClass(element, value) {
    return element.className.indexOf(value) > -1;
}

function create(tagName, attributes, children) {
    var element = document.createElement(tagName);

    (0, _utils.forEach)(attributes, function (prop, value) {
        if (prop === 'text') {
            element.textContent = value;
        } else if (prop === 'style') {
            (0, _utils.forEach)(value, function (propStyle, valueStyle) {
                element.style[propStyle] = valueStyle;
            });
        } else {
            element.setAttribute(prop, value);
        }
    });

    if (typeof children !== 'undefined') {
        if ((0, _utils.isArray)(children)) {
            (0, _utils.forEach)(children, function (i, value) {
                element.appendChild(value);
            });
        } else {
            element.appendChild(children);
        }
    }
    return element;
}

function empty(element) {
    if (!(element && element.nodeType)) {
        return false;
    }
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var isDate = isTypeofProto('Date');
var isArray = isTypeofProto('Array');

exports.isDate = isDate;
exports.isArray = isArray;
exports.isObject = isObject;
exports.forEach = forEach;


function isTypeofProto(name) {
    return function (value) {
        return Object.prototype.toString.call(value) === '[object ' + name + ']';
    };
}
function isObject(value) {
    return value !== null && isTypeofProto('Object')(value) && !isArray(value);
}
function forEach(list, callback) {
    var indexed = isArray(list),
        length = void 0,
        props = void 0,
        prop = void 0,
        i = 0;

    if (!(indexed || isObject(list))) {
        return list;
    }
    props = indexed ? list : Object.keys(list);
    length = props.length;
    while (i < length) {
        prop = indexed ? i : props[i];
        callback(prop, list[prop], list);
        i += 1;
    }
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (content, title) {
    if (typeof title !== 'string') {
        throw 'second parameter must be a string';
    }
    var cards = content.querySelectorAll(CARD_SELECTOR),
        length = cards.length,
        result = [],
        data = void 0,
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
};

var CARD_SELECTOR = '.todo-taskboard-card:not(.todo-taskboard-card-completed)';
var TODO_SELECTOR = '.todo-checklist-item:not(.todo-hidden)';
var YEAR = new Date().getFullYear();

var matchingTitle = void 0;

function cardData(card) {
    var topBar = card.querySelector('.todo-taskboard-card-topBar'),
        bucket = void 0,
        todos = void 0;

    if (topBar === null) {
        return false;
    }
    bucket = cardBucket(topBar.children[0]);
    todos = bucket && cardTodos(topBar.children[1]);
    if (todos !== false) {
        return {
            terms: todosTerms(todos),
            bucket: bucket
        };
    }
    return false;
}

function cardBucket(cardTitle) {
    var title = cardTitle.children[0].textContent;
    if (title.toLowerCase() === matchingTitle) {
        return cardTitle.children[1].textContent;
    }return false;
}

function cardTodos(cardMiddle) {
    var items = cardMiddle.querySelectorAll(TODO_SELECTOR),
        length = items.length,
        result = [],
        i = 0;

    while (i < length) {
        result.push(items[i].children[1].textContent);
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
            date: convertDate(todo.slice(0, index)),
            title: todo.slice(index + 1).replace(/^[\s-]+/gm, '')
        });
        i += 1;
    }
    return result;
}

// input [string]:
//    dd.mm
//    dd.mm-dd.mm
//    dd.mm.yyyy-dd.mm.yyyy
// output [Date]
function convertDate(date) {
    var part = void 0,
        right = void 0;

    if (date.indexOf('-') > -1) {
        part = date.split('-');
        right = part[1].split('.');

        if (right.length === 3 && part[0].split('.').length === 2) {
            part[0] = part[0] + '.' + right[2];
        }
        return [convertDate(part[0]), convertDate(part[1])];
    }
    part = date.split('.');
    if (part.length === 2) {
        part.push(YEAR);
    }
    return new Date(parseInt(part[2], 10), parseInt(part[1], 10) - 1, parseInt(part[0], 10), 0, 0, 0, 0);
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (container, data) {
    if (!data.length) {
        return false;
    }
    var range = getRange(data),
        board = (0, _dom.create)('div', { class: PREFIX + 'board' }, [(0, _dom.create)('div', { class: PREFIX + 'months' }, monthsIn(range)), (0, _dom.create)('div', { class: PREFIX + 'days' }, daysIn(range))]);

    (0, _dom.empty)(container);
    container.appendChild(board);
    console.log(range);
};

var _utils = __webpack_require__(1);

var _dom = __webpack_require__(0);

var PREFIX = 'timeliner-';
var DAY_MS = 24 * 60 * 60 * 1000;
var MONTHS = ['styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec', 'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień'];

var TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

var daysIn = inRange(function (day, frag) {
    frag.appendChild((0, _dom.create)('div', { class: dayClass(day) }, [(0, _dom.create)('span', {
        class: PREFIX + 'day-head',
        text: day.getDate()
    })]));
}, fragment());

var monthsIn = inRange(function (day, frag, data) {
    var last = data.index === data.range.count - 1,
        current = day.getMonth();

    if (current != data.prev && data.index > 0 || last) {
        var left = data.left,
            width = data.index - left,
            month = data.prev,
            year = day.getFullYear(),
            range = data.range.count;

        if (last) {
            width += 1;
        }
        if (!last && month === 11) {
            year -= 1;
        }
        frag.appendChild((0, _dom.create)('div', {
            class: PREFIX + 'month',
            text: MONTHS[month] + ' ' + year,
            style: {
                width: width / range * 100 + '%',
                left: left / range * 100 + '%'
            }
        }));
        data.left = data.index;
    }
    data.prev = current;
    data.index += 1;
}, fragment(), {
    index: 0,
    prev: -1,
    left: 0
});

/* ---------------------------------------- */

function getRange(data) {
    var length = data.length,
        minDate = void 0,
        maxDate = void 0,
        current = void 0,
        minCurr = void 0,
        maxCurr = void 0,
        i = 0;

    while (i < length) {
        current = data[i];

        if (current.hasOwnProperty('terms')) {
            var term = getRange(current.terms);
            minCurr = term.min;
            maxCurr = term.max;
        } else if (current.hasOwnProperty('date')) {
            var date = current.date;
            if ((0, _utils.isArray)(date)) {
                minCurr = date[0];
                maxCurr = date[1];
            } else {
                minCurr = date;
                maxCurr = date;
            }
        }
        if (minDate === undefined || +minCurr < +minDate) {
            minDate = minCurr;
        }
        if (maxDate === undefined || +maxCurr > +maxDate) {
            maxDate = maxCurr;
        }
        i += 1;
    }
    return {
        count: (+maxDate - +minDate) / DAY_MS + 1,
        min: minDate,
        max: maxDate
    };
}

function inRange(callback, store, data) {
    return function (range) {
        var day = new Date(range.min.getTime()),
            max = new Date(range.max.getTime());
        if (day > max) {
            return store;
        }
        data = data || {};
        data.range = range;
        while (day <= max) {
            callback(day, store, data);
            day.setDate(day.getDate() + 1);
        }
        return store;
    };
}

function dayClass(day) {
    var date = day.getDate(),
        week = day.getDay(),
        name = PREFIX + 'day';

    if (date === 1) {
        name += ' ' + PREFIX + 'first';
    }
    if (week === 0 || week === 6) {
        name += ' ' + PREFIX + 'weekend';
    }
    if (+day === +TODAY) {
        name += ' ' + PREFIX + 'today';
    }
    return name;
}

function fragment() {
    return document.createDocumentFragment();
}

function addBuckets() {}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _dom = __webpack_require__(0);

var _render = __webpack_require__(3);

var _render2 = _interopRequireDefault(_render);

var _parse = __webpack_require__(2);

var _parse2 = _interopRequireDefault(_parse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tasksContent = document.querySelector('#tasks-content-pane');

var tasksTimeline = (0, _dom.create)('div', {
    id: 'timeliner',
    class: 'timeliner-wrap',
    text: 'loading...'
});

tasksContent.parentElement.insertBefore(tasksTimeline, tasksContent);

function refresh() {
    (0, _render2.default)(tasksTimeline, (0, _parse2.default)(tasksContent, 'termin'));
}

setTimeout(refresh, 2000);

/***/ })
/******/ ]);