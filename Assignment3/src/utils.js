const DEFAULT_VALIDATION_DELAY = 1000;

export function debounce(validationFunction, delay = DEFAULT_VALIDATION_DELAY) {
    let timer;

    return function () {
        clearTimeout(timer);
        timer = setTimeout(validationFunction.bind(this), delay);
    };
}

export async function getBlob(file) {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = function (e) {
            resolve(e.target.result);
        };
        reader.readAsDataURL(file);
    });
}