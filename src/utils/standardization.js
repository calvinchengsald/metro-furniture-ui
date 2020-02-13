

export function isValidString (value) {
    return value!==undefined && value!==null && value.trim()!=="";
}

export function isValid (value) {
    return value!==undefined && value!==null;
}

export function coalesceString(value, defaultString) {
    if (value===undefined || value ===null ) {
        return defaultString;
    }
    return value;
}

export function removeFromArray(arr, value) {
    var newArr = [];
    for (var i=0; i<arr.length; i++) {
        if(arr[i] !== value){
            newArr.push(arr[i]);
        }
    }
    return newArr;
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



export function removeSubtypeFromSubtype(subtypes, m_subtype) {
    var newSubtypes = [];
    for ( var i = 0; i < subtypes.length; i++) {
        if (subtypes[i].m_subtype !== m_subtype) {
            newSubtypes.push(subtypes[i]);
        }
    }
    return newSubtypes;
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
