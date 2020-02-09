import {actionTypes} from '../actions/types'

const initialState = {
    show: false,
    message: "none",
    message_type: "info"
}

export default function( state=initialState, action) {
    switch(action.type) {
        case actionTypes.MESSAGE_CHANGE :
            return {
                ...state,
                message_type: action.payload.status,
                message: action.payload.message,
                show: true
            }
        case actionTypes.MESSAGE_CLOSE :
            return {
                ...state,
                message_type: "",
                message: "",
                show: false
            }
        default: return state;
    }
}




