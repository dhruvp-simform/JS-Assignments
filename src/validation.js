export function validateInputForNumbers(input) {
    const numbersInputValidationRegex = /^(.(?!\)$))+$/g;
    return numbersInputValidationRegex.test(input);
}

export function validateInputForOperators(input) {
    const operatorsValidationRegex = /((\((\d+(\.\d+)?)\)|(?<!\()(\d+(\.\d+)?))|((\||\⎡|\⎣)[^\+\-\*\^]+(\||\⎤|\⎦))|((?<!(\blog\b|\bln\b|\bsin\b|\bcos\b|\btan\b|\bcsc\b|\bsec\b|\bcot\b|\basin\b|\bacos\b|\batan\b|\bacsc\b|\basec\b|\bacot\b|\bsinh\b|\bcosh\b|\btanh\b|\bcsch\b|\bsech\b|\bcoth\b|√|∛)\()(\blog\b|\bln\b|\bsin\b|\bcos\b|\btan\b|\bcsc\b|\bsec\b|\bcot\b|\basin\b|\bacos\b|\batan\b|\bacsc\b|\basec\b|\bacot\b|\bsinh\b|\bcosh\b|\btanh\b|\bcsch\b|\bsech\b|\bcoth\b|√|∛)\((?!.+\).+(\+|\-|\*|\^|\/|\blog\b|\bln\b|\bsin\b|\bcos\b|\btan\b|\bcsc\b|\bsec\b|\bcot\b|\basin\b|\bacos\b|\batan\b|\bacsc\b|\basec\b|\bacot\b|\bsinh\b|\bcosh\b|\btanh\b|\bcsch\b|\bsech\b|\bcoth\b|√|∛)).+\)))\!?$/g;
    return operatorsValidationRegex.test(input);
}

export function getLastValidUnit(input) {
    const operatorsValidationRegex = /((\((\d+(\.\d+)?)\)|(?<!\()(\d+(\.\d+)?))|((\||\⎡|\⎣)[^\+\-\*\^]+(\||\⎤|\⎦))|((?<!(\blog\b|\bln\b|\bsin\b|\bcos\b|\btan\b|\bcsc\b|\bsec\b|\bcot\b|\basin\b|\bacos\b|\batan\b|\bacsc\b|\basec\b|\bacot\b|\bsinh\b|\bcosh\b|\btanh\b|\bcsch\b|\bsech\b|\bcoth\b|√|∛)\()(\blog\b|\bln\b|\bsin\b|\bcos\b|\btan\b|\bcsc\b|\bsec\b|\bcot\b|\basin\b|\bacos\b|\batan\b|\bacsc\b|\basec\b|\bacot\b|\bsinh\b|\bcosh\b|\btanh\b|\bcsch\b|\bsech\b|\bcoth\b|√|∛)\((?!.+\).+(\+|\-|\*|\^|\/|\blog\b|\bln\b|\bsin\b|\bcos\b|\btan\b|\bcsc\b|\bsec\b|\bcot\b|\basin\b|\bacos\b|\batan\b|\bacsc\b|\basec\b|\bacot\b|\bsinh\b|\bcosh\b|\btanh\b|\bcsch\b|\bsech\b|\bcoth\b|√|∛)).+\)))\!?$/g;

    const validUnits = operatorsValidationRegex.exec(input);

    return {
        value: validUnits[0],
        index: operatorsValidationRegex.lastIndex - validUnits[0].length
    };
}