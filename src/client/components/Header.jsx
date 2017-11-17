import React, { Component } from 'react'
import { Avatar,Spin, Icon } from 'antd'
import { inject, observer } from "mobx-react"
import {colorList} from '../../../config/client.js'
// import '../less/header.less'

@inject("store")
@observer
export default class Header extends Component {
	render() {
		const { match } = this.props
		const {
			//当前房间信息包括所有消息列表，房间用户总人数，管理员
			currentRoomInfo,
			//当前在线用户总
			onlineUsers,
			//登陆用户的个人信息
			myInfo,
			showRoomDetail,
		} = this.props.store;
		return (
      <div className="header">
        <iframe
    	    style={{marginLeft: "2px", marginBottom:"-5px"}}
    	    frameBorder="0" scrolling="0" width="91px" height="20px"
    	    src="https://ghbtns.com/github-btn.html?user=pengliheng&repo=chatroom&type=star&count=true" >
		</iframe>
			{currentRoomInfo.name == '' ? <h1>github chat</h1> : <h1 className='toggleDetail'>
				{currentRoomInfo.name}
				房间(
				{currentRoomInfo.memberList.filter(e=>onlineUsers.indexOf(e.userName)>=0).length}
				/
				{currentRoomInfo.memberList.length}
				)人
				{showRoomDetail ? <Icon type="up" />:<Icon type="down" />}
			</h1>}
			<Avatar style={{
					backgroundColor: colorList[myInfo.name.charCodeAt() % 8]
				}}
				src={myInfo.avatar_url}
				size="large">{myInfo.name.split("")[0]}
			</Avatar>
			</div>
		)
	}
};
