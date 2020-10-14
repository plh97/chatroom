import React from 'react'
import { useSelector } from 'react-redux'
import {
    Route,
    Redirect
} from "react-router-dom"
import Api from '../Api'

import Login from '../views/login'
import Dashboard from '../views/dashboard'
import { useEffect } from 'react'

export default function FrontendAuth(props) {
    let userInfo = useSelector(state => state.user.userInfo)
    useEffect(() => {
        async function fetchData() {
            if (!userInfo) {
                // eslint-disable-next-line
                userInfo = await Api.getUserInfo()
                debugger
            }
        }
        fetchData()
    }, [])
    if (userInfo) {
        if (props.location.pathname !== '/') {
            return <Redirect to='/' />
        }
        return <Route path="/">
            <Dashboard />
        </Route>
    } else {
        if (props.location.pathname === '/login') {
            return <Route path="/login">
                <Login />
            </Route>
        }
        return <Redirect to='/login' />
    }
}
