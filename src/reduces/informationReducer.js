import {actionTypes} from '../actions/types';

const initialState = {
    informationObject: {
        base_code:"BWT"
    }
}

export default function( state=initialState, action) {
    switch(action.type) {
        case actionTypes.INFORMATION_UPDATE :
            return {
                ...state,
                informationObject: action.payload,
            }
        default: return state;
    }
}




