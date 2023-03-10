import { pageStates } from './pageState.js';

const pages = document.querySelectorAll('.page');
let currentPageState = null;

export function navigate(id = 'home', ...args) {
    currentPageState && currentPageState();
    currentPageState = pageStates[id](...args);
    pages.forEach(page => {
        history.replaceState({}, document.title, `/${id}`);
        page.style.display = page.getAttribute('id') === id ? 'block' : 'none';
    });
}