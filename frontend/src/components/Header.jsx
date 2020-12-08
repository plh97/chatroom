import React from 'react'
import './Header.less'
import {
    Avatar
} from "@chakra-ui/react"
import { useSelector } from 'react-redux'

export default function Header() {
    let userInfo = useSelector(state => state.user.userInfo)
    return <div className="App-Header" data-testid="header" >
        <Avatar name={userInfo.username} />
        {userInfo.username}
    </div>
}
