import {combineReducers} from 'redux';
import productReducer from './productReducer';
import messageReducer from './messageReducer';

export default combineReducers({
    productReducer: productReducer,
    messageReducer: messageReducer
})