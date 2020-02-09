
import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import rootRducer from './reduces'


const initialState = {};
const middleware = [thunk];
const store = createStore( rootRducer, initialState,
     compose(
         applyMiddleware(...middleware),
         window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() 
         )
    );

// const store = createStore( rootRducer, initialState,applyMiddleware(...middleware) );

       
export default store;