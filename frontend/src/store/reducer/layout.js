import {
    ACTION_TYPE
} from '../../utils/constants'
const initState = {
    userInfoDetailSidebar: true
}
export default function layoutReducer(state = initState, action) {
    switch (action.type) {
        case ACTION_TYPE.SET_LAYOUT:
            return {
                ...state,
                ...action.payload
            }
            default:
                return state
    }
}