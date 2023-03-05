import {
    valuesListener,
    operationsListener,
    operatorsListener,
    specialOperatorsListener,
    toggleFunction,
    keyPressListener
} from "./src/main.js";

document.querySelectorAll('.values').forEach(elem => {
    elem.addEventListener('click', valuesListener);
});

document.querySelectorAll('.operations').forEach(elem => {
    elem.addEventListener('click', operationsListener);
});

document.querySelectorAll('.operators').forEach(elem => {
    elem.addEventListener('click', operatorsListener);
});

document.querySelectorAll('.special-operators').forEach(elem => {
    elem.addEventListener('click', specialOperatorsListener);
});

document.querySelectorAll('.toggle-buttons').forEach(elem => {
    elem.addEventListener('click', toggleFunction);
});

document.querySelector('body').addEventListener('keydown', keyPressListener);