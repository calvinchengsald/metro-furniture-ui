import {actionTypes} from '../actions/types';
import {removeElementFromArrayByKey , updateObjectFromArrayByKey} from '../utils/standardization';

const initialState = {
    products: []
}

export default function( state=initialState, action) {
    switch(action.type) {
        case actionTypes.ITEM_FETCH :
            return {
                ...state,
                products: action.payload
            }
        case actionTypes.ITEM_POST :

            const newProduct = {
                item_code: action.payload.item_code,
                base_code: action.payload.base_code,
                m_size: action.payload.m_size,
                m_type: action.payload.m_type,
                m_subtype: action.payload.m_subtype,
                color: action.payload.color,
                notes: action.payload.notes,
                tag: action.payload.tag
            }
            return {
                ...state,
                products: [...state.products, newProduct],
                recentAddItemCode: action.payload.item_code
            }
        case actionTypes.ITEM_UPDATE :

            const newProductUpdate = {
                item_code: action.payload.item_code,
                base_code: action.payload.base_code,
                m_size: action.payload.m_size,
                m_type: action.payload.m_type,
                m_subtype: action.payload.m_subtype,
                color: action.payload.color,
                notes: action.payload.notes,
                tag: action.payload.tag
            };
            var newProductsList = updateObjectFromArrayByKey(state.products, "item_code", newProductUpdate);
            return {
                ...state,
                products: newProductsList
            }
        case actionTypes.ITEM_REMOVE_RECENT_ADD :
            return {
                ...state,
                recentAddItemCode: ""
            }
        case actionTypes.ITEM_DELETE :
            
            const newProducts = removeElementFromArrayByKey(state.products, "item_code", action.payload.item_code);
            return {
                ...state,
                products: newProducts
            }
        default: return state;
    }
}


