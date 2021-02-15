import React, { useEffect, useRef, useState } from 'react'
import './Message.scoped.scss'
import {
    Button,
    Avatar
} from "@chakra-ui/react"
import { useDispatch, useSelector } from 'react-redux'
import Api from '@src/Api'
import { ACTION_TYPE } from '@src/utils/constants'
import { getMessage } from '@src/store/actions/room'
import { scrollToBottom } from '@src/utils/scroll'
import { useLoading } from "@hooks/loading";

export default function Meaaage(props) {
    const [hasMessage, setHasMessage] = useState(true)
    const dispatch = useDispatch()
    const [loadingMessage, setLoadingMessage] = useState(false)
    let message = useSelector(state => state.message.message)
    let userInfo = useSelector(state => state.user)
    const scrollEl = useRef(null);
    // 1. 初始化
    // 2. 新消息
    async function handleDelteMessage(id) {
        // can only recall themselves's message.
        await Api.deleteMessage({
            messageId: id,
            roomId: props.roomId
        })
        dispatch({
            type: ACTION_TYPE.ADD_MESSAGE,
            payload: {
                message: message.filter(msg => msg._id !== id)
            }
        })
    };
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        // here to target while room change or initial.
        (async () => {
            await setHasMessage(true);
            await dispatch({
                type: ACTION_TYPE.INITIAL_MESSAGE,
            })
            await handleGetMessage();
            scrollToBottom()
        })()
    }, [props.roomId]);
    useLoading(loading, props)
    async function handleGetMessage() {
        setLoadingMessage(true)
        const data = await dispatch(getMessage(props))
        setLoadingMessage(false)
        if (data.isLoadEnd) {
            setHasMessage(false);
        };
    }
    async function handleScroll() {
        // 1. has message and not loading true
        // 2. has message and loading false
        // 3. no message and not loading false
        if (scrollEl.current.scrollTop === 0 && !loadingMessage && hasMessage) {
            const targetElement = scrollEl.current.children[0]
            await handleGetMessage();
            targetElement.previousSibling.scrollIntoView();
        }
    }
    return <div ref={scrollEl} className="App-Message" data-testid="message" onScroll={handleScroll}>
        {message.map(m =>
            <MessageComponent
                m={m}
                key={m._id}
                userInfo={userInfo}
                handleDelteMessage={handleDelteMessage}
            />
        )}
    </div>
}


function MessageComponent({
    m,
    userInfo,
    handleDelteMessage,
}) {
    const container = useRef(null);
    useEffect(() => {
    }, [])
    return <div ref={container}>
        {
            userInfo._id === m.user._id ?
                (<div className="line reserve" >
                    <Button onClick={e => handleDelteMessage(m._id)}>Recall</Button>
                    <div className="content">
                        <div className="img">
                            {m.images.map(img => <img key={img} src={img} alt="img" />)}
                        </div>
                        <span className="text">
                            {m.text}
                        </span>
                    </div>
                    <Avatar name={m.user.username} src={m.user.image} />
                </div>) : (<div className="line">
                    <Avatar name={m.user.username} src={m.user.image} />
                    <span className="content">
                        <div className="img">
                            {m.images.map(img => <img key={img} src={img} alt="img" />)}
                        </div>
                        <span className="text">
                            {m.text}
                        </span>
                    </span>
                </div>)
        }
    </ div>
}