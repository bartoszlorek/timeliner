import { create } from './dom.js';
import render from './render.js';
import parse from './parse.js';

const PREFIX = 'timeliner-';
const content = document.querySelector(
    '#tasks-content-pane');

const track = create('div', {
    class: PREFIX + 'track',
    text: 'ładowanie...'
});

content.parentElement.insertBefore(
    create('div', {
        id: 'timeliner',
        class: PREFIX + 'wrap'
    }, [
        create('div', {
            class: PREFIX + 'refresh',
            text: 'odśwież',
            event: {
                click: () => refresh()
            }
        }),
        create('div', {
            class: PREFIX + 'board'
        },  track)
    ]),
content);

function refresh() {
    render(
        track,
        parse(content)
    );
}

setTimeout(refresh, 2000);