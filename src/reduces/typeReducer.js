import {actionTypes} from '../actions/types';
import {updateSubtypeFromSubtype,updateTypeFromType } from '../utils/standardization';

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
        case actionTypes.TYPE_UPDATE :

            const newTypes = updateTypeFromType(state.types, action.payload);
            return {
                ...state,
                types: newTypes
            }
        
        case actionTypes.SUBTYPE_FETCH :
            return {
                ...state,
                subtypes: action.payload
            }
        
        case actionTypes.SUBTYPE_UPDATE :

            const newSubtypes = updateSubtypeFromSubtype(state.subtypes, action.payload);
            return {
                ...state,
                subtypes: newSubtypes
            }
        
        case actionTypes.SUBTYPE_UPDATEDELETE :

        default: return state;
    }
}




