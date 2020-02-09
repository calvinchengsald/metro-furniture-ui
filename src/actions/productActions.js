import {actionTypes, basePath} from '../actions/types'
import axios from 'axios';

export function fetchProducts() {

    return function(dispatch) {
         // axios.get('http://ec2-34-221-235-186.us-west-2.compute.amazonaws.com:8080/product/all')
         axios.get( basePath +'/product/all')
         .then(res => {
             
            dispatch({
                type: actionTypes.ITEM_FETCH,
                payload: res.data.content
            })
            
         })
    }
    
}


export function postProduct(product) {

    return function(dispatch) {
         // axios.get('http://ec2-34-221-235-186.us-west-2.compute.amazonaws.com:8080/product/all')
         axios.post( basePath + '/product',product )
         .then(res => {
            dispatch({
                type: actionTypes.ITEM_POST,
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


export function deleteProduct(product) {

    return function(dispatch) {
         // axios.get('http://ec2-34-221-235-186.us-west-2.compute.amazonaws.com:8080/product/all')
         axios.post(  basePath + '/product/delete',product )
         .then(res => {
            dispatch({
                type: actionTypes.ITEM_DELETE,
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




export function removeRecentAdd() {

    return function(dispatch) {
        dispatch({
            type: actionTypes.ITEM_REMOVE_RECENT_ADD,
            payload: ""
        })
    }
    
}

