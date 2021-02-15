import React, { useEffect } from 'react';
import { Route, Redirect, Switch } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import Login from '@src/views/Login';
import Register from '@src/views/Register';
import Dashboard from '@src/views/Dashboard';
import { ACTION_TYPE } from '@src/utils/constants';
import Loading from './Loading'
import { getMyUserInfo } from '@src/store/actions/user'

export default function FrontendAuth(props) {
    let userInfo = useSelector(state => state.user)
    let fetchStatus = useSelector(state => state.fetch)
    const dispatch = useDispatch()
    useEffect(() => {
        (async () => {
            if (!userInfo.username) {
                dispatch({ type: ACTION_TYPE.FETCH_START })
                dispatch(getMyUserInfo())
                dispatch({ type: ACTION_TYPE.FETCH_SUCCESS })
            }
        })()
    }, [userInfo.trigger, userInfo, dispatch])
    // 如果已经登录
    if (fetchStatus !== ACTION_TYPE.FETCH_START) {
        if (userInfo.username) {
            if (props.location.pathname === '/login' || props.location.pathname === '/register') {
                return <Redirect to='/' />
            }
        } else {
            if (props.location.pathname !== '/login' && props.location.pathname !== '/register') {
                return <Redirect to='/login' />
            }
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
                <Route path="/room/:id">
                    <Dashboard />
                </Route>
            </Switch>
        </Loading>
    )
}
