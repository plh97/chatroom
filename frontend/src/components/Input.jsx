import React, { useRef, useState } from 'react'
import './Input.less'
import {
    InputGroup,
    InputRightElement,
    InputLeftElement,
    HStack,
    Box,
    Image,
    Button,
    Input,
    useToast
} from "@chakra-ui/react"
import { useDispatch, useSelector } from 'react-redux';
import { ACTION_TYPE } from '../utils/constants';
import Api from '../Api';

export default function Input2() {
    const [text, setText] = useState('');
    const [images, setImages] = useState([]);
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
    const toast = useToast();
    function handlePaste($event) {
        if ($event.clipboardData.files.length) {
            if (images.length > 2) {
                return toast({
                    title: "Warning.",
                    description: "Limit 3 images.",
                    status: "error",
                    position: "top",
                    duration: 1000,
                })
            }
            const files = [...$event.clipboardData.files].map(file => {
                return {
                    ...file,
                    _id: Math.random(),
                    url: URL.createObjectURL(file),
                }
            })
            setImages([
                ...images,
                ...files
            ])
        }
    }
    return <div className="App-Input" data-testid="input" >
        <InputGroup size="md">
            <Input
                ref={input}
                onPaste={handlePaste}
                onKeyPress={handleKeyPress}
                pr="4.5rem"
                pl={`${1 + 2.5 * images.length}rem`}
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
            {
                images.length ?
                    <InputLeftElement pl="0" pr="0" width={`${0 + 2 * images.length}rem`}>
                        <HStack>
                            {images.map(image => <Box
                                borderWidth="1px"
                                key={image._id}
                            >
                                <Image
                                    objectFit="contain"
                                    alt={image.url}
                                    boxSize="2rem"
                                    src={image.url}
                                />
                            </Box>)}
                        </HStack>
                    </InputLeftElement> : ''
            }
        </InputGroup>
    </div>
}
