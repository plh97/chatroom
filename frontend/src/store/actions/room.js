import Api from '@src/Api.js'
import { ACTION_TYPE } from '@src/utils/constants'
const sleep = (ms = 200) => new Promise((res) => setTimeout(() => res(), ms));

export function getMessage({ roomId, pageSize = 20 }) {
    return async (dispatch, getState) => {
        const message = getState().message.message;
        const data = await Api.getRoom({
            _id: roomId,
            pageSize,
            page: Math.floor(message.length / pageSize, 10) + 1
        })
        await sleep();
        dispatch({
            type: ACTION_TYPE.ADD_MESSAGE,
            payload: {
                message: [
                    ...data.message,
                    ...message,
                ]
            }
        })
        return {
            ...data,
            isLoadEnd: data.message.length + message.length >= data.totalCount,
        };
    }
}