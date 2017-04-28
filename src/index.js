import parse from './parse.js';
import { create } from './dom.js';

const tasksContent = document.querySelector(
    '#tasks-content-pane');

const tasksTimeline = create('div', {
    id: 'plankton-timeline',
    text: '<h1>Hi there and greetings!</h1>'
});

tasksContent.parentElement.insertBefore(
    tasksTimeline,
    tasksContent
);

function refresh() {
    let terms = parse(tasksContent, 'termin');
    console.log(terms);
}

setTimeout(refresh, 2000);