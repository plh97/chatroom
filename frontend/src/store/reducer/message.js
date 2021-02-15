import { ACTION_TYPE } from '../../utils/constants'

const initialState = {
    message: [],
    totalCount: 0,
    trigger: Math.random(),
}

export default function messageReducer(state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPE.ADD_MESSAGE:
            return {
                ...state,
                ...action.payload
            }
        case ACTION_TYPE.INITIAL_MESSAGE:
            return initialState;
        default:
            return state
    }
}