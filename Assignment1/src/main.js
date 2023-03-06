import Eval from './evaluate.js';
import { useScreen, clearScreen, removeElement, useOperator, showResult } from './hooks.js';
import { KEYS, SYMBOL_TABLE } from './constants.js';
import { getLastValidUnit, validateInputForNumbers, validateInputForOperators } from './validation.js';

export function keyPressListener(event) {
    const key = event.key;
    function fakeThis(val = key) {
        return {
            getAttribute() {
                return val;
            }
        };
    }

    if (/\d|\./.test(key) || key === '(' || key === ')')
        valuesListener.call(fakeThis());
    else if (Object.keys(KEYS.operators).includes(key))
        operatorsListener.call(fakeThis(KEYS.operators[key]));
    else if (Object.keys(KEYS.operations).includes(key))
        operationsListener.call(fakeThis(KEYS.operations[key]));
}

export function valuesListener() {
    const val = this.getAttribute('data-value');
    const input = document.getElementById('input').value;

    if (val === ')') useScreen(val);
    else if (validateInputForNumbers(input))
        if (isNaN(val))
            if (val === 'pi') useScreen(Math.PI.toFixed(2));
            else if (val === 'e') useScreen(Math.E.toFixed(2));
            else useScreen(val);
        else
            useScreen(val);
}

export function operationsListener() {
    const symbol = this.getAttribute('data-symbol');
    switch (symbol) {
        case 'clear':
            clearScreen();
            break;
        case 'remove':
            removeElement();
            break;
        case 'eq':
            showResult(Eval(document.getElementById('input').value));
            break;
        case 'mc':
            memoryClear();
            break;
        case 'mr':
            memoryRead();
            break;
        case 'mp':
            memoryAdd(Eval(document.getElementById('input').value));
            break;
        case 'mm':
            memorySub(Eval(document.getElementById('input').value));
            break;
        case 'ms':
            memoryStore(Eval(document.getElementById('input').value));
            break;
    }
}

export function operatorsListener() {
    const symbol = this.getAttribute('data-symbol');
    const input = document.getElementById('input').value;

    if (validateInputForOperators(input)) {
        useScreen(SYMBOL_TABLE[symbol]);
    }
}

export function specialOperatorsListener() {
    const input = document.getElementById('input').value;
    const symbol = this.getAttribute('data-symbol');

    if (!Object.keys(SYMBOL_TABLE).includes(symbol)) return;

    if (this.getAttributeNames().includes('data-last')) {
        if (!validateInputForOperators(input)) return;
        const validUnit = getLastValidUnit(input);
        const operation = SYMBOL_TABLE[symbol].replace('#', validUnit.value);
        useOperator(validUnit.index, operation);
    } else {
        const operation = SYMBOL_TABLE[symbol];
        useScreen(operation);
    }
}

export function toggleFunction() {
    const temp = {
        'gen': 'hyp',
        'hyp': 'gen'
    };
    const identifier = this.getAttribute('id').substr(0, 3);
    const status = this.getAttribute('data-status');

    function resetOtherToggle(identifier) {
        const elem = document.getElementById(`${identifier}ToggleButton`);
        elem.setAttribute('data-status', 'off');
        elem.style.backgroundColor = '#EFEFEF';
        document.querySelectorAll(`.${identifier}-toggle-on`).forEach(elem => { elem.style.display = 'none'; });
        if (identifier === 'gen') {
            document.querySelectorAll(`.${identifier}-toggle-off`).forEach(elem => { elem.style.display = 'block'; });
        }
    }

    if (Object.keys(temp).includes(identifier)) {
        resetOtherToggle(temp[identifier]);
        this.setAttribute('data-status', status === 'on' ? 'off' : 'on');
        this.style.backgroundColor = status === 'on' ? '#EFEFEF' : 'cornflowerblue';
        let onSelector = `.${identifier}-toggle-${status === 'on' ? 'off' : 'on'}`;
        let offSelector = `.${identifier}-toggle-${status}`;
        if (identifier === 'hyp' && status === 'on')
            onSelector += `.${temp[identifier]}-toggle-off`;

        document.querySelectorAll(onSelector).forEach(elem => { elem.style.display = 'block'; });
        document.querySelectorAll(offSelector).forEach(elem => { elem.style.display = 'none'; });
    }
}