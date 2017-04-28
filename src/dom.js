export {
    create,
    hasClass
}

function hasClass(element, value) {
    return element.className.indexOf(value) > -1;
}

function create(tagName, attrs) {
    var element = document.createElement(tagName),
        value;

    for (var prop in attrs) {
        value = attrs[prop];
        if ( prop === 'text') {
            element.innerHTML = value;
        } else {
            element.setAttribute(prop, value);
        }
    }
    return element;
}