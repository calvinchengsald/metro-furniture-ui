import {actionTypes} from '../actions/types'

const initialState = {
    types: [],
    subtypes: []
}

export default function( state=initialState, action) {
    switch(action.type) {
        case actionTypes.TYPE_FETCH :
            return {
                ...state,
                types: action.payload
            }
        default: return state;
    }
}




