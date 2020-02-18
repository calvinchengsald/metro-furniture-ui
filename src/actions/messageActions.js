import {actionTypes} from '../actions/types'



export function closeMessageAction() {

    return function(dispatch) {
        dispatch({
            type: actionTypes.MESSAGE_CLOSE,
            payload: {}
        })
    }
    
}



export function throwMessageAction(message_type,message) {

    var payload = {
        response: {
            data: {
                status: message_type,
                message: message
            }
        }
    }

    return function(dispatch) {
        dispatch({
            type: actionTypes.MESSAGE_CHANGE,
            payload: payload
        })
    }
    
}

