import { applyMiddleware, createStore } from 'redux'
import { ACTION_TYPE } from '../utils/constants'
import thunk from './middleware/thunk';
import logger from 'redux-logger';

import reducer from './reducer'
const store = new createStore(
    reducer,
    applyMiddleware(thunk, logger)
)

store.dispatch({
    type: ACTION_TYPE.CREATE_TASK,
    payload: 'task 0'
})

export default store
