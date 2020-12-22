import React, { useRef, useState } from 'react'
import './Input.less'
import {
    InputGroup,
    InputRightElement,
    Button,
    Input
} from "@chakra-ui/react"
import { useDispatch, useSelector } from 'react-redux';
import { ACTION_TYPE } from '../utils/constants';
import Api from '../Api';

export default function Input2() {
    const [text, setText] = useState('');
    const dispatch = useDispatch()
    const userInfo = useSelector(state => state.user)
    const input = useRef(null);
    let message = useSelector(state => state.message.message)
    let totalCount = useSelector(state => state.message.totalCount)
    async function handleSendMessage() {
        if (text) {
            const data = {
                text,
                user: userInfo._id
            }
            const msgBody = await Api.sendMessage(data)
            dispatch({
                type: ACTION_TYPE.ADD_MESSAGE,
                payload: {
                    message: [
                        ...message,
                        msgBody
                    ],
                    totalCount: totalCount + 1,
                    trigger: Math.random()
                } 
            })
            setText('')
            input.current.focus();
        }
    }
    function handleKeyPress(e) {
        if (e.charCode === 13) {
            handleSendMessage()
        }
    }
    return <div className="App-Input" data-testid="input" >
        <InputGroup size="md">
            <Input
                ref={input}
                onKeyPress={handleKeyPress}
                pr="4.5rem"
                placeholder="Enter password"
                value={text}
                onChange={e => setText(e.target.value)}
                autoFocus
            />
            <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleSendMessage}>
                    SEND
                </Button>
            </InputRightElement>
        </InputGroup>
    </div>
}
