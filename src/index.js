import { create } from './dom.js';
import render from './render.js';
import parse from './parse.js';

const tasksContent = document.querySelector(
    '#tasks-content-pane');

const tasksTimeline = create('div', {
    id: 'timeliner',
    class: 'timeliner-wrap',
    text: 'loading...'
});

tasksContent.parentElement.insertBefore(
    tasksTimeline,
    tasksContent
);

function refresh() {
    render(
        tasksTimeline,
        parse(tasksContent, 'termin')
    );
}

setTimeout(refresh, 2000);