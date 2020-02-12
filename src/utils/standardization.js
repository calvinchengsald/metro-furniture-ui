

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


export function updateSubtypeFromSubtype(subtypes, updatedSubtype) {
    var newSubtypes = [];
    for ( var i = 0; i < subtypes.length; i++) {
        if (subtypes[i].m_subtype !== updatedSubtype.m_subtype) {
            newSubtypes.push(subtypes[i]);
        }
    }
    newSubtypes.push(updatedSubtype)
    return newSubtypes;
}


export function updateTypeFromType(type, updateType) {
    var newType = [];
    for ( var i = 0; i < type.length; i++) {
        if (type[i].m_type !== updateType.m_type) {
            newType.push(type[i]);
        }
    }
    newType.push(updateType)
    return newType;
}

