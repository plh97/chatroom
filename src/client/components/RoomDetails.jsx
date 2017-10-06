import React from 'react'
import { Button ,Avatar, Icon } from 'antd';
import { inject, observer } from "mobx-react"
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
				// this.props.store.socket.emit('change avator',
				// 	{ 
				// 		avatorUrl : success.data.url, 
				// 		userId : userId
				// 	}
				// );
				// document.cookie = 'avatorUrl=' + success.data.url
				// this.state.socket.emit('get list')
			}
		)
	}

	render() {
		const { currentRoomInfo , myInfo , showRoomDetail , onlineUsers } = this.props.store;
		const showRoomDetailListText = [
			{
				title: '群头像',
				onlineUsers: [{userName:currentRoomInfo.name}],
				offlineUsers: []
			},{
				title: '管理员',
				onlineUsers: [...currentRoomInfo.administratorList.filter( e => onlineUsers.indexOf(e.userName) >= 0)],
				offlineUsers: [...currentRoomInfo.administratorList.filter( e => onlineUsers.indexOf(e.userName) == -1)],
			},{
				title: '成员',
				onlineUsers: [...currentRoomInfo.memberList.filter( e => onlineUsers.indexOf(e.userName) >= 0)],
				offlineUsers: [...currentRoomInfo.memberList.filter( e => onlineUsers.indexOf(e.userName) == -1 )]
			}
		]
		return (
			<div id='bodyContentRoomDetails' className={`bodyContentRoomDetails ${showRoomDetail ? 'show' : 'hide'}`}>
				{showRoomDetailListText.map((avators,i) => (
					<div className="showRoomDetailList" key={i}>
						<span className="title">{avators.title}:</span>
						<span className="avatorContainer">
							{[...avators.onlineUsers , ...avators.offlineUsers].map((avator,j)=>(
								<span className="avator" key={j}>
									<Avatar 
										src={avator.avatorUrl}
										className="slideAvator"
										id="showMoreUserInfo"
										size="large"
										style={{
											backgroundColor: j >= avators.onlineUsers.length ? '#aaa' : this.state.color[avator.userName.charCodeAt() % 8],
											// cursor : avator.userName==myInfo.name ? 'pointer':''
										}}>
										{avator.userName.split('')[0]}
									</Avatar>
									{avator.userName == myInfo.name ? <input 
										style={{display:'none'}} 
										onChange={this.handleAvatorChange} 
										value={this.state.file} 
										id='avatorInputFile' 
										className='avatorInputFile' 
										type="file" /> : ""}
									<span className="name">{avator.userName}</span>
								</span>
							))}
						</span>
					</div>
				))}
			</div>
		);
	}
}

