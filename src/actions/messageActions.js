import {actionTypes} from '../actions/types'



export function closeMessageAction() {

    return function(dispatch) {
        dispatch({
            type: actionTypes.MESSAGE_CLOSE,
            payload: {}
        })
    }
    
}
