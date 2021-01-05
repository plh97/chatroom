import React from 'react'
import Input from '@/components/Input'
import Header from '@/components/Header'
import Message from '@/components/Message'
import UserDetailSidebar from '@/components/UserDetailSidebar'
import './Dashboard.scoped.scss'
import RoomManage from '@/components/RoomManage'
import { ActiveListener } from 'react-event-injector';

export default function Dashboard() {
    // 阻止 Dashborad 页面的横向滚动
    function handlePrevent(e) {
        if (e.deltaX !== 0) {
            e.preventDefault()
        }
    }
    return <ActiveListener onWheel={handlePrevent}>
        <div className="App-Dashboard" data-testid="dashboard">
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
    </ActiveListener>
}
