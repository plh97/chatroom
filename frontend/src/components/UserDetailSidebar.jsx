import React, { useEffect, useRef } from 'react'
import './UserDetailSidebar.less'
import {
    Button,
    Avatar
} from "@chakra-ui/react"
import { useDispatch, useSelector } from 'react-redux'
import Api from '../Api'
import { ACTION_TYPE } from '../utils/constants'

export default function UserDetailSidebar() {
    const dispatch = useDispatch()
    let userInfo = useSelector(state => state.user)
    return <div className="App-UserDetailSidebar" data-testid="userDetailSidebar" >
        {JSON.stringify(userInfo)}
        <Avatar name={userInfo.username} src={userInfo.image} />
    </div>
}
