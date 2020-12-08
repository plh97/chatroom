import React from 'react'
import Header from '../components/Header'
import Message from '../components/Message'
import Input from '../components/Input'
import './Dashboard.less'

export default function Dashboard() {
    return <div className="App-Dashboard" data-testid="dashboard" >
        <div className="container">
            <Header />
            <Message />
            <Input />
        </div>
    </div>
}
