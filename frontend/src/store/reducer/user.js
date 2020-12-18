import { ACTION_TYPE } from '../../utils/constants'

const userInitState = null
export default function userReducer(state=userInitState, action) {
    switch(action.type) {
        case ACTION_TYPE.SAVE_USER_INFO:
            return action.payload
        case 'logout':
            return null
        default:
            return state
    }
}