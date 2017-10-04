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


//TodoList
//1.show memberList feature.....
//2.change avatorImage feature
//3.change roomAvatorImage feature
//4.to debug the login/tokenLogin/register

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

	addRoom = (e) =>{
		const { userId,myName } = this.props.store;
		this.props.store.socket({
			url:'add room',
			userId:userId,
			roomName:myName
		})
	}

	//事件总代理模型
	//all event only Perform their own duties
	handleAllEventClick = (e) => {
		const { showRoomDetail , showRoomDetailFunc , nowRoomFunc , showCodeEditFunc , showCodeEdit , showEmoji , showEmojiFunc } = this.props.store
		//是否显示房间细节
		if(e.nativeEvent.path.filter((index)=> {
			return index.className=='toggleDetail'
		}).length > 0){
			showRoomDetailFunc(!showRoomDetail)
		}else if(
			e.nativeEvent.path.filter((index)=> {
				return index.id=='bodyContentRoomDetails'
			}).length > 0
		){
			showRoomDetailFunc(true)
		}else{
			showRoomDetailFunc(false)
		}
		//是否显示代码编辑器
		if(e.nativeEvent.path.filter((index)=> {
			return index.className=='codingClick'
		}).length > 0){
			showCodeEditFunc(!showCodeEdit)
		}else if(
			e.nativeEvent.path.filter((index)=> {
				return index.id=='textArea'
			}).length > 0
		){
			showCodeEditFunc(true)
		}else{
			showCodeEditFunc(false)
		}
		//是否显示Emoji
		if(e.nativeEvent.path.filter((index)=> {
			return index.id=='emojiClick'
		}).length > 0){
			showEmojiFunc(!showEmoji)
		}else if(
			e.nativeEvent.path.filter((index)=> {
				return index.id=='emojiContainer'
			}).length > 0
		){
			if(e.nativeEvent.path[0].innerText.length==2){
				document.getElementById('bodyContentMessagesInput').value += e.nativeEvent.path[0].innerText
			}
			showEmojiFunc(true)
		}else{
			showEmojiFunc(false)
		}
		//Switch Channel
		if(e.nativeEvent.path.filter((index)=> {
			return index.className=='roomList'
		}).length > 0){
			this.props.store.socket({
				url:'get messagesList',
				roomName:e.nativeEvent.path.filter((index)=> {
					return index.className=='roomList'
				})[0].id
			})
		}
	}

	render() {
		const { match } = this.props
		const { messageList,nowRoom,doing,users,myName,roomsList,members,showRoomDetail,myAvatorUrl } = this.props.store;
		return (
			<div className="container" onClick={this.handleAllEventClick}>
				<div className="header">
					<Icon type="left-circle" />
					{nowRoom == [] ? <h1>Web聊天室2.0</h1> : <h1 className='toggleDetail'>
						{nowRoom}
						房间(
						{members.filter(e=>users.indexOf(e.userName)>=0).length}
						/
						{members.length}
						)人
						{showRoomDetail ? <Icon type="up" />:<Icon type="down" />}
					</h1>}
					<Avatar
						style={{ 
							backgroundColor: this.state.color[myName.charCodeAt() % 8] 
						}}
						src={myAvatorUrl}
						size="large">{myName.split("")[0]}
					</Avatar>
				</div>
				<div className="body">
					<div className="slider">
						<h3 className="title">房间列表：</h3>
						{roomsList.map((room,i)=>(
							<Link 
								className="roomList" 
								id={room.roomName}
								key={i} 
								to={`${match.url}/room/${room.roomName}`}>
								<Avatar 
									src={room.avatorUrl}
									className="slideAvator"
									size="large"
									style={{backgroundColor: this.state.color[room.roomName.charCodeAt() % 8]}}>
									{room.roomName.split('')[0]}
								</Avatar>
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