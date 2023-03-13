// Product Form 'title' field Validation
export function titleValidation() {
    const value = this.value;
    let flag = false;
    let message = '';
    if (!value) {
        flag = true;
        message = 'Product Title must not be empty';
    } else if (!isNaN(value)) {
        flag = true;
        message = 'Product Title must be alpha numeric';
    } else if (value.length < 3) {
        flag = true;
        message = 'Product Title must be greater or equal to 3';
    }

    this.setCustomValidity(flag ? message : '');
    this.reportValidity();
}

// Product Form 'desc' field Validation
export function descValidation() {
    const value = this.value;
    let flag = false;
    let message = '';

    if (!value) {
        flag = true;
        message = 'Product Description must not be empty';
    } else if (!isNaN(value)) {
        flag = true;
        message = 'Product Description must be alpha numeric';
    } else if (value.length < 5) {
        flag = true;
        message = 'Product Description must be greater or equal to 5';
    }

    this.setCustomValidity(flag ? message : '');
    this.reportValidity();
}

// Product Form 'price' field Validation
export function priceValidation() {
    const value = this.value;
    let flag = false;
    let message = '';

    if (!value) {
        flag = true;
        message = 'Product Price must not be empty';
    } else if (isNaN(value)) {
        flag = true;
        message = 'Product Price must be a Number';
    } else if (parseFloat(value) < 0) {
        flag = true;
        message = 'Product Price must be a Positive number';
    }

    this.setCustomValidity(flag ? message : '');
    this.reportValidity();
}

// Product Form 'image' field Validation
export function imageValidation() {
    const file = this.files[0];
    let flag = false;
    let message = '';

    if (file.size > 200000) {
        flag = true;
        message = 'File size must be less than 200KB';
    }

    this.setCustomValidity(flag ? message : '');
    this.reportValidity();
}