import { descValidation, imageValidation, priceValidation, titleValidation } from './validation.js';
import { debounce, getBlob, getTableBody } from './utils.js';
import { addProduct } from './database.js';
import { navigate } from './router.js';
import { getAllProducts } from './database.js';

export const pageStates = {
    'home': homeInitState,
    'add': addProductInitState
};

function homeInitState() {
    const ERROR_MESSAGE = document.querySelector('#errorMessage');
    const PRODUCT_TABLE = document.querySelector('#productsTable');
    const products = getAllProducts();

    ERROR_MESSAGE.style.display = products?.length ? 'none' : 'block';
    PRODUCT_TABLE.style.display = products?.length ? 'block' : 'none';

    PRODUCT_TABLE.querySelector('tbody').innerHTML = getTableBody(products);

    return () => {
        console.log('Home Page Destroy');
    };
}

function addProductInitState() {
    const PRODUCT_FORM = document.querySelector('#productform');
    const TITLE_INPUT = PRODUCT_FORM.elements.title;
    const DESC_INPUT = PRODUCT_FORM.elements.desc;
    const PRICE_INPUT = PRODUCT_FORM.elements.price;
    const IMAGE_INPUT = PRODUCT_FORM.elements.image;

    const debounceTitleValidation = debounce(titleValidation);
    const debounceDescValidation = debounce(descValidation);
    const debouncePriceValidation = debounce(priceValidation);

    async function productFormEventListener(e) {
        e.preventDefault();
        const product = {
            id: (new Date()).getTime().toString(),
            title: TITLE_INPUT.value,
            desc: DESC_INPUT.value,
            price: PRICE_INPUT.value,
            image: await getBlob(IMAGE_INPUT.files[0])
        };

        addProduct(product);
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

    function imageInputEventListener(e) {
        imageValidation.call(this);
    }

    PRODUCT_FORM.addEventListener('submit', productFormEventListener);
    TITLE_INPUT.addEventListener('input', titleInputEventListener);
    DESC_INPUT.addEventListener('input', descInputEventListener);
    PRICE_INPUT.addEventListener('input', priceInputEventListener);
    IMAGE_INPUT.addEventListener('input', imageInputEventListener);

    return () => {
        PRODUCT_FORM.reset();
        PRODUCT_FORM.removeEventListener('submit', productFormEventListener);
        TITLE_INPUT.removeEventListener('input', titleInputEventListener);
        DESC_INPUT.removeEventListener('input', descInputEventListener);
        PRICE_INPUT.removeEventListener('input', priceInputEventListener);
        IMAGE_INPUT.removeEventListener('input', imageInputEventListener);
    };
}
