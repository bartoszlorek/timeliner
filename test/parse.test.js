import { newDate, parseDate, cardDueDate, validTodos, groupData } from '../src/parse.js';
import { create } from '../src/utils/dom.js';
import { u } from 'umbrellajs';

const date = new Date(2017, 4, 4, 0, 0, 0, 0);
const date2 = new Date(2017, 4, 6, 0, 0, 0, 0);

const falsy = [
    null,
    true,
    'text',
    [0, 1],
    [],
    {},
    10
];

const column = u(create('div', {
    class: 'column'
},
    create('div', {
        class: 'title',
        text: 'Title'
    })
));

const card = u(create('div', {
    class: 'todo-taskboard-card'
},
    create('div', {
        class: 'todo-taskboard-card-dueDate',
        title: '2017-05-04'
    })
));

const todo = u(create('div', {
    class: 'todo-checklist-item',
    text: '4.05.2017 - description'
}));

card.append(todo);
column.append(card);

/* ---------------------------------------- */

describe('newDate', function() {

    it('returns false', function() {
        falsy.forEach(value =>
            expect(newDate(value)).toBe(false))
    })
    it('returns date', function() {
        [
            '2017-05-04',
            [2017, 5, 4],
            [4, 5, 2017]
        ]
        .forEach(value =>
            expect(+newDate(value)).toBe(+date))
    })

})

describe('parseDate', function() {

    it('returns false', function() {
        [
            '10-12',
            '10',
            '10.',
            '10.13',
            '10:30',
            '- text'
        ]
        .concat(falsy).forEach(value =>
            expect(parseDate(value)).toBe(false))
    })
    it('returns single date', function() {
        [
            '4.05 text',
            '4.05.2017 text',
            '04.05.2017 text'
        ]
        .forEach(value =>
            expect(+parseDate(value)).toBe(+date))
    })
    it('returns period (array)', function() {
        [
            '4-6.05 text',
            '4.05-6.05.2017 text',
            '4.05  -  6.05.2017 - text',
            '04.05.2017-06.05.2017 text'
        ]
        .forEach(value =>
            expect(+parseDate(value)[1]).toBe(+date2))
    })
})

describe('cardDueDate', function() {

    it('returns false', function() {
        falsy.forEach(value =>
            expect(cardDueDate(value)).toBe(false))
    })
    it('returns date', function() {
        expect(+cardDueDate(card)).toBe(+date);
    })

})

describe('validTodos', function() {

    it('returns false', function() {
        falsy.forEach(value =>
            expect(validTodos(value)).toBe(false))
    })
    it('returns array containing todos', function() {
        expect(validTodos(card)).toEqual([
            {
                entry: todo,
                date
            }
        ]);
    })

})

describe('groupData', function() {

    it('returns false', function() {
        falsy.forEach(value =>
            expect(groupData(value)).toBe(false))
    })
    it('returns data (object)', function() {
        expect(groupData(column)).toEqual({
            title: 'Title',
            terms: expect.any(Array)
        });
    })

})