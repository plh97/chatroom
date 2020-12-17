import React from 'react'
import './Header.less'
import {
    Avatar,
    Button,
    useToast
} from "@chakra-ui/react"
import { useDispatch, useSelector } from 'react-redux'
import Api from '../Api'
import { ACTION_TYPE } from '../utils/constants'
import styled from 'styled-components'

const Wrapper = styled.div`
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 10px;
    padding-bottom: 10px;
`;

const Content = styled.span`
padding: 0 10px;
`

export default function Header() {
    let userInfo = useSelector(state => state.user)
    const dispatch = useDispatch();
    const toast = useToast();
    async function handleLogout() {
        await Api.logout();
        dispatch({
            type: ACTION_TYPE.SAVE_USER_INFO,
            payload: null
        })
    }
    return <Wrapper className="App-Header" data-testid="header" >
        <Avatar name={userInfo.username} src={userInfo.image} />
        <Content>{userInfo.username}</Content>
        <Button colorScheme="teal" onClick={handleLogout}>Logout</Button>
    </Wrapper>
}
