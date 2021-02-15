import Api from '@src/Api.js'
import { ACTION_TYPE } from '@src/utils/constants'

export function getMyUserInfo() {
    return async (dispatch) => {
        let data = await Api.getMyUserInfo()
        dispatch({
            type: ACTION_TYPE.SAVE_USER_INFO,
            payload: data
        })
        return data;
    }
}