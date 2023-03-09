import { pageStates } from './pageState.js';

const components = document.querySelectorAll('.components');
let currentPageState = null;

export function navigate(id = 'home') {
    currentPageState && currentPageState();
    currentPageState = pageStates[id]();
    components.forEach(component => {
        history.replaceState({}, document.title, `/${id}`);
        component.style.display = component.getAttribute('id') === id ? 'block' : 'none';
    });
}
