const result = document.getElementById('result');
const input = document.getElementById('input');

export function useScreen(val) {
    if (input.value === '0') {
        input.value = val;
    } else {
        input.value += val ?? 0;
    }
}

export function useOperator(index = 0, val) {
    input.value = input.value.slice(0, index) + val;
}

export function clearScreen() {
    input.value = '0';
    result.innerHTML = '0';
}

export function removeElement() {
    if (input.value.length === 1) input.value = 0;
    else input.value = input.value.slice(0, -1);
}

export function showResult(val) {
    result.innerHTML = val;
}