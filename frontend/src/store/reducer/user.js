import { ACTION_TYPE } from '../../utils/constants'

const userInitState = {
    room: [],
    friend: [],
    trigger: Math.random()
}
export default function userReducer(state = userInitState, action) {
    switch (action.type) {
        case ACTION_TYPE.SAVE_USER_INFO:
            return action.payload
        case ACTION_TYPE.LOGOUT:
            return userInitState
        default:
            return state
    }
}