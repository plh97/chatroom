import { combineReducers } from 'redux'
import userReducer from './user'
import fetchReducer from './fetch'
import layoutReducer from './layout'
import messageReducer from './message'

export default combineReducers({
    user: userReducer,
    fetch: fetchReducer,
    layout: layoutReducer,
    message: messageReducer,
})