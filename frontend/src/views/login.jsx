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
} from "@chakra-ui/react"

const Wrapper = styled.div`
    max-width: 400px;
    width: 90vw;
    margin: 130px auto;
`;

const Title = styled.h1`
    font-size: revert;
    font-weight: initial;
`;

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
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
        dispatch({ type: ACTION_TYPE.FETCH_START })
        await Api.login({
            username,
            password
        })
        dispatch({ type: ACTION_TYPE.FETCH_SUCCESS })
        dispatch({
            type: ACTION_TYPE.SAVE_USER_INFO,
            payload: ''
        })
    }
    function handleRegister() {
        history.push('/register')
    }
    return <div className="login" data-testid="login">
        <Wrapper>
            <>
                <Title>Login</Title>
                <FormControl id="username" isRequired>
                    <FormLabel>User Name</FormLabel>
                    <Input type="text" autoComplete="true" autoFocus value={username} onChange={e => setUsername(e.target.value)} />
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
            </>
        </Wrapper>
    </div>
}