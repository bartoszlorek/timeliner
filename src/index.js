import { u } from 'umbrellajs';
import { extend } from './utils/uplug.js';
import { create } from './utils/dom.js';
import render from './render.js';
import parse from './parse.js';
import {
    PREFIX,
    CONTENT_SELECTOR
} from './constants.js';

extend(u);
const content = u(CONTENT_SELECTOR);
const track = create('div', {
    class: PREFIX + 'track'
});

content.before(
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
    ])
);

function refresh() {
    render(
        u(track),
        parse(content)
    );
}

setTimeout(refresh, 2000);