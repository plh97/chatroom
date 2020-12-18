import React from 'react'
import {
    Avatar
} from "@chakra-ui/react"
import { useSelector } from 'react-redux'
import './UserDetailSidebar.less'
// import { ACTION_TYPE } from '../utils/constants'
import cs from 'classnames'

export default function UserDetailSidebar() {
    // const dispatch = useDispatch()
    let userInfo = useSelector(state => state.user)
    let userInfoDetailSidebar = useSelector(state => state.layout.userInfoDetailSidebar)
    return <div className={cs('App-UserDetailSidebar', { active: userInfoDetailSidebar })} data-testid="userDetailSidebar" >
        {/* {JSON.stringify(userInfo)} */}
        <Avatar size="2xl" name={userInfo.username} src={userInfo.image} />
        <p className="name">
            name: {userInfo.username}
        </p>
    </div>
}
