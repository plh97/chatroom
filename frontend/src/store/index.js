import { applyMiddleware, createStore } from 'redux'
import logger from 'redux-logger';

import reducer from './reducer'
const store = new createStore(
    reducer,
    applyMiddleware(logger)
)

export default store
