import {actionTypes} from '../actions/types'
import axios from 'axios';
import {modelAttributeMapping} from '../models/models';
import {objectStandardizer } from '../utils/standardization';
import {basePath} from '../configurations/config';



export function fetchProducts() {

    return function(dispatch) {
         // axios.get('http://ec2-34-221-235-186.us-west-2.compute.amazonaws.com:8080/product/all')
         axios.get( basePath +'/product/all')
         .then(res => {
             
            
            res.data.content = res.data.content.map((data) => {
                return objectStandardizer(data, modelAttributeMapping.PRODUCT_INFO_MODEL);
            });
            dispatch({
                type: actionTypes.ITEM_FETCH,
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


export function postProduct(product, config,successfulCallback) {

    return function(dispatch) {

         product = objectStandardizer(product, modelAttributeMapping.PRODUCT_INFO_MODEL );
         // axios.get('http://ec2-34-221-235-186.us-west-2.compute.amazonaws.com:8080/product/all')
         axios.post( basePath + '/product',product,config )
         .then(res => {
             
            successfulCallback(true);
            res.data.content = objectStandardizer(res.data.content, modelAttributeMapping.PRODUCT_INFO_MODEL );
            dispatch({
                type: actionTypes.ITEM_POST,
                payload: res.data.content
            })
            
         })
         .catch( error => {
             console.log(error);
             console.log(error.response);
    
            dispatch({
                type: actionTypes.MESSAGE_CHANGE,
                payload: error
            })
         })
    }
    
}
export function updateProduct(product,config, successfulCallback) {

    return function(dispatch) {
        
        product = objectStandardizer(product, modelAttributeMapping.PRODUCT_INFO_MODEL );
         // axios.get('http://ec2-34-221-235-186.us-west-2.compute.amazonaws.com:8080/product/all')
         axios.post( basePath + '/product/update',product ,config)
         .then(res => {
             
            successfulCallback(true);
            res.data.content = objectStandardizer(res.data.content, modelAttributeMapping.PRODUCT_INFO_MODEL );
            dispatch({
                type: actionTypes.ITEM_UPDATE,
                payload: res.data.content
            })
            
         })
         .catch( error => {
            successfulCallback(false)
            dispatch({
                type: actionTypes.MESSAGE_CHANGE,
                payload: error
            })
         })
    }
    
}


export function deleteProduct(product,config) {

    return function(dispatch) {
         // axios.get('http://ec2-34-221-235-186.us-west-2.compute.amazonaws.com:8080/product/all')
         axios.post(  basePath + '/product/delete',product ,config)
         .then(res => {
            res.data.content = objectStandardizer(res.data.content, modelAttributeMapping.PRODUCT_INFO_MODEL );
            dispatch({
                type: actionTypes.ITEM_DELETE,
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



export function deleteUpdateProducts(deleteUpdateModel,config,callbackSuccessfulUpdate) {

    return function(dispatch) {
         // axios.get('http://ec2-34-221-235-186.us-west-2.compute.amazonaws.com:8080/product/all')
         axios.post( basePath +'/product/deleteupdate', deleteUpdateModel,config)
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

export function removeRecentAdd() {

    return function(dispatch) {
        dispatch({
            type: actionTypes.ITEM_REMOVE_RECENT_ADD,
            payload: ""
        })
    }
    
}


