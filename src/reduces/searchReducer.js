import {actionTypes} from '../actions/types';

const initialState = {
    filterObject: {
        filterBaseCode: "",
        filterType: "",
        filterSubtype: "",
        filterTag: "",
        filterGeneral: "",
    }
}

export default function( state=initialState, action) {
    switch(action.type) {
        case actionTypes.SEARCH_UDPATE :
            return {
                ...state,
                filterObject: action.payload,
            }
        default: return state;
    }
}




