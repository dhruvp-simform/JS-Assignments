import { addProduct, updateProduct } from "./database.js";
import { navigate } from "./router.js";
import { titleValidation, descValidation, priceValidation, imageValidation } from './validation.js';

const DEFAULT_VALIDATION_DELAY = 1000;

function debounce(validationFunction, delay = DEFAULT_VALIDATION_DELAY) {
    let timer;

    return function () {
        clearTimeout(timer);
        timer = setTimeout(validationFunction.bind(this), delay);
    };
}

async function getBlob(file) {
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

    function titleInputEventListener() {
        debounceTitleValidation.call(this);
    }

    function descInputEventListener() {
        debounceDescValidation.call(this);
    }

    function priceInputEventListener() {
        debouncePriceValidation.call(this);
    }

    async function imageInputEventListener() {
        imageValidation.call(this);
        IMAGE_PREVIEW.src = IMAGE_INPUT.checkValidity() ? (
            (IMAGE_INPUT.files[0] && await getBlob(IMAGE_INPUT.files[0])) || product.image
        ) : '';

        IMAGE_PREVIEW.alt = TITLE_INPUT.value ?? 'Product';
    }

    PRODUCT_FORM.addEventListener('submit', productFormEventListener);
    TITLE_INPUT.addEventListener('input', titleInputEventListener);
    DESC_INPUT.addEventListener('input', descInputEventListener);
    PRICE_INPUT.addEventListener('input', priceInputEventListener);
    IMAGE_INPUT.addEventListener('input', imageInputEventListener);

    return [PRODUCT_FORM, () => {
        PRODUCT_FORM.reset();
        IMAGE_PREVIEW.src = '';
        IMAGE_PREVIEW.alt = '';
        PRODUCT_FORM.removeEventListener('submit', productFormEventListener);
        TITLE_INPUT.removeEventListener('input', titleInputEventListener);
        DESC_INPUT.removeEventListener('input', descInputEventListener);
        PRICE_INPUT.removeEventListener('input', priceInputEventListener);
        IMAGE_INPUT.removeEventListener('input', imageInputEventListener);
        document.querySelector('#components').appendChild(PRODUCT_FORM);
    }];
}