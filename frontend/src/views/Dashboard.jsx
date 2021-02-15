import React from 'react'
import Input from '@src/components/Input'
import Header from '@src/components/Header'
import Message from '@src/components/Message'
import UserDetailSidebar from '@src/components/UserDetailSidebar'
import './Dashboard.scoped.scss'
import RoomManage from '@src/components/RoomManage'
import { ActiveListener } from 'react-event-injector';
import { useRouteMatch } from "react-router-dom";

export default function Dashboard() {
    // 阻止 Dashborad 页面的横向滚动
    function handlePrevent(e) {
        if (e.deltaX !== 0) {
            e.preventDefault()
        }
    }
    let match = useRouteMatch("/room/:roomId");
    return <ActiveListener onWheel={handlePrevent}>
        <div className="App-Dashboard" data-testid="dashboard">
            <div className="container">
                <RoomManage match={match} />
                {
                    match ?
                        <div className="right">
                            <Header />
                            <Message {...match.params} />
                            <Input {...match.params} />
                        </div>
                        :
                        <div className="right">
                            <Header />
                        </div>
                }
                <UserDetailSidebar />
            </div>
        </div>
    </ActiveListener>
}
