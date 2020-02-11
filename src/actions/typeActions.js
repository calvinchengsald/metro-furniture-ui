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


