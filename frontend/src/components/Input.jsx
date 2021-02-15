import React, { useEffect, useRef, useState } from 'react'
import './Input.scoped.scss'
import {
    InputGroup,
    InputRightElement,
    InputLeftElement,
    HStack,
    CloseButton,
    Box,
    Image,
    Button,
    Input,
    useToast
} from "@chakra-ui/react"
import Api from '@/Api';
import Loading from './Loading';
import { ACTION_TYPE } from '@/utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { getMyUserInfo } from '@/store/actions/user'
import { scrollToBottom } from '@/utils/scroll'

export default function InputComponent(props) {
    const dispatch = useDispatch()
    const [text, setText] = useState('');
    const [images, setImages] = useState([]);
    const userInfo = useSelector(state => state.user)
    const input = useRef(null);
    let message = useSelector(state => state.message.message)
    let totalCount = useSelector(state => state.message.totalCount)
    const toast = useToast();
    async function handleSendMessage() {
        if (images.filter(img => img.loading).length > 0) {
            return toast({
                title: "Warning.",
                description: "Image still uploading.",
                status: "error",
                position: "top",
                duration: 1000,
            })
        }
        if (text || images.length) {
            const data = {
                text,
                images: images.filter(e => !e.loading).map(e => e.url),
                user: userInfo._id,
                roomId: props.roomId,
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
            dispatch(getMyUserInfo())
            setText('')
            setImages([]);
            input.current.focus();
            scrollToBottom();
        }
    }
    function handleKeyPress(e) {
        if (e.charCode === 13) {
            handleSendMessage()
        }
    }
    function handlePaste($event) {
        if ($event.clipboardData.files.length > 0) {
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
                    raw: file,
                    _id: Math.random(),
                    url: URL.createObjectURL(file),
                    loading: true,
                }
            })
            setImages([
                ...images,
                ...files
            ])
        }
    }
    useEffect(() => {
        (async () => {
            const form = new FormData();
            const currUploadImage = images.filter(e => e.loading)
            if (currUploadImage.length === 0) return;
            currUploadImage.forEach(file => {
                form.append('file', file.raw)
            })
            const imageUrl = await Api.upload(form)
            setImages(images.map((img, i) => {
                if (i === images.length - 1) {
                    return {
                        ...img,
                        loading: false,
                        url: imageUrl
                    }
                }
                return img
            }))
        })()
    }, [images])
    useEffect(() => {
        input.current.focus();
    }, [props.roomId])
    function handleRemoveImage(data) {
        setImages(images.filter(img => img !== data))
    }
    return <div className="App-Input" data-testid="input" >
        <InputGroup size="md">
            <Input
                ref={input}
                onPaste={handlePaste}
                onKeyPress={handleKeyPress}
                pr="4.5rem"
                pl={`${2 + 2 * images.length + 0.5 * (images.length - 1)}rem`}
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
                    <InputLeftElement pl="0" pr="0" width={`${2 + 2 * images.length + 0.5 * (images.length - 1)}rem`}>
                        <HStack>
                            {images.map(image => <Box
                                className="image-box"
                                borderWidth="0.1rem"
                                key={image._id}
                            >
                                <Loading size="sm" isLoading={image.loading}>
                                    <Image
                                        objectFit="contain"
                                        alt={image.url}
                                        boxSize="2rem"
                                        src={image.url}
                                    />
                                </Loading>
                                <CloseButton onClick={e => handleRemoveImage(image)} className="close-btn" size="sm" />
                            </Box>)}
                        </HStack>
                    </InputLeftElement> : ''
            }
        </InputGroup>
    </div>
}
