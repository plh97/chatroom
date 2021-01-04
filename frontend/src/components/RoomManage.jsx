import React, { useRef } from 'react'
import {
    Button,
} from "@chakra-ui/react"
import { useSelector, useDispatch } from 'react-redux'
import './RoomManage.scoped.scss'
import Api from '../Api'

export default function RoomManage() {
    let userInfo = useSelector(state => state.user)
    async function handleAddRoom() {
        await Api.addRoom({
            name: 'new room'
        })
    }
    return <div
        className="App-RoomManage"
        data-testid="RoomManage"
    >
        div.handle
        <Button onClick={handleAddRoom}>+ Room</Button>
        {userInfo.room.map(room => <span key={room._id}>{room.name}</span>)}
    </div>
}
