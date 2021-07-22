import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import parentReducer from './Reducers/rootReducer';

const middlewares = [ thunk, logger ];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(parentReducer, composeEnhancers(applyMiddleware(...middlewares)));

export default store;