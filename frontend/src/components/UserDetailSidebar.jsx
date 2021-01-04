import React, { useRef, useState } from 'react'
import {
    Avatar
} from "@chakra-ui/react"
import { useSelector, useDispatch } from 'react-redux'
import './UserDetailSidebar.scoped.scss'
// import { ACTION_TYPE } from '../utils/constants'
import cs from 'classnames'
import Api from '../Api'
import { ACTION_TYPE } from '../utils/constants'

export default function UserDetailSidebar() {
    const dispatch = useDispatch()
    const inputFileRef = useRef(null);
    async function handleUploadImage() {
        inputFileRef.current.click()
    }
    async function handleUserInfoChange(e) {
        const form = new FormData();
        [...e.target.files].forEach(file => {
            form.append('file', file)
        })
        // upload image
        const image = await Api.upload(form)
        let newUserInfo = await Api.setUserInfo({
            image,
        })
        dispatch({
            type: ACTION_TYPE.SAVE_USER_INFO,
            payload: newUserInfo
        })
    }
    let userInfo = useSelector(state => state.user)
    let userInfoDetailSidebar = useSelector(state => state.layout.userInfoDetailSidebar)
    function handleClick() {
        dispatch({
            type: ACTION_TYPE.SET_LAYOUT,
            payload: {
                userInfoDetailSidebar: !userInfoDetailSidebar
            }
        })
    }
    return <div
        className={cs('App-UserDetailSidebar', { active: userInfoDetailSidebar })}
        data-testid="userDetailSidebar"
        onClick={handleClick}
    >
        <div className="sidebar" onClick={e=>e.stopPropagation()}>
            <input ref={inputFileRef} accept=".jpg,.png,.jpeg" type="file" name="" id="" onChange={handleUserInfoChange} />
            <span onClick={handleUploadImage} >
                <Avatar size="2xl" name={userInfo.username} src={userInfo.image} />
            </span>
            <p className="name">
                Name: {userInfo.username}
            </p>
            <h3 className="room-title">Room</h3>
            <div className="room">
                <span>{userInfo.room}</span>
            </div>
        </div>
    </div>
}
