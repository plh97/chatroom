import React from 'react'
import { Avatar, AvatarBadge, Button } from "@chakra-ui/react"
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import Api from '@src/Api'
import { ACTION_TYPE } from '@src/utils/constants'
import './Header.scoped.scss'

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
    let userInfoDetailSidebar = useSelector(state => state.layout.userInfoDetailSidebar)
    const dispatch = useDispatch();
    async function handleLogout() {
        await Api.logout();
        dispatch({
            type: ACTION_TYPE.LOGOUT
        })
    }
    function handleClick() {
        dispatch({
            type: ACTION_TYPE.SET_LAYOUT,
            payload: {
                userInfoDetailSidebar: !userInfoDetailSidebar
            }
        })
    }
    return <Wrapper className="App-Header" data-testid="header" >
        <Avatar className="avatar" onClick={handleClick} name={userInfo.username} src={userInfo.image}>
            <AvatarBadge boxSize="1em" bg="green.500" />
            {/* <AvatarBadge borderColor="papayawhip" bg="tomato" boxSize="1.25em" /> */}
        </Avatar>
        <Content>{userInfo.username}</Content>
        <Button colorScheme="teal" onClick={handleLogout}>Logout</Button>
    </Wrapper>
}
