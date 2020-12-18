import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { useHistory } from "react-router-dom";

import { ACTION_TYPE } from '../utils/constants'
import Api from '../Api'
import {
    Stack,
    Input,
    Button,
    useToast,
    FormLabel,
    FormControl,
    Avatar,
} from "@chakra-ui/react"

const Wrapper = styled.div`
    max-width: 400px;
    width: 90vw;
    margin: 130px auto;
    position: relative;
`;

const Title = styled.h1`
    font-size: revert;
    font-weight: initial;
`;

const AvatarContainer = styled.div`
    left: 31%;
    bottom: 100%;
    position: absolute;
    text-align: center;
`;

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const dispatch = useDispatch();
    const toast = useToast();
    const history = useHistory();
    async function handleLogin() {
        if (!username || !password) {
            toast({
                title: "Warning.",
                description: "Please Input Username & password.",
                status: "error",
                position: "top",
                duration: 1000,
            })
            return
        }
        // dispatch({ type: ACTION_TYPE.FETCH_START })
        const userInfo = await Api.login({
            username,
            password
        })
        // dispatch({ type: ACTION_TYPE.FETCH_SUCCESS })
        if (!userInfo) return
        dispatch({
            type: ACTION_TYPE.SAVE_USER_INFO,
            payload: userInfo
        })
        dispatch({
            type: ACTION_TYPE.INITIAL_MESSAGE,
            payload: await Api.getMessage()
        })
    }
    function handleRegister() {
        history.push('/register')
    }
    async function handleInputUsername(e) {
        const input = e.target.value
        setUsername(input)
        const userImage = await Api.getUserImage(input)
        setImageUrl(userImage)
    }
    return <div className="login" data-testid="login">
        <Wrapper>
            <AvatarContainer>
                <Avatar size="xl" name="?" src={imageUrl} />
            </AvatarContainer>
            <Title>Login</Title>
            <FormControl id="username" isRequired>
                <FormLabel>User Name</FormLabel>
                <Input type="text" autoComplete="true" autoFocus value={username} onChange={handleInputUsername} />
            </FormControl>
            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <Input type="password" autoComplete="true" value={password} onChange={e => setPassword(e.target.value)} />
            </FormControl>
            <FormControl id="button">
                <FormLabel></FormLabel>
                <Stack spacing={2} direction="row" align="center">
                    <Button onClick={handleLogin} colorScheme="green">Login</Button>
                    <Button onClick={handleRegister} colorScheme="gray">Register</Button>
                </Stack>
            </FormControl>
        </Wrapper>
    </div>
}