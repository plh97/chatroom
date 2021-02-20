import React, { useRef, useState } from 'react'
import './Message.scoped.scss'
import {
    Button,
    Spinner,
    Avatar
} from "@chakra-ui/react"
import { useDispatch, useSelector } from 'react-redux'
import Api from '@src/Api'
import { ACTION_TYPE } from '@src/utils/constants'
import { getMessage } from '@src/store/actions/room'
import { scrollToBottom } from '@src/utils/scroll'

export default function Meaaage(props) {
    const [hasMessage, setHasMessage] = useState(true)
    const [loadingMessage, setLoadingMessage] = useState(false)
    const dispatch = useDispatch()
    let message = useSelector(state => state.message.message)
    let userInfo = useSelector(state => state.user)
    const scrollEl = useRef(null);
    const handleGetMessage = React.useCallback(async () => {
        setLoadingMessage(true)
        const data = await dispatch(getMessage(props))
        setLoadingMessage(false)
        if (data.isLoadEnd) {
            setHasMessage(false);
        };
    }, [dispatch, props])
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
    React.useEffect(() => {
        async function inititalRoom() {
            setHasMessage(true);
            dispatch({
                type: ACTION_TYPE.INITIAL_MESSAGE,
            })
            const handleGetMessage = async () => {
                setLoadingMessage(true)
                const data = await dispatch(getMessage(props))
                setLoadingMessage(false)
                if (data.isLoadEnd) {
                    setHasMessage(false);
                };
            }
            await handleGetMessage();
            scrollToBottom()
        }
        // here to target while room change or initial.
        inititalRoom()
    }, [props.roomId, dispatch]);
    async function handleScroll() {
        // 1. has message and not loading true
        // 2. has message and loading false
        // 3. no message and not loading false
        if (scrollEl.current.scrollTop === 0 && !loadingMessage && hasMessage) {
            const targetElement = scrollEl.current.children[0]
            await handleGetMessage();
            if (scrollEl.current.scrollTop === 0) {
                targetElement.previousSibling.scrollIntoView();
            }
        }
    }
    return <div ref={scrollEl} className="App-Message" data-testid="message" onScroll={handleScroll}>
        {loadingMessage && <div className='load-more'><Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="md" /></div>}
        {!hasMessage && <div className='no-more-message'>---------- No More Message ----------</div>}
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
    return <div ref={container}>
        {
            userInfo._id === m.user._id ?
                (<div className="line reserve" >
                    <Button onClick={_ => handleDelteMessage(m._id)}>Recall</Button>
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