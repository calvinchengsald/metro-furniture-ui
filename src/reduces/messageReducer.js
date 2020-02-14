import {actionTypes} from '../actions/types';
import {isValid } from '../utils/standardization';

const initialState = {
    show: false,
    message: "none",
    message_type: "info"
}

export default function( state=initialState, action) {
    switch(action.type) {
        case actionTypes.MESSAGE_CHANGE :
            if (!isValid(action.payload.response)){
                action.payload.response = {
                    data: {
                        status: "Network Error",
                        message: "Please try again later"
                    }
                }
            }
            return {
                ...state,
                message_type: action.payload.response.data.status,
                message:   action.payload.response.data.message,
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




