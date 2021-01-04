import React, { useEffect, useRef, useState } from 'react'
import './Message.scss'
import {
    Button,
    Avatar
} from "@chakra-ui/react"
import { useDispatch, useSelector } from 'react-redux'
import Api from '../Api'
import { ACTION_TYPE } from '../utils/constants'
import styled from 'styled-components'

const LoadMore = styled.div`
    margin-top: 50px;
    padding: 10px;
    text-align: center;
`

export default function Meaaage() {
    const [hasMessage, setHasMessage] = useState(true)
    const dispatch = useDispatch()
    let message = useSelector(state => state.message.message)
    let totalCount = useSelector(state => state.message.totalCount)
    let trigger = useSelector(state => state.message.trigger)
    let userInfo = useSelector(state => state.user)
    const scrollEl = useRef(null);
    // 1. 初始化
    // 2. 新消息
    useEffect(() => {
        const el = scrollEl.current
        el.scrollTop = el.scrollHeight - el.clientHeight;
    }, [trigger])
    async function handleDelteMessage(id) {
        await Api.deleteMessage(id)
        dispatch({
            type: ACTION_TYPE.ADD_MESSAGE,
            payload: {
                message: message.filter(msg => msg._id !== id),
                totalCount: totalCount - 1
            }
        })
    }
    async function handleGetMessage() {
        const data = await Api.getMessage({
            index: message.length,
            pageSize: 20
        })
        if (data.message.length === 0) {
            setHasMessage(false)
        }
        dispatch({
            type: ACTION_TYPE.ADD_MESSAGE,
            payload: {
                message: [
                    ...data.message,
                    ...message,
                ],
                totalCount: totalCount + 20
            }
        })
    }
    return <div ref={scrollEl} className="App-Message" data-testid="message" >
        <LoadMore>
            {hasMessage ?
                <Button onClick={handleGetMessage}>LOAD MORE</Button>
                :
                <span>No More Message</span>
            }
        </LoadMore>
        {message.map((m) => userInfo._id === m.user._id ?
            (<div className="line reserve" key={m._id}>
                <Button onClick={e => handleDelteMessage(m._id)}>Recall</Button>
                <div className="content">
                    <div className="img">
                        {m.images.map(img => <img src={img} alt="img" />)}
                    </div>
                    <span className="text">
                        {m.text}
                    </span>
                </div>
                <Avatar name={m.user.username} src={m.user.image} />
            </div>) : (<div className="line" key={m._id}>
                <Avatar name={m.user.username} src={m.user.image} />
                <span className="content">{m.text}</span>
            </div>)
        )}
    </div>
}
