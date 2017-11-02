import React, { Component } from 'react'
import {
	Route,
	Link
} from 'react-router-dom'
import { Avatar, Icon } from 'antd'
import BodyContent from '../components/BodyContent.jsx'
import { inject, observer } from "mobx-react"
import {colorList} from '../../../config/client.js'
// import '../less/chat.less'

@inject("store")
@observer
export default class Chat extends Component {
	addRoom = (e) =>{
		const { myInfo } = this.props.store;
		this.props.store.socket({
			url:'add room',
			userId: myInfo.id,
			name: myInfo.name
		})
	}

	render() {
		const { match } = this.props
		const {
			doing,
			//当前房间信息包括所有消息列表，房间用户总人数，管理员
			currentRoomInfo,
			//当前在线用户总
			onlineUsers,
			//登陆用户的个人信息
			myInfo,
			roomList,
		} = this.props.store;
		return (
			<div className="body">
				<div className="slider">
					<h3 className="title">房间列表：</h3>
					{roomList.map((room,i)=>(
						<Link
							className="roomList"
							id={room.name}
							key={i}
							to={`${match.url}/room/${room.name}`}>
							<Avatar
								src={room.avatorUrl}
								className="slideAvator"
								size="large"
								style={{backgroundColor: colorList[room.name.charCodeAt() % 8]}}>
								{room.name.split('')[0]}
							</Avatar>
							<span className="roomName">{room.name}</span>
						</Link>
					))}
					<span onClick={this.addRoom} className="addRoom">
						<Icon type="usergroup-add" />
						开房？
					</span>
				</div>
				<Route path={`${match.url}/room/:id`} component={BodyContent}/>
			</div>
		)
	}
};
