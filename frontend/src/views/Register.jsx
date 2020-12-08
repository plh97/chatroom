import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { ACTION_TYPE } from '../utils/constants'
import Api from '../Api'
import {
    Input,
    Stack,
    Button,
    useToast,
    FormLabel,
    FormControl,
} from "@chakra-ui/react"
import { useHistory } from 'react-router-dom'

const Wrapper = styled.div`
    max-width: 400px;
    width: 90vw;
    margin: 130px auto;
`;
const Title = styled.h1`
    font-size: revert;
    font-weight: initial;
`;


export default function Register() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch();
    const toast = useToast();
    const history = useHistory();
    async function handleRegister() {
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
        await Api.register({
            username,
            password
        })
        dispatch({ type: ACTION_TYPE.FETCH_SUCCESS })
        dispatch({
            type: ACTION_TYPE.SAVE_USER_INFO,
            payload: ''
        })
    }
    function handleLogin() {
        history.push('/login')
    }
    return <div className="login" data-testid="login">
        <Wrapper>
            <>
                <Title>Register</Title>
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
                        <Button onClick={handleLogin} colorScheme="gray">Login</Button>
                        <Button onClick={handleRegister} colorScheme="green">Register</Button>
                    </Stack>
                </FormControl>
            </>
        </Wrapper>
    </div>
}