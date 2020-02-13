import {actionTypes, basePath} from '../actions/types'
import axios from 'axios';

export function fetchTypes() {

    return function(dispatch) {
         // axios.get('http://ec2-34-221-235-186.us-west-2.compute.amazonaws.com:8080/product/all')
         axios.get( basePath +'/typehiearchy/all')
         .then(res => {
            dispatch({
                type: actionTypes.TYPE_FETCH,
                payload: res.data.content
            })
            
         })
         .catch( error => {
            dispatch({
                type: actionTypes.MESSAGE_CHANGE,
                payload: error.response.data
            })
         })
    }
    
}


export function postTypes(type,callbackSuccessfulUpdate) {

    return function(dispatch) {
         // axios.get('http://ec2-34-221-235-186.us-west-2.compute.amazonaws.com:8080/product/all')
         axios.post( basePath +'/typehiearchy', type)
         .then(res => {
            callbackSuccessfulUpdate(true);
            dispatch({
                type: actionTypes.TYPE_POST,
                payload: res.data.content
            })
            
         })
         .catch( error => {
             console.log(error);
             console.log(error.response);
            callbackSuccessfulUpdate(false);
            dispatch({
                type: actionTypes.MESSAGE_CHANGE,
                payload: error.response.data
            })
         })
    }
    
}


export function updateTypes(type, callbackSuccessfulUpdate) {

    return function(dispatch) {
         // axios.get('http://ec2-34-221-235-186.us-west-2.compute.amazonaws.com:8080/product/all')
         axios.post( basePath +'/typehiearchy/update', type)
         .then(res => {
            callbackSuccessfulUpdate(true)
            dispatch({
                type: actionTypes.TYPE_UPDATE,
                payload: res.data.content
            })
            
         })
         .catch( error => {
             console.log(error);
             console.log(error.response);
            dispatch({
                type: actionTypes.MESSAGE_CHANGE,
                payload: error.response.data
            })
         })
    }
    
}

export function deleteUpdateTypes(deleteUpdateModel,callbackSuccessfulUpdate) {

    return function(dispatch) {
         // axios.get('http://ec2-34-221-235-186.us-west-2.compute.amazonaws.com:8080/product/all')
         axios.post( basePath +'/typehiearchy/deleteupdate', deleteUpdateModel)
         .then(res => {
             // need a full refetch of this list
             // can be optimized here, but that means the return data will have to change so we
             // can get a list of what to update in our list object and what to take away
            callbackSuccessfulUpdate(true);
            
         })
         .catch( error => {
            callbackSuccessfulUpdate(false);
            dispatch({
                type: actionTypes.MESSAGE_CHANGE,
                payload: error.response.data
            })
         })
    }
    
}

export function fetchSubtypes() {

    return function(dispatch) {
         // axios.get('http://ec2-34-221-235-186.us-west-2.compute.amazonaws.com:8080/product/all')
         axios.get( basePath +'/subtypehiearchy/all')
         .then(res => {
            dispatch({
                type: actionTypes.SUBTYPE_FETCH,
                payload: res.data.content
            })
            
         })
         .catch( error => {
            dispatch({
                type: actionTypes.MESSAGE_CHANGE,
                payload: error.response.data
            })
         })
    }
    
}

export function postSubtypes(subtype,callbackSuccessfulUpdate) {

    return function(dispatch) {
         // axios.get('http://ec2-34-221-235-186.us-west-2.compute.amazonaws.com:8080/product/all')
         axios.post( basePath +'/subtypehiearchy', subtype)
         .then(res => {
             
            callbackSuccessfulUpdate(true);
            dispatch({
                type: actionTypes.SUBTYPE_POST,
                payload: res.data.content
            })
            
         })
         .catch( error => {
            callbackSuccessfulUpdate(false);
            dispatch({
                type: actionTypes.MESSAGE_CHANGE,
                payload: error.response.data
            })
         })
    }
    
}

export function updateSubtypes(subtype,callbackSuccessfulUpdate) {

    return function(dispatch) {
         // axios.get('http://ec2-34-221-235-186.us-west-2.compute.amazonaws.com:8080/product/all')
         axios.post( basePath +'/subtypehiearchy/update', subtype)
         .then(res => {
             
            callbackSuccessfulUpdate(true);
            dispatch({
                type: actionTypes.SUBTYPE_UPDATE,
                payload: res.data.content
            })
            
         })
         .catch( error => {
            callbackSuccessfulUpdate(false);
            dispatch({
                type: actionTypes.MESSAGE_CHANGE,
                payload: error.response.data
            })
         })
    }
    
}

export function deleteUpdateSubtypes(deleteUpdateModel,callbackSuccessfulUpdate) {

    return function(dispatch) {
         // axios.get('http://ec2-34-221-235-186.us-west-2.compute.amazonaws.com:8080/product/all')
         axios.post( basePath +'/subtypehiearchy/deleteupdate', deleteUpdateModel)
         .then(res => {
             
            callbackSuccessfulUpdate(true);
            //need to reload the type since this subtype primary key change also needs to reflect on type level
            // because of this might as well call a full fetch type option
         })
         .catch( error => {
            callbackSuccessfulUpdate(false);
            dispatch({
                type: actionTypes.MESSAGE_CHANGE,
                payload: error.response.data
            })
         })
    }
    
}



export function deleteSubtypes(subtype,type, callbackSuccessfulUpdate) {

    return function(dispatch) {
         // axios.get('http://ec2-34-221-235-186.us-west-2.compute.amazonaws.com:8080/product/all')
         axios.post( basePath +'/subtypehiearchy/delete', subtype)
         .then(res => {

            
            dispatch({
                type: actionTypes.SUBTYPE_DELETE,
                payload: res.data.content
            })
         })
         .catch( error => {
            callbackSuccessfulUpdate(false);
            dispatch({
                type: actionTypes.MESSAGE_CHANGE,
                payload: error.response.data
            })
         })
    }
    
}
