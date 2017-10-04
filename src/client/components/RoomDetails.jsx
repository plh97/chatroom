import React from 'react'
import { Button ,Avatar, Icon } from 'antd';
import {  } from 'antd'

import io from 'socket.io-client';
import { inject, observer } from "mobx-react"
const socket = io(process.env.NODE_ENV === 'production' ? 'http://112.74.63.84/' : 'http://127.0.0.1:8080/');
const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae','#712704','#04477c','#1291a9','#000','#036803'];

@inject("store")
@observer
export default class RoomDetails extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			file:'',
			color: colorList,
		}
	}

	handleAvatorChange = (e) =>{
		let data = new FormData()
		const { doing,userId } = this.props.store;
		this.setState({
			files:e.target.files[0]
		})
		data.append("smfile", this.state.files)
		fetch('https://sm.ms/api/upload', {
		  method: 'POST',
		  body: data
		}).then(
			response => response.json()
		).then(
			success => {
				this.props.store.socket.emit('change avator',
					{ 
						avatorUrl : success.data.url, 
						userId : userId
					}
				);
				document.cookie = 'avatorUrl=' + success.data.url
				this.state.socket.emit('get list')
			}
		)
	}

	render() {
		const { members , myName , nowRoomAdministratorList , showRoomDetail , nowRoom } = this.props.store;
		return (
			<div id='bodyContentRoomDetails' className={`bodyContentRoomDetails ${showRoomDetail ? 'show' : 'hide'}`}>
				<div className="administrator">
					<span className="title">群头像:</span>
					<span className="avatorContainer">
						<span className="avator">
							<Avatar 
								src={nowRoom}
								className="slideAvator"
								size="large"
								style={{backgroundColor: this.state.color[nowRoom.charCodeAt() % 8]}}>
								{nowRoom.split('')[0]}
							</Avatar>
							<input 
								style={{display:'none'}} 
								onChange={this.handleAvatorChange} 
								value={this.state.file} 
								id='avatorInputFile' 
								className='avatorInputFile' 
								type="file" />
							<span className="name">{nowRoom}</span>
						</span>
					</span>
				</div>
				<div className="administrator">
					<span className="title">管理员:</span>
					<span className="avatorContainer">
						{nowRoomAdministratorList.map((nowRoomAdministrator,i)=>(
							<span className="avator" key={i}>
								<Avatar 
									src={nowRoomAdministrator.avatorUrl}
									className="slideAvator"
									size="large"
									style={{backgroundColor: this.state.color[nowRoomAdministrator.userName.charCodeAt() % 8]}}>
									{nowRoomAdministrator.userName.split('')[0]}
								</Avatar>
								{nowRoomAdministrator.userName == myName ? <input 
									style={{display:'none'}} 
									onChange={this.handleAvatorChange} 
									value={this.state.file} 
									id='avatorInputFile' 
									className='avatorInputFile' 
									type="file" /> : ""}
								<span className="name">{nowRoomAdministrator.userName}</span>
							</span>
						))}
					</span>
				</div>
				<div className="members">
					<span className="title">成员:</span>
					<span className="avatorContainer">
						{members.map( ( member,i ) => (
							<span className="avator" key={i}>
								<Avatar 
									src={member.avatorUrl}
									className="slideAvator"
									size="large"
									style={{backgroundColor: this.state.color[member.userName.charCodeAt() % 8]}}>
									{member.userName.split('')[0]}
								</Avatar>
								{member.userName == myName ? <input 
									style={{display:'none'}} 
									onChange={this.handleAvatorChange} 
									value={this.state.file} 
									id='avatorInputFile' 
									className='avatorInputFile' 
									type="file" /> : ""}
								<span className="name">{member.userName}</span>
							</span>
						))}
					</span>
				</div>
			</div>
		);
	}
}

