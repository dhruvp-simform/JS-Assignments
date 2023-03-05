import { SYMBOL_TABLE } from './constants.js';

function parseExpression(expression) {
    const parserRegex = /(\d+(\.\d+)?)|\(|\)|(\+|\-|\*|\/|\^)/g;
    const iterator = expression.matchAll(parserRegex);

    const parsedExpression = [];
    for (const item of iterator) { parsedExpression.push(item[0]); }

    return parsedExpression;
}

function getPrecedence(operator) {
    switch (operator) {
        case SYMBOL_TABLE['add']:
        case SYMBOL_TABLE['sub']:
            return 0;
        case SYMBOL_TABLE['mul']:
        case SYMBOL_TABLE['div']:
            return 1;
        case SYMBOL_TABLE['pow']:
            return 2;
        default:
            return -1;
    }
}

function infixToPostfix(expression) {
    const operatorsStack = [];
    let result = [];
    expression = parseExpression(expression);

    function operatorsStackPeek() {
        return operatorsStack[operatorsStack.length - 1];
    }

    expression.forEach(item => {
        if (isNaN(item)) {
            if (item === '(')  // Left Parenthesis
                operatorsStack.push(item);
            else if (item === ')') {   // Right Parenthesis
                while (operatorsStackPeek() !== '(')
                    result.push(operatorsStack.pop());

                operatorsStack.pop();   // To remove '(' from operatorsStack
            } else {     // Operator
                if (!result.length) result.push('0');
                if (!operatorsStack.length) operatorsStack.push(item);
                else {
                    while (getPrecedence(item) <= getPrecedence(operatorsStackPeek()))
                        result.push(operatorsStack.pop());
                    operatorsStack.push(item);
                }
            }
        } else
            result.push(item);
    });

    while (operatorsStack.length) {
        result.push(operatorsStack.pop());
    }

    return result;
}

function postfixEvaluation(expression) {
    const numbersStack = [];

    function evaluate(operator) {
        let result = 0;
        const n2 = parseFloat(numbersStack.pop());
        const n1 = parseFloat(numbersStack.pop());

        switch (operator) {
            case SYMBOL_TABLE['add']:
                result = n1 + n2;
                break;

            case SYMBOL_TABLE['sub']:
                result = n1 - n2;
                break;

            case SYMBOL_TABLE['mul']:
                result = n1 * n2;
                break;

            case SYMBOL_TABLE['div']:
                result = n1 / n2;
                break;

            case SYMBOL_TABLE['pow']:
                result = n1 ** n2;
                break;

            default:
                result = NaN;
                break;
        }

        numbersStack.push(result.toString());
    }

    expression.forEach(item => {
        if (isNaN(item)) evaluate(item);
        else numbersStack.push(item);
    });

    return numbersStack[0];
}

export default function evaluate(expression) {
    const postfixExpression = infixToPostfix(expression);
    const result = postfixEvaluation(postfixExpression);
    return result;
}