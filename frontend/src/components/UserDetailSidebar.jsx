import React, { useRef } from 'react'
import {
    Avatar
} from "@chakra-ui/react"
import { useSelector } from 'react-redux'
import './UserDetailSidebar.less'
// import { ACTION_TYPE } from '../utils/constants'
import cs from 'classnames'
import Api from '../Api'

export default function UserDetailSidebar() {
    // const dispatch = useDispatch()
    const inputFileRef = useRef(null);
    async function handleUploadImage() {
        inputFileRef.current.click()
    }
    async function handleUserInfoChange(e) {
        const form = new FormData();
        [...e.target.files].forEach(file=> {
            form.append('file',file)
        })
        // upload image
        const image = await Api.upload(form)
        await Api.setUserInfo({
            image,
        })
    }
    let userInfo = useSelector(state => state.user)
    let userInfoDetailSidebar = useSelector(state => state.layout.userInfoDetailSidebar)
    return <div className={cs('App-UserDetailSidebar', { active: userInfoDetailSidebar })} data-testid="userDetailSidebar" >
        <input ref={inputFileRef} accept=".jpg,.png,.jpeg" type="file" name="" id="" onChange={handleUserInfoChange} />
        <span className="avatar21" onClick={handleUploadImage} >
            <Avatar size="2xl" name={userInfo.username} src={userInfo.image} />
        </span>
        <p className="name">
            name: {userInfo.username}
        </p>
    </div>
}
