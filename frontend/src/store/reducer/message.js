import { ACTION_TYPE } from '../../utils/constants'

export default function messageReducer(state = [], action) {
    switch (action.type) {
        case ACTION_TYPE.ADD_MESSAGE:
            return [...state, action.payload]
        case ACTION_TYPE.INITIAL_MESSAGE:
            return action.payload
        default:
            return state
    }
}