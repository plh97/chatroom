import React, { Component } from 'react'
import { 
	BrowserRouter as Router,
	Route,
	Link
} from 'react-router-dom'
import { Avatar, Icon,Button } from 'antd'
import io from 'socket.io-client';
import BodyContent from '../components/BodyContent.jsx'
import { inject, observer } from "mobx-react"
const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae','#712704','#04477c','#1291a9','#000','#036803'];
console.log('process.env.NODE_ENV: ',process.env.NODE_ENV)
const socket = io(process.env.NODE_ENV === 'production' ? 'http://112.74.63.84/' : 'http://127.0.0.1:8080/');

@inject("store")
@observer
export default class AsyncApp extends Component {
	constructor(props){
		super(props)
		this.state = {
			color: colorList,
			files:'',
			socket,
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

	addRoom = (e) =>{
		const { userId,myName } = this.props.store;
		this.props.store.socket({
			url:'add room',
			userId:userId,
			roomName:myName
		})
	}

	changeRoom = (e) => {
		this.props.store.socket({
			url:'get messagesList',
			roomName:e
		})
	}

	render() {
		const {match} = this.props
		const { messageList,nowRoom,doing,users,myName,roomsList,nowUsersId } = this.props.store;
		return (
			<div className="container">
				<div className="header">
					<Icon type="left-circle" />
					<h1>{nowRoom == [] ? "Web聊天室2.0" : `${nowRoom}房间(${users.length}/${nowUsersId.length})人`}</h1>
				</div>
				<div className="body">
					<div className="slider">
						<h3 className="title">房间列表：</h3>
						{roomsList.map((room,i)=>(
							<Link 
								onClick = {this.changeRoom.bind(this , room.roomName)}
								className="roomList" 
								key={i} 
								to={`${match.url}/room/${room.roomName}`}>
								<Avatar 
									src={room.avatorUrl}
									className="slideAvator"
									icon='picture'
									size="large"
									style={{backgroundColor: this.state.color[room.roomName.charCodeAt() % 8]}}
								>P</Avatar>
								{room.roomName == myName ? <input 
									style={{display:'none'}} 
									onChange={this.handleAvatorChange} 
									value={this.state.file} 
									id='avatorInputFile' 
									className='avatorInputFile' 
									type="file" /> : ""}
								<span className="roomName">{room.roomName}</span>
							</Link>
						))}
						<span onClick={this.addRoom} className="addRoom">
							<Icon type="usergroup-add" />
							开房？
						</span>

					</div>
					<Route path={`${match.url}/room/:id`} component={BodyContent}/>
				</div>
			</div>
		)
	}
}