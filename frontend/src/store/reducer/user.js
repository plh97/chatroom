import { ACTION_TYPE } from '../../utils/constants'

const userInitState = {
    userInfo: null
}
export default function userReducer(state=userInitState, action) {
    switch(action.type) {
        case ACTION_TYPE.SAVE_USER_INFO:
            return {
                ...state,
                userInfo: action.payload
            }
        case 'logout':
            return {
                ...state,
                userInfo: null
            }
        default:
            return state
    }
}