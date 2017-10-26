import React, { Component } from 'react'
import { inject, observer } from "mobx-react"
import Header from "../features/Header.jsx"
import Chat from "../features/Chat.jsx"
import UserDetails from "../features/UserDetails.jsx"

//TodoList
//1.show memberList feature.....  √ I Get It
//2.change avatorImage feature
//3.change roomAvatorImage feature
//4.to debug the login/tokenLogin/register

@inject("store")
@observer
export default class AsyncApp extends Component {
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
				<Header/>
				<Chat match={match}/>
				<UserDetails/>
			</div>
		)
	}
};
