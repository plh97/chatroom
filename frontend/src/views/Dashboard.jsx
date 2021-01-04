import React from 'react'
import Input from '@/components/Input'
import Header from '../components/Header'
import Message from '../components/Message'
import UserDetailSidebar from '../components/UserDetailSidebar'
import './Dashboard.scoped.scss'
import RoomManage from '@/components/RoomManage'

export default function Dashboard() {
    return <div className="App-Dashboard" data-testid="dashboard" >
        <div className="container">
            <RoomManage />
            <div className="right">
                <Header />
                <Message />
                <Input />
            </div>
            <UserDetailSidebar />
        </div>
    </div>
}
