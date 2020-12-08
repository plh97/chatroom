import { ACTION_TYPE } from '../../utils/constants'

const userInitState = {
    userInfo: null,
    username: null,
    _id: null,
}
export default function userReducer(state=userInitState, action) {
    switch(action.type) {
        case ACTION_TYPE.SAVE_USER_INFO:
            return {
                ...state,
                ...action.payload
            }
        case 'logout':
            return null
        default:
            return state
    }
}