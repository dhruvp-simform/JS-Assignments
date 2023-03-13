import { pageStates } from './pageState.js';

const pages = document.querySelectorAll('.page');
let currentPageState = null;

// Actual Router that enables Client Side Routing
export function navigate(id = 'home', ...args) {
    currentPageState && currentPageState();
    currentPageState = pageStates[id](...args);
    pages.forEach(page => {
        history.replaceState({}, document.title, `/${id}`);
        page.style.display = page.getAttribute('id') === id ? 'block' : 'none';
    });
}