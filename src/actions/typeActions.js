import {actionTypes} from '../actions/types';
import axios from 'axios';
import {objectStandardizer } from '../utils/standardization';
import {modelAttributeMapping} from '../models/models';
import {basePath} from '../configurations/config';

export function fetchTypes() {

    return function(dispatch) {
         // axios.get('http://ec2-34-221-235-186.us-west-2.compute.amazonaws.com:8080/product/all')
         axios.get( basePath +'/typehiearchy/all')
         .then(res => {

            res.data.content = res.data.content.map((type) => {
                return objectStandardizer(type, modelAttributeMapping.TYPE_MODEL);
            });
            dispatch({
                type: actionTypes.TYPE_FETCH,
                payload: res.data.content
            })
            
         })
         .catch( error => {
            dispatch({
                type: actionTypes.MESSAGE_CHANGE,
                payload: error
            })
         })
    }
    
}


export function postTypes(type,config,callbackSuccessfulUpdate) {

    return function(dispatch) {
         // axios.get('http://ec2-34-221-235-186.us-west-2.compute.amazonaws.com:8080/product/all')
         
        console.log("just this cors");
         type = objectStandardizer(type, modelAttributeMapping.TYPE_MODEL );
         axios.post( basePath +'/typehiearchy/insert', type,config)
         .then(res => {
            callbackSuccessfulUpdate(true);
            var newType  = objectStandardizer(res.data.content, modelAttributeMapping.TYPE_MODEL );
            dispatch({
                type: actionTypes.TYPE_POST,
                payload: newType
            })
            
         })
         .catch( error => {
             console.log(error);
            callbackSuccessfulUpdate(false);
            dispatch({
                type: actionTypes.MESSAGE_CHANGE,
                payload: error
            })
         })
    }
    
}


export function updateTypes(type,config, callbackSuccessfulUpdate) {

    return function(dispatch) {
         // axios.get('http://ec2-34-221-235-186.us-west-2.compute.amazonaws.com:8080/product/all')
         type = objectStandardizer(type, modelAttributeMapping.TYPE_MODEL );
         axios.post( basePath +'/typehiearchy/update', type,config)
         .then(res => {
            callbackSuccessfulUpdate(true);
            res.data.content = objectStandardizer(res.data.content, modelAttributeMapping.TYPE_MODEL );
            dispatch({
                type: actionTypes.TYPE_UPDATE,
                payload: res.data.content
            })
            
         })
         .catch( error => {
            dispatch({
                type: actionTypes.MESSAGE_CHANGE,
                payload: error
            })
         })
    }
    
}

export function deleteUpdateTypes(deleteUpdateModel,config,callbackSuccessfulUpdate) {

    return function(dispatch) {
         // axios.get('http://ec2-34-221-235-186.us-west-2.compute.amazonaws.com:8080/product/all')
         axios.post( basePath +'/typehiearchy/deleteupdate', deleteUpdateModel,config)
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
                payload: error
            })
         })
    }
    
}



export function deleteTypes(type,config, callbackSuccessfulUpdate) {

    return function(dispatch) {
         // axios.get('http://ec2-34-221-235-186.us-west-2.compute.amazonaws.com:8080/product/all')
         axios.post( basePath +'/typehiearchy/delete', type,config)
         .then(res => {

            res.data.content = objectStandardizer(res.data.content, modelAttributeMapping.TYPE_MODEL );
            
            dispatch({
                type: actionTypes.TYPE_DELETE,
                payload: res.data.content
            })
         })
         .catch( error => {
            callbackSuccessfulUpdate(false);
            dispatch({
                type: actionTypes.MESSAGE_CHANGE,
                payload: error
            })
         })
    }
    
}

export function fetchSubtypes() {

    return function(dispatch) {
         // axios.get('http://ec2-34-221-235-186.us-west-2.compute.amazonaws.com:8080/product/all')
         axios.get( basePath +'/subtypehiearchy/all')
         .then(res => {
             
            res.data.content = res.data.content.map((type) => {
                return objectStandardizer(type, modelAttributeMapping.SUBTYPE_MODEL);
            });
            dispatch({
                type: actionTypes.SUBTYPE_FETCH,
                payload: res.data.content
            })
            
         })
         .catch( error => {
            dispatch({
                type: actionTypes.MESSAGE_CHANGE,
                payload: error
            })
         })
    }
    
}

export function postSubtypes(subtype,config,callbackSuccessfulUpdate) {

    return function(dispatch) {
         // axios.get('http://ec2-34-221-235-186.us-west-2.compute.amazonaws.com:8080/product/all')
         subtype = objectStandardizer(subtype, modelAttributeMapping.SUBTYPE_MODEL );
         axios.post( basePath +'/subtypehiearchy', subtype,config)
         .then(res => {
             
            res.data.content = objectStandardizer(res.data.content, modelAttributeMapping.SUBTYPE_MODEL );
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
                payload: error
            })
         })
    }
    
}

export function updateSubtypes(subtype,config,callbackSuccessfulUpdate) {

    return function(dispatch) {
         // axios.get('http://ec2-34-221-235-186.us-west-2.compute.amazonaws.com:8080/product/all')
         subtype = objectStandardizer(subtype, modelAttributeMapping.SUBTYPE_MODEL );
         axios.post( basePath +'/subtypehiearchy/update', subtype,config)
         .then(res => {
             
            res.data.content = objectStandardizer(res.data.content, modelAttributeMapping.SUBTYPE_MODEL );
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
                payload: error
            })
         })
    }
    
}

export function deleteUpdateSubtypes(deleteUpdateModel,config,callbackSuccessfulUpdate) {

    return function(dispatch) {
         // axios.get('http://ec2-34-221-235-186.us-west-2.compute.amazonaws.com:8080/product/all')
         axios.post( basePath +'/subtypehiearchy/deleteupdate', deleteUpdateModel,config)
         .then(res => {
             
            callbackSuccessfulUpdate(true);
            //need to reload the type since this subtype primary key change also needs to reflect on type level
            // because of this might as well call a full fetch type option
         })
         .catch( error => {
            callbackSuccessfulUpdate(false);
            dispatch({
                type: actionTypes.MESSAGE_CHANGE,
                payload: error
            })
         })
    }
    
}



export function deleteSubtypes(subtype,config) {

    return function(dispatch) {
         // axios.get('http://ec2-34-221-235-186.us-west-2.compute.amazonaws.com:8080/product/all')
         axios.post( basePath +'/subtypehiearchy/delete', subtype,config)
         .then(res => {

            
            res.data.content = objectStandardizer(res.data.content, modelAttributeMapping.SUBTYPE_MODEL );
            dispatch({
                type: actionTypes.SUBTYPE_DELETE,
                payload: res.data.content
            })
         })
         .catch( error => {
            dispatch({
                type: actionTypes.MESSAGE_CHANGE,
                payload: error
            })
         })
    }
    
}


export function removeRecentType() {

    return function(dispatch) {
        dispatch({
            type: actionTypes.TYPE_REMOVE_RECENT_ADD,
            payload: ""
        })
    }
    
}

