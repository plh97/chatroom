import React, { useEffect } from 'react';
import { Route, Redirect, Switch } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import Api from '../Api'
import Login from '../views/Login';
import Register from '../views/Register';
import Dashboard from '../views/Dashboard';
import { ACTION_TYPE } from '../utils/constants';

export default function FrontendAuth(props) {
    let userInfo = useSelector(state => state.user)
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
