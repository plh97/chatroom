import { ACTION_TYPE } from '../../utils/constants'

const initState = ACTION_TYPE.FETCH_SUCCESS

export default function fetchReducer(state = initState, action) {
    switch (action.type) {
        case ACTION_TYPE.FETCH_START:
            return ACTION_TYPE.FETCH_START
        case ACTION_TYPE.FETCH_FAIL:
            return ACTION_TYPE.FETCH_FAIL
        case ACTION_TYPE.FETCH_SUCCESS:
            return ACTION_TYPE.FETCH_SUCCESS
        default:
            return state
    }
}