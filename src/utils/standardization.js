

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




export function removeElementFromArrayByKey( array , primaryKeyName, primaryKeyValue) {
    var newArray = [];
    for ( var i = 0; i < array.length; i++) {
        if (array[i][primaryKeyName] !== primaryKeyValue) {
            newArray.push(array[i]);
        }
    }
    return newArray;
}


export function updateObjectFromArrayByKey(array, primaryKeyName , updatedElement) {
    var newArray = [];
    for ( var i = 0; i < array.length; i++) {
        if (array[i][primaryKeyName] !== updatedElement[primaryKeyName]) {
            newArray.push(array[i]);
        }
    }
    newArray.push(updatedElement)
    return newArray;
}

export function objectStandardizer( object , objectMapping ) {

    var standardizedObject = {};
    for (var key of Object.keys(objectMapping)){
        switch (objectMapping[key]) {
            case "string" :
                standardizedObject[key] = coalesceString(object[key],"").trim();
                break;
            case "array" :
                standardizedObject[key] = isValid(object[key])?object[key]: [] ;
                break;
            default:
                standardizedObject[key] = object[key]

        }
    }
    return standardizedObject
}

// normal includes will not do anything to the existing string.
// due to bad data, we may need to trim all strings before checking for include comparison
export function blankStringIncludes(array, object){
    try {
        for( var i = 0; i < array.length; i++){
            // console.log(array[i].trim() + "/" + object.trim() + "=" + (array[i].trim() === object.trim() ))
            if (array[i].trim() === object.trim() ) return true;
        }
        return false;
    }
    catch (error ) {
        return false;
    }
}

export function arrayToCSV(array) {
    if ( !Array.isArray(array) || !isValid(array) || array.length ===0){
        return "";
    }
    var csv = array[0];
    for(var i = 1; i < array.length; i++){
        csv += "," + array[i] ;
    }
    return csv;
}