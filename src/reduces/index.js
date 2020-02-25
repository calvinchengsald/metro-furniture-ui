import {combineReducers} from 'redux';
import productReducer from './productReducer';
import messageReducer from './messageReducer';
import typeReducer from './typeReducer';
import searchReducer from './searchReducer';
import informationReducer from './informationReducer';

export default combineReducers({
    productReducer: productReducer,
    messageReducer: messageReducer,
    typeReducer: typeReducer,
    searchReducer: searchReducer,
    informationReducer: informationReducer,
})