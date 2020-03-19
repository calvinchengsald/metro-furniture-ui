

import { useAuth0 } from "../react-auth0-spa";
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

export function getObjectFromArrayByKey(array, primaryKeyName , primaryKeyValue) {
    for ( var i = 0; i < array.length; i++) {
        if (array[i][primaryKeyName] === primaryKeyValue) {
            return array[i] ;
        }
    }
    return null;
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
            case "arrayStringObject" :
                standardizedObject[key] = isValid(object[key])?object[key]: [] ;
                break;
            default:
                standardizedObject[key] = object[key]

        }
    }
    return standardizedObject
}

//returns true if the given key is unique for this object array
//if object is null , ignore
export function distinctOnObjectArrayByKey(array, key){

    var keyHolder = [];
    for (var i=0; i< array.length; i++){
        if(array[i] === null) continue;
        if(!isValidString(array[i][key]) ){
            return false
        }
        if(isValid(keyHolder[array[i][key].trim()]) ){
            return false;
        }
        keyHolder[array[i][key].trim()] = "occupied";
    }
    return true;
}


// returns an array of objects that is distinct by the given key
export function distinctObjectArrayByKeyFirstOne(array, key){

    var keyHolder = [];
    var distinctArray = [];
    for (var i=0; i< array.length; i++){
        if(array[i] === null || !isValidString(array[i][key])) continue;
        if(  !keyHolder.includes(array[i][key]) ){
            keyHolder.push(array[i][key]);
            distinctArray.push(array[i]);
        }
    }
    return distinctArray;
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

export function includesStringCaseInsensitive(array, obj){
    for( var i = 0; i < array.length; i++){
        // console.log(array[i].trim() + "/" + object.trim() + "=" + (array[i].trim() === object.trim() ))
        if ( !isValidString(array[i])){
            continue;
        }
        if (array[i].trim().toLowerCase() === obj.trim().toLowerCase() ) return true;
    }
}

// same as blankStringIncludes but for an array of object focusing on checking primary key
export function blankStringIncludesByKey(array, object, primaryKeyName){
    try {
        for( var i = 0; i < array.length; i++){
            if (array[i][primaryKeyName].trim() === object.trim() ) return true;
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


//given a type object, get an array of all subtype objects belonging to that type
export function getSubtypeFromType(targetTypeObject, allSubtypes) {
    var actualSubtype = [];

    if (isValid(allSubtypes)){
        for( var i=0; i < allSubtypes.length; i++) {
            if ( blankStringIncludes( targetTypeObject.m_subtype , allSubtypes[i].m_subtype ) ) {
                actualSubtype.push(allSubtypes[i]);
            }
        }
    } 

    return actualSubtype;
}
//if you only have the type string, havent done any filtering yet
export function getSubtypeFromTypeString(targetTypeString, allTypes, allSubtypes) {
    if (!isValid(targetTypeString)) {
        return [];
    }
    var targetTypeArr = allTypes.filter((type) => type.m_type===targetTypeString.trim());
    if( !isValid(targetTypeArr[0])) {
        return [];
    }
    return getSubtypeFromType(targetTypeArr[0], allSubtypes);
}

export function cloneObjectArray(array) {
    if(!isValid(array) || !Array.isArray(array)){
        return [];
    }
    var cloneArray = [];
    for(var i=0; i < array.length; i++){
        var newObj = {};
        if(array[i] === null){

        }
        else {
            for(var keys in array[i]){
                newObj[keys] = array[i][keys];
            }
        }
        cloneArray[i] = newObj;
    }

    return cloneArray;
}




export const GetAuthenticationHeader = () => {
    console.log("in here");
    const {   getTokenSilently,getIdTokenClaims } = useAuth0();
    console.log(getIdTokenClaims().__raw);
    console.log(getTokenSilently());
      let config = {
          headers: {
            header1: "value",
          }
        }
    return config
}



export const callApiWithToken = async (that, callback, errorMessage) => {
    try {
        const token = await that.props.getTokenSilently();

        var config = {
            headers: {
                Authorization: `Bearer ${token}`
              }
        }
        callback(config);
    } catch (error) {
        errorMessage("Authorization Error", "You must be logged in to make that action");
      console.error(error);
    }
  };