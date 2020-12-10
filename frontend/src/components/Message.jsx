import React, { useEffect, useRef } from 'react'
import './Message.less'
import {
    Avatar
} from "@chakra-ui/react"
import { useSelector } from 'react-redux'

export default function Meaaage() {
    let message = useSelector(state => state.message)
    const scrollEl = useRef(null);
    useEffect(() => {
        const el = scrollEl.current
        el.scrollTop = el.scrollHeight - el.clientHeight;
    })
    return <div ref={scrollEl} className="App-Message" data-testid="message" >
        {message.map((m) => <div className="line" key={m._id}>
            <Avatar name={m.user} src={m.image} />
            <span className="content">{m.text}</span>
        </div>)}
    </div>
}
