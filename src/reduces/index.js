import {combineReducers} from 'redux';
import productReducer from './productReducer';
import messageReducer from './messageReducer';
import typeReducer from './typeReducer';

export default combineReducers({
    productReducer: productReducer,
    messageReducer: messageReducer,
    typeReducer: typeReducer
})