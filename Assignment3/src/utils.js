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

export function getTableBody(products) {
    let tbody = '';
    products.forEach(product => {
        tbody += `
        <tr>
            <td>${product.id}</td>
            <td>${product.title}</td>
            <td>${product.desc}</td>
            <td>${product.price}</td>
            <td><img class="img-thumbnail" src="${product.image}" alt="${product.title}"/></td>
            <td><button class="btn btn-success editButton" data-id="${product.id}">Edit</button></td>
            <td><button class="btn btn-danger removeButton" data-id="${product.id}">Remove</button></td>
        </tr>
        `;
    });

    return tbody;
}