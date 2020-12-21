import React, { useEffect, useRef } from 'react'
import './Message.less'
import {
    Button,
    Avatar
} from "@chakra-ui/react"
import { useDispatch, useSelector } from 'react-redux'
import Api from '../Api'
import { ACTION_TYPE } from '../utils/constants'

export default function Meaaage() {
    const dispatch = useDispatch()
    let message = useSelector(state => state.message)
    let userInfo = useSelector(state => state.user)
    const scrollEl = useRef(null);
    useEffect(() => {
        const el = scrollEl.current
        el.scrollTop = el.scrollHeight - el.clientHeight;
    })
    async function handleDelteMessage(id) {
        await Api.deleteMessage(id)
        dispatch({
            type: ACTION_TYPE.INITIAL_MESSAGE,
            payload: await Api.getMessage()
        })
    }
    return <div ref={scrollEl} className="App-Message" data-testid="message" >
        {message.map((m) => userInfo._id === m.user._id ?
            (<div className="line reserve" key={m._id}>
                <Button onClick={e => handleDelteMessage(m)}>Recall</Button>
                <span className="content">{m.text}</span>
                <Avatar name={m.user.username} src={m.user.image} />
            </div>) : (<div className="line" key={m._id}>
                <Avatar name={m.user.username} src={m.user.image} />
                <span className="content">{m.text}</span>
            </div>)
        )}
    </div>
}
