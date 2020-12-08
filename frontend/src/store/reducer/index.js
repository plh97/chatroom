import { combineReducers } from 'redux'
import userReducer from './user'
import fetchReducer from './fetch'
import messageReducer from './message'

export default combineReducers({
    message: messageReducer,
    fetch: fetchReducer,
    user: userReducer,
})