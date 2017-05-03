const COLORS = [
    '#e0244d',
    '#ffc107',
    '#2196f3',
    '#88c242',
    '#a029b5',
    '#ff9800',
    '#00c4d6',
    '#673ab7',
    '#ff5722',
    '#cddc39',
    '#ed91c3',
    '#ffeb3b',
    '#009688',
    '#99542f',
    '#a38f84'
];
const length = COLORS.length;

export function getColor(index, value) {
    let color = COLORS[index % length];
    if (typeof value === 'number') {
        return brightness(color, value);
    }
    return color;
}

function brightness(hex, value) {
    let r, g, b;

    hex = hex.replace(/[^0-9a-f]/gi, '');
    value = Math.min(Math.max(-1, value), 1);

    if (hex.length === 3) {
        hex = hex.replace(/(.)/g, '$1$1');
    }
    r = parseInt(hex.substr(0, 2), 16);
    g = parseInt(hex.substr(2, 2), 16);
    b = parseInt(hex.substr(4, 2), 16);

    return '#'
        + component(brighter(r, value))
        + component(brighter(g, value))
        + component(brighter(b, value));
}

function component(color) {
    return ((0|(1<<8) + color).toString(16)).substr(1);
}

function brighter(color, value) {
    if (value === 0) {
        return color;
    }
    let operand = value > 0 ? 255-color : color;
    return color + Math.round(operand * value);
}