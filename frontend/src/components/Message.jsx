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
        {message.map((m) => <div className="line" key={m._id}>
            <Avatar name={m.user} src={m.image} />
            <span className="content">{m.text}</span>
            <Button onClick={e => handleDelteMessage(m)}>delete</Button>
        </div>)}
    </div>
}
