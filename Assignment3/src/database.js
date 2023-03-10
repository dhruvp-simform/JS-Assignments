const CRUD_OPERATIONS_DATA = 'crud-operations-data';

export function initLocalStorage() {
    localStorage.getItem(CRUD_OPERATIONS_DATA) ?? localStorage.setItem(CRUD_OPERATIONS_DATA, '[]');
}

function getData() {
    return JSON.parse(localStorage.getItem(CRUD_OPERATIONS_DATA));
}

function saveData(data) {
    localStorage.setItem(CRUD_OPERATIONS_DATA, JSON.stringify(data));
}

export function addProduct(product) {
    const data = getData();
    data.push(product);
    saveData(data);
}

export function removeProduct(id) {
    let data = getData();
    data = data.filter(product => product.id !== id);
    saveData(data);
}

export function updateProduct(id, product) {
    const data = getData();
    const index = data.findIndexOf(product => product.id === id);
    data[index] = {
        ...data[index],
        ...product
    };
    saveData(data);
}

export function getProductById(id) {
    const data = getData();
    return data.find(product => product.id === id);
}

export function getAllProducts() {
    return getData();
}