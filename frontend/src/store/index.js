import { createStore } from 'redux'
import { ACTION_TYPE } from '../utils/constants'

import reducer from './reducer'
const store = new createStore(
    reducer,
)

store.dispatch({
    type: ACTION_TYPE.CREATE_TASK,
    payload: 'task 0'
})

export default store
