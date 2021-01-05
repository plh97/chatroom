import React, { useEffect } from 'react';
import { Route, Redirect, Switch } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import Api from '@/Api'
import Login from '@/views/Login';
import Register from '@/views/Register';
import Dashboard from '@/views/Dashboard';
import { ACTION_TYPE } from '@/utils/constants';
import Loading from './Loading'

export default function FrontendAuth(props) {
    let userInfo = useSelector(state => state.user)
    let fetchStatus = useSelector(state => state.fetch)
    const dispatch = useDispatch()
    useEffect(() => {
        (async () => {
            if (!userInfo.username) {
                dispatch({ type: ACTION_TYPE.FETCH_START })
                let newUserInfo = await Api.getUserInfo()
                dispatch({
                    type: ACTION_TYPE.SAVE_USER_INFO,
                    payload: newUserInfo
                })
                const data = await Api.getMessage()
                dispatch({
                    type: ACTION_TYPE.ADD_MESSAGE,
                    payload: {
                        ...data,
                        trigger: Math.random()
                    }
                })
                dispatch({ type: ACTION_TYPE.FETCH_SUCCESS })
            }
        })()
    }, [userInfo.trigger, userInfo, dispatch])
    // 如果已经登录
    if (userInfo.username) {
        if (props.location.pathname === '/login' || props.location.pathname === '/register') {
            return <Redirect to='/' />
        }
    } else {
        if (props.location.pathname !== '/login' && props.location.pathname !== '/register') {
            return <Redirect to='/login' />
        }
    }
    return (
        <Loading
            style={{ position: 'fixed', left: 0, top: 0 }}
            isLoading={fetchStatus === ACTION_TYPE.FETCH_START}
        >
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
        </Loading>
    )
}
