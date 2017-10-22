import React, { Component } from 'react'
import {
	BrowserRouter as Router,
	Route,
	Link
} from 'react-router-dom'
import { Avatar, Icon,Button } from 'antd'
import BodyContent from '../components/BodyContent.jsx'
import { inject, observer } from "mobx-react"
const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae','#712704','#04477c','#1291a9','#000','#036803'];
console.log('process.env.NODE_ENV: ',process.env.NODE_ENV)


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
		}
	}

	addRoom = (e) =>{
		const { myInfo } = this.props.store;
		this.props.store.socket({
			url:'add room',
			userId: myInfo.id,
			name: myInfo.name
		})
	}

	//事件总代理模型
	//all event only Perform their own duties
	handleAllEventClick = (e) => {
		const {
			showRoomDetail ,
			showRoomDetailFunc ,
			showCodeEditFunc ,
			showCodeEdit ,
			showEmoji ,
			showEmojiFunc ,
			showMoreUserInfo,
			showMoreUserInfoFunc
		} = this.props.store
		//avator click
		//whether show avator details
		//如果点中的元素包含showMoreUserInfo,则显示
		let filterDOM = (dom) => {
			return e.nativeEvent.path.filter((index)=> {
				// e.preventDefault()
				return index.id==dom
			}).length > 0
		}
		//如果所点击的元素包括 => id = showMoreUserInfo
		if(filterDOM('showMoreUserInfo')){
			//当你点击的仅仅只是头像的时候
			showMoreUserInfoFunc({
				isShow:true,
				x: e.nativeEvent.view.innerWidth - e.nativeEvent.x - 220 >0 ? e.nativeEvent.x : e.nativeEvent.x - 220,
				y: e.nativeEvent.view.innerHeight - e.nativeEvent.y - 335 >0 ? e.nativeEvent.y : e.nativeEvent.y - 335,
				name:e.nativeEvent.path.filter((index)=> {
					e.preventDefault()
					return index.id=='showMoreUserInfo'
				})[0].innerText,
				avatorUrl:'e.nativeEvent',
			})
		}else if(filterDOM('showMoreUserInfo')){
			// showEmojiFunc(true)
		}else{
			showMoreUserInfoFunc({
				isShow:false,
				// x: 0,
				// y: 0,
				name:'',
				avatorUrl:''
			})
		}
		//是否显示房间细节
		if(e.nativeEvent.path.filter((index)=> {
			return index.className=='toggleDetail'
		}).length > 0){
			showRoomDetailFunc(!showRoomDetail)
		}else if( e.nativeEvent.path.filter((e)=> e.id=='bodyContentRoomDetails' || e.id=='showMoreUserInfoContainer' ).length > 0 ){
			//
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
		){}else{
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
				document.getElementById('bodyContentMessagesInput').focus()
			}
		}else{
			showEmojiFunc(false)
		}
		//Switch Channel
		if(e.nativeEvent.path.filter((index)=> {
			return index.className=='roomList'
		}).length > 0){
			this.props.store.socket({
				url:'get currentRoomInfo',
				name:e.nativeEvent.path.filter((index)=> {
					return index.className=='roomList'
				})[0].id
			})
		}
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
			showRoomDetail,
			showMoreUserInfo
		} = this.props.store;
		return (
			<div className="container" onClick={this.handleAllEventClick}>
				<div className="header">
					<Icon type="left-circle" />
					{currentRoomInfo.name == '' ? <h1>聊天室</h1> : <h1 className='toggleDetail'>
						{currentRoomInfo.name}
						房间(
						{currentRoomInfo.memberList.filter(e=>onlineUsers.indexOf(e.userName)>=0).length}
						/
						{currentRoomInfo.memberList.length}
						)人
						{showRoomDetail ? <Icon type="up" />:<Icon type="down" />}
					</h1>}
					<Avatar
						style={{
							backgroundColor: this.state.color[myInfo.name.charCodeAt() % 8]
						}}
						src={myInfo.avatorUrl}
						size="large">{myInfo.name.split("")[0]}
					</Avatar>
				</div>
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
									style={{backgroundColor: this.state.color[room.name.charCodeAt() % 8]}}>
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
				<div
					id='showMoreUserInfoContainer'
					style={{
						left: showMoreUserInfo.x ,
						top: showMoreUserInfo.y
					}}
					className={`showMoreUserInfo ${showMoreUserInfo.isShow ? 'show' : 'hide'}`}>
					<Avatar
						// src={showMoreUserInfo.avatorUrl}
						className="avator"
						shape='square'
						size="large"
						style={{
							backgroundColor: this.state.color[showMoreUserInfo.name.charCodeAt() % 8],
							cursor : showMoreUserInfo.name==myInfo.name ? 'pointer':''
						}}>
						{showMoreUserInfo.name.split('')[0]}
					</Avatar>
					<span className="info">
						<span className="nameArea">
							<span className="nameContainer">{showMoreUserInfo.name}</span>
							<Icon type="message" />
						</span>
						<span className="nikeNameArea">
							<span className="nikeNameLabel">备注：</span>
							<span className="nikeName">easy to call!</span>
							<span className="placeLabel">地区：</span>
							<span className="place">中国</span>
						</span>
					</span>
				</div>
			</div>
		)
	}
};
