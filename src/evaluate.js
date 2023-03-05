import { SYMBOL_TABLE } from './constants.js';

function factorial(number) {
    if (number === 0) return 1;
    return number * factorial(number - 1);
}

function evaluateSpecialOperation(operator, expression) {
    expression = evaluate(expression);

    switch (operator) {
        case SYMBOL_TABLE['log']:
            return Math.log10(expression);
        case SYMBOL_TABLE['ln']:
            return Math.log(expression);
        case SYMBOL_TABLE['sqrt']:
            return Math.sqrt(expression);
        case SYMBOL_TABLE['qrt']:
            return Math.cbrt(expression);
        case SYMBOL_TABLE['sin']:
            return Math.sin(expression * Math.PI / 180);
        case SYMBOL_TABLE['cos']:
            return Math.cos(expression * Math.PI / 180);
        case SYMBOL_TABLE['tan']:
            return Math.tan(expression * Math.PI / 180);
        case SYMBOL_TABLE['csc']:
            return 1 / Math.sin(expression * Math.PI / 180);
        case SYMBOL_TABLE['sec']:
            return 1 / Math.cos(expression * Math.PI / 180);
        case SYMBOL_TABLE['cot']:
            return 1 / Math.tan(expression * Math.PI / 180);
        case SYMBOL_TABLE['asin']:
            return Math.asin(expression * Math.PI / 180);
        case SYMBOL_TABLE['acos']:
            return Math.acos(expression * Math.PI / 180);
        case SYMBOL_TABLE['atan']:
            return Math.atan(expression * Math.PI / 180);
        case SYMBOL_TABLE['acsc']:
            return Math.asin(1 / expression * Math.PI / 180);
        case SYMBOL_TABLE['asec']:
            return Math.acos(1 / expression * Math.PI / 180);
        case SYMBOL_TABLE['acot']:
            return Math.atan(1 / expression * Math.PI / 180);
        case SYMBOL_TABLE['sinh']:
            return Math.sinh(expression * Math.PI / 180);
        case SYMBOL_TABLE['cosh']:
            return Math.cosh(expression * Math.PI / 180);
        case SYMBOL_TABLE['tanh']:
            return Math.tanh(expression * Math.PI / 180);
        case SYMBOL_TABLE['csch']:
            return 1 / Math.sinh(expression * Math.PI / 180);
        case SYMBOL_TABLE['sech']:
            return 1 / Math.cosh(expression * Math.PI / 180);
        case SYMBOL_TABLE['coth']:
            return 1 / Math.tanh(expression * Math.PI / 180);
        case '|':
            return Math.abs(expression);
        case '⎡':
            return Math.ceil(expression);
        case '⎣':
            return Math.floor(expression);
        case '!':
            return factorial(expression);
    }
}

function evaluateSpecialOperations(expression) {
    const specialOperatorsEvaluationRegex = /((?<operator1>(\blog\b|\bln\b|\bsin\b|\bcos\b|\btan\b|\bcsc\b|\bsec\b|\bcot\b|\basin\b|\bacos\b|\batan\b|\bacsc\b|\basec\b|\bacot\b|\bsinh\b|\bcosh\b|\btanh\b|\bcsch\b|\bsech\b|\bcoth\b|√|∛)\()(?<expression1>((\(\d+(\.\d+)?\)|\d+(\.\d+)?)(\+|\-|\^|\*|\/)?)+)\))|((?<operator2>(\||\⎡|\⎣))(?<expression2>(\d+(\.\d+)?))(\||\⎤|\⎦))|((?<expression3>\d+)(?<operator3>\!))/;
    let result;

    while ((result = specialOperatorsEvaluationRegex.exec(expression)) !== null) {
        const output = evaluateSpecialOperation(result.groups.operator1 ?? result.groups.operator2 ?? result.groups.operator3, result.groups.expression1 ?? result.groups.expression2 ?? result.groups.expression3);
        expression = expression.substr(0, result.index) + output.toString() + expression.substr(result.index + result[0].length);
    }

    return expression;
}

function parseExpression(expression) {
    expression = evaluateSpecialOperations(expression);
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