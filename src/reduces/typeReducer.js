import {actionTypes} from '../actions/types';
import {updateObjectFromArrayByKey, removeElementFromArrayByKey } from '../utils/standardization';

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

            const newTypes = updateObjectFromArrayByKey(state.types, "m_type", action.payload);
            return {
                ...state,
                types: newTypes
            }
        
        case actionTypes.TYPE_POST :

            const newType = {
                m_type: action.payload.m_type,
                m_description: action.payload.m_description,
                m_url: action.payload.m_url,
                m_subtype: action.payload.m_subtype
            }
            return {
                ...state,
                types: [...state.types, newType],
                recentAddType: newType.m_type
            }
        
        case actionTypes.TYPE_DELETE :

            const newTypes2 = removeElementFromArrayByKey(state.types, "m_type", action.payload.m_type);
            return {
                ...state,
                types: newTypes2
            }
        
        case actionTypes.TYPE_REMOVE_RECENT_ADD :
            return {
                ...state,
                recentAddType: ""
            }
        case actionTypes.SUBTYPE_FETCH :
            return {
                ...state,
                subtypes: action.payload
            }
        
        case actionTypes.SUBTYPE_UPDATE :

            const newSubtypes = updateObjectFromArrayByKey(state.subtypes, "m_subtype", action.payload);
            return {
                ...state,
                subtypes: newSubtypes
            }
        
        case actionTypes.SUBTYPE_DELETE :

            const newSubtypes2 = removeElementFromArrayByKey(state.subtypes, "m_subtype", action.payload.m_subtype);
            return {
                ...state,
                subtypes: newSubtypes2
            }
        case actionTypes.SUBTYPE_POST :

            const newSubtype = {
                m_subtype: action.payload.m_subtype,
                m_description: action.payload.m_description,
                m_url: action.payload.m_url,
            }
            return {
                ...state,
                subtypes: [...state.subtypes, newSubtype]
            }
        default: return state;
    }
}




