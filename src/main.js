import Eval from './evaluate.js';
import { useScreen, clearScreen, removeElement, useOperator, showResult } from './hooks.js';
import { SYMBOL_TABLE } from './constants.js';
import { getLastValidUnit, validateInputForNumbers, validateInputForOperators } from './validation.js';

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
}