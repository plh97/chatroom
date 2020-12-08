import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    Route,
    Switch,
    Redirect
} from "react-router-dom"
import Api from '../Api'
import { useEffect } from 'react'
import { ACTION_TYPE } from '../utils/constants'
import {
    Spinner
} from "@chakra-ui/react"
import styled from 'styled-components'
import Login from '../views/Login';
import Register from '../views/Register';
import Dashboard from '../views/Dashboard';

const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export default function FrontendAuth(props) {
    let userInfo = useSelector(state => state.user.userInfo)
    let fetchStatus = useSelector(state => state.fetch)
    const dispatch = useDispatch()
    useEffect(() => {
        (async () => {
            if (!userInfo) {
                dispatch({ type: ACTION_TYPE.FETCH_START })
                let newUserInfo = await Api.getUserInfo()
                dispatch({
                    type: ACTION_TYPE.SAVE_USER_INFO,
                    payload: newUserInfo
                })
                const message = await Api.getMessage()
                dispatch({
                    type: ACTION_TYPE.INITIAL_MESSAGE,
                    payload: message
                })
                dispatch({ type: ACTION_TYPE.FETCH_SUCCESS })
            }
        })()
    }, [userInfo, dispatch])
    if (fetchStatus === ACTION_TYPE.FETCH_START) {
        return <Wrapper>
            <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
            />
        </Wrapper>
    } 
    // 如果已经登录
    if (userInfo) {
        if (props.location.pathname === '/login' || props.location.pathname === '/register') {
            return <Redirect to='/' />
        }
    } else {
        if (props.location.pathname !== '/login' && props.location.pathname !== '/register') {
            return <Redirect to='/login' />
        }
    }
    return (
        <Switch>
            <Route path="/register">
                <Register />
            </Route>
            <Route path="/login">
                <Login />
            </Route>
            <Route path="/">
                <Dashboard />
            </Route>
        </Switch>
    )
}
