import { getTableBody, renderProductForm } from './utils.js';
import { getProductById, removeProduct } from './database.js';
import { getAllProducts } from './database.js';
import { navigate } from './router.js';

export const pageStates = {
    'home': homeInitState,
    'add': addProductInitState,
    'edit': editProductInitState
};

function homeInitState() {
    const ERROR_MESSAGE = document.querySelector('#errorMessage');
    const PRODUCT_TABLE = document.querySelector('#productsTable');
    const products = getAllProducts();

    ERROR_MESSAGE.style.display = products?.length ? 'none' : 'block';
    PRODUCT_TABLE.style.display = products?.length ? 'block' : 'none';

    PRODUCT_TABLE.querySelector('tbody').innerHTML = getTableBody(products);

    function editProductListener() {
        const productId = this.getAttribute('data-id');
        navigate('edit', productId);
    }

    function removeProductListener() {
        const productId = this.getAttribute('data-id');
        removeProduct(productId);
        navigate('home');
    }

    const EDIT_BUTTONS = document.querySelectorAll('.editButton');
    const REMOVE_BUTTONS = document.querySelectorAll('.removeButton');

    EDIT_BUTTONS.forEach(elem => {
        elem.addEventListener('click', editProductListener);
    });

    REMOVE_BUTTONS.forEach(elem => {
        elem.addEventListener('click', removeProductListener);
    });

    return () => {
        EDIT_BUTTONS.forEach(elem => {
            elem.removeEventListener('click', editProductListener);
        });
        REMOVE_BUTTONS.forEach(elem => {
            elem.removeEventListener('click', removeProductListener);
        });
    };
}

function addProductInitState() {
    const [productForm, destroyProductForm] = renderProductForm();
    document.querySelector('.page#add').appendChild(productForm);

    return () => {
        destroyProductForm();
    };
}

function editProductInitState(id) {
    const product = getProductById(id);
    const [productForm, destroyProductForm] = renderProductForm(product);
    document.querySelector('.page#edit').appendChild(productForm);

    return () => {
        destroyProductForm();
    };
}
