import React from 'react'
import Input from '../components/Input'
import Header from '../components/Header'
import Message from '../components/Message'
import UserDetailSidebar from '../components/UserDetailSidebar'
import './Dashboard.scss'

export default function Dashboard() {
    return <div className="App-Dashboard" data-testid="dashboard" >
        <div className="container">
            <Header />
            <Message />
            <Input />
            <UserDetailSidebar />
        </div>
    </div>
}
