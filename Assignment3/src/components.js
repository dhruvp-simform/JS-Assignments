import { navigate } from './router.js';
import { updateProduct, addProduct, removeProduct } from './database.js';
import { debounce, getTableBody, getBlob } from './utils.js';
import { titleValidation, descValidation, priceValidation, imageValidation } from './validation.js';

export function renderProductForm(product = null) {
    const PRODUCT_FORM = document.querySelector('#components #productform');
    const TITLE_INPUT = PRODUCT_FORM.elements.title;
    const DESC_INPUT = PRODUCT_FORM.elements.desc;
    const PRICE_INPUT = PRODUCT_FORM.elements.price;
    const IMAGE_INPUT = PRODUCT_FORM.elements.image;
    const IMAGE_PREVIEW = PRODUCT_FORM.children.imagePreview;
    const SUBMIT_INPUT = PRODUCT_FORM.elements.submit;

    if (product) {
        TITLE_INPUT.value = product.title;
        DESC_INPUT.value = product.desc;
        PRICE_INPUT.value = product.price;
        IMAGE_PREVIEW.src = product.image;
    }

    SUBMIT_INPUT.value = product ? 'Save changes' : 'Add Product';

    const debounceTitleValidation = debounce(titleValidation);
    const debounceDescValidation = debounce(descValidation);
    const debouncePriceValidation = debounce(priceValidation);

    async function productFormEventListener(e) {
        e.preventDefault();

        if (!product && !IMAGE_INPUT.files[0]) {
            IMAGE_INPUT.setCustomValidity('Product Image is required');
            IMAGE_INPUT.reportValidity();
        }

        const newProduct = {
            id: product?.id ?? (new Date()).getTime().toString(),
            title: TITLE_INPUT.value,
            desc: DESC_INPUT.value,
            price: PRICE_INPUT.value,
            image: (IMAGE_INPUT.files[0] && await getBlob(IMAGE_INPUT.files[0])) || product.image
        };

        product ? updateProduct(newProduct.id, newProduct) : addProduct(newProduct);
        navigate('home');
    }

    async function imageInputEventListener() {
        imageValidation.call(this);
        IMAGE_PREVIEW.src = IMAGE_INPUT.checkValidity() ? (
            (IMAGE_INPUT.files[0] && await getBlob(IMAGE_INPUT.files[0])) || product.image
        ) : '';

        IMAGE_PREVIEW.alt = TITLE_INPUT.value ?? 'Product';
    }

    PRODUCT_FORM.addEventListener('submit', productFormEventListener);
    TITLE_INPUT.addEventListener('input', debounceTitleValidation);
    DESC_INPUT.addEventListener('input', debounceDescValidation);
    PRICE_INPUT.addEventListener('input', debouncePriceValidation);
    IMAGE_INPUT.addEventListener('input', imageInputEventListener);

    return [PRODUCT_FORM, () => {
        PRODUCT_FORM.reset();
        IMAGE_PREVIEW.src = '';
        IMAGE_PREVIEW.alt = '';
        PRODUCT_FORM.removeEventListener('submit', productFormEventListener);
        TITLE_INPUT.removeEventListener('input', debounceTitleValidation);
        DESC_INPUT.removeEventListener('input', debounceDescValidation);
        PRICE_INPUT.removeEventListener('input', debouncePriceValidation);
        IMAGE_INPUT.removeEventListener('input', imageInputEventListener);
        document.querySelector('#components').appendChild(PRODUCT_FORM);
    }];
}

export function renderProductsTable(products) {
    const PRODUCTS_TABLE_BODY = document.querySelector('#productsTable tbody');
    PRODUCTS_TABLE_BODY.innerHTML = getTableBody(products);

    const EDIT_BUTTONS = PRODUCTS_TABLE_BODY.querySelectorAll('.editButton');
    const REMOVE_BUTTONS = PRODUCTS_TABLE_BODY.querySelectorAll('.removeButton');

    function editProductListener() {
        navigate('edit', this.getAttribute('data-id'));
    }

    function removeProductListener() {
        removeProduct(this.getAttribute('data-id'));
        navigate('home');
    }

    EDIT_BUTTONS.forEach(elem => { elem.addEventListener('click', editProductListener); });
    REMOVE_BUTTONS.forEach(elem => { elem.addEventListener('click', removeProductListener); });

    return () => {
        EDIT_BUTTONS.forEach(elem => { elem.removeEventListener('click', editProductListener); });
        REMOVE_BUTTONS.forEach(elem => { elem.removeEventListener('click', removeProductListener); });
    };
}

export function renderErrorMessage(message = null) {
    const ERROR_MESSAGE = document.querySelector('#errorMessage');
    const PRODUCTS_TABLE = document.querySelector('#productsTable');

    ERROR_MESSAGE.innerHTML = message ?? 'No Products !';

    ERROR_MESSAGE.style.display = 'block';
    PRODUCTS_TABLE.style.display = 'none';

    return () => {
        ERROR_MESSAGE.style.display = 'none';
        PRODUCTS_TABLE.style.display = 'block';
    };
}