import { debounce } from './utils.js';
import { renderErrorMessage, renderProductsTable, renderProductForm } from './components.js';
import { getProductById, searchProductsByPattern, getAllProducts } from './database.js';

export const pageStates = {
    'home': homeInitState,
    'add': addProductInitState,
    'edit': editProductInitState
};

// Each PageState function will return a Destroyer function to disable EventListeners on that page
// Initial State for "Home Page"
function homeInitState() {
    const SEARCHBAR = document.querySelector('#searchbar');
    const DROPDOWN_ITEMS = document.querySelectorAll('.dropdown .dropdown-menu .dropdown-item');
    let products = SEARCHBAR.value ? searchProductsByPattern(SEARCHBAR.value) : getAllProducts();

    let destroyErrorMessage = !products?.length && renderErrorMessage();
    let destroyProductsTable = products?.length && renderProductsTable(products);

    // Sorting Function
    function sortProducts() {
        DROPDOWN_ITEMS.forEach(elem => elem.classList.remove('active'));
        this.classList.add('active');

        if (!products?.length) return;

        const sortBy = this.getAttribute('data-sort');
        const order = this.getAttribute('data-order');

        if (sortBy === 'none') {
            products = SEARCHBAR.value ? searchProductsByPattern(SEARCHBAR.value) : getAllProducts();
        } else {
            if (sortBy === 'price' || sortBy === 'id') {
                products = products.sort((a, b) => {
                    if (parseFloat(a[sortBy]) > parseFloat(b[sortBy])) return order === 'asc' ? 1 : -1;
                    else if (parseFloat(a[sortBy]) < parseFloat(b[sortBy])) return order === 'asc' ? -1 : 1;
                    else return 0;
                });
            } else {
                products = products.sort((a, b) => {
                    if (a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) return order === 'asc' ? 1 : -1;
                    else if (a[sortBy].toLowerCase() < b[sortBy].toLowerCase()) return order === 'asc' ? -1 : 1;
                    else return 0;
                });
            }
        }

        destroyProductsTable && destroyProductsTable();
        destroyProductsTable = renderProductsTable(products);
    }


    // Searching Function - Debounce
    const debounceSearch = debounce(function () {
        products = searchProductsByPattern(this.value);
        if (!products?.length) {
            destroyProductsTable && destroyProductsTable() && (destroyProductsTable = null);
            destroyErrorMessage = renderErrorMessage('No match found!');
        }
        else {
            destroyErrorMessage && destroyErrorMessage() && (destroyErrorMessage = null);
            destroyProductsTable && destroyProductsTable();
            destroyProductsTable = renderProductsTable(products);
        }
    }, 1000);

    SEARCHBAR.addEventListener('input', debounceSearch);
    DROPDOWN_ITEMS.forEach(elem => { elem.addEventListener('click', sortProducts); });

    return () => {
        destroyErrorMessage && destroyErrorMessage();
        destroyProductsTable && destroyProductsTable();
        SEARCHBAR.removeEventListener('input', debounceSearch);
        DROPDOWN_ITEMS.forEach(elem => {
            elem.classList.remove('active');
            elem.removeEventListener('click', sortProducts);
        });
        DROPDOWN_ITEMS[0].classList.add('active');
    };
}

// Initial State for "Add Product Page"
function addProductInitState() {
    const [productForm, destroyProductForm] = renderProductForm();
    document.querySelector('.page#add').appendChild(productForm);

    return destroyProductForm;
}

// Initial State for "Edit Product Page"
function editProductInitState(id) {
    const product = getProductById(id);
    const [productForm, destroyProductForm] = renderProductForm(product);
    document.querySelector('.page#edit').appendChild(productForm);

    return destroyProductForm;
}
