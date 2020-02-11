

export function isValidString (value) {
    return value!==undefined && value!==null && value.trim()!=="";
}

export function isValid (value) {
    return value!==undefined && value!==null;
}


export function cleanArray(arr, value) {
    for (var i=0; i<arr.length; i++) {
        if(arr[i] === value){
            arr.splice(i,1);
        }
    }
    return arr;
}

export function removeProductFromProducts(products, item_code) {
    var newProducts = [];
    for ( var i = 0; i < products.length; i++) {
        if (products[i].item_code !== item_code) {
            newProducts.push(products[i]);
        }
    }
    return newProducts;
}

