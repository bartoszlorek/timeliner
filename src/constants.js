export const PREFIX = 'timeliner-';

export const CONTENT_SELECTOR = '#tasks-content-pane';
export const CONTENT_SCROLL_SELECTOR = CONTENT_SELECTOR + ' .scroll';

export const GROUP_SELECTOR = '.column';
export const TITLE_SELECTOR = '.title';
export const CARD_SELECTOR = '.todo-taskboard-card:not(.todo-taskboard-card-completed)';
export const CARD_TITLE_SELECTOR = '.todo-taskboard-card-title';
export const TODO_SELECTOR = '.todo-checklist-item:not(.todo-hidden)';
export const DATE_SELECTOR = '.todo-taskboard-card-dueDate';

export const SELECT_CLASS = PREFIX + 'task-select';

export const DATE_REGEX = /^(\d{1,2})\.?(\d{2})?\.?(\d{4})?\s*\-?\s*(\d{1,2})?\.?(\d{2})?\.?(\d{4})?/;
export const YEAR = new Date().getFullYear();
export const DAY_MS = 24 * 60 * 60 * 1000;
export const TODAY = new Date();
TODAY.setHours(0,0,0,0);

export const MONTHS = [ 'styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec',
     'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień' ];
export const WEEKDAYS = [ 'niedz', 'pon', 'wt', 'śr', 'czw', 'pt', 'sob' ];
export const TASK_HEIGHT = 12;